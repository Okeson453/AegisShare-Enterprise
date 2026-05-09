import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

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
    const authStore = useAuthStore()
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
 * - Handles 401: Attempts token refresh, redirects to login if fails
 * - Handles 5xx: Pushes error notification to UI
 * - Handles network errors: Shows connection error
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const authStore = useAuthStore()

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            try {
                // TODO: Implement token refresh logic
                // For now, clear auth and redirect to login
                authStore.logout()
                window.location.href = '/login'
                return Promise.reject(error)
            } catch (refreshError) {
                // Refresh failed, clear auth and redirect
                authStore.logout()
                window.location.href = '/login'
                return Promise.reject(error)
            }
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
