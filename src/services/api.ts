import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Event emitter for auth-related events
export const authEvents = new EventTarget()

export const AUTH_EVENTS = {
  UNAUTHORIZED: 'auth:unauthorized',
  SESSION_EXPIRED: 'auth:session-expired',
} as const

const apiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Request interceptor
 * - Attaches Authorization header with JWT token
 * - Adds X-Request-ID for request tracing
 */
apiClient.interceptors.request.use((config) => {
    const authStore = useAuthStore.getState()
    const token = authStore.accessToken

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // Add request ID for tracing
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return config
})

/**
 * Response interceptor
 * - Handles 401: Clears auth and emits event for router to redirect
 * - Handles 5xx: Logs error details
 * - Handles network errors: Shows connection error
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const authStore = useAuthStore.getState()

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Clear auth state
            authStore.logout()
            
            // Emit event for router to handle redirect
            // Components listening to this event will navigate to login
            authEvents.dispatchEvent(
                new CustomEvent(AUTH_EVENTS.UNAUTHORIZED, {
                    detail: { message: 'Unauthorized. Please log in again.' },
                })
            )
            
            return Promise.reject(error)
        }

        // Handle 5xx Server Errors
        if (error.response?.status && error.response.status >= 500) {
            const errorMsg = `Server error: ${error.response.status} ${error.response.statusText}`
            console.error('[API Error]', errorMsg, error.response.data)
        }

        // Handle network errors
        if (!error.response) {
            console.error('[Network Error]', error.message)
        }

        return Promise.reject(error)
    }
)

export { apiClient }
export default apiClient
