import { useState, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth'
import { MOCK_USERS } from '@/services/mock/users'

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true'

export const useAuth = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        accessToken,
        user,
        mfaVerified,
        setAuth,
        logout: storeLogout,
    } = useAuthStore()

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true)
        setError(null)
        try {
            if (MOCK_MODE) {
                await new Promise(r => setTimeout(r, 300))
                const mockUser = MOCK_USERS[0]
                setAuth('mock-token-123', mockUser, new Date(Date.now() + 3600000).toISOString())
            } else {
                const response = await authService.login(email, password)
                setAuth(response.accessToken, response.user, new Date(Date.now() + 3600000).toISOString())
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
            // Fallback to mock
            try {
                const mockUser = MOCK_USERS[0]
                setAuth('mock-token-123', mockUser, new Date(Date.now() + 3600000).toISOString())
            } catch { }
        } finally {
            setLoading(false)
        }
    }, [setAuth])

    const logout = useCallback(() => {
        storeLogout()
    }, [storeLogout])

    return {
        accessToken,
        user,
        mfaVerified,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!accessToken,
    }
}
