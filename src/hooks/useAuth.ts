import { useState, useCallback, useEffect } from 'react'
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
        sessionExpiresAt,
        setAuth,
        logout: storeLogout,
    } = useAuthStore()

    // ── Session Expiration Check ────────────────────────────────────────────
    useEffect(() => {
        if (!sessionExpiresAt || !accessToken) return

        const checkExpiration = () => {
            const now = Date.now()
            const expiresAt = new Date(sessionExpiresAt).getTime()

            // If session has expired, log out immediately
            if (now >= expiresAt) {
                setError('Session expired. Please log in again.')
                storeLogout()
            }
        }

        // Check immediately on mount
        checkExpiration()

        // Check every 30 seconds for expiration
        const interval = setInterval(checkExpiration, 30000)
        return () => clearInterval(interval)
    }, [sessionExpiresAt, accessToken, storeLogout])

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true)
        setError(null)
        try {
            if (MOCK_MODE) {
                // Only in development mode: use mock for testing
                await new Promise(r => setTimeout(r, 300))
                const mockUser = MOCK_USERS[0]
                setAuth('mock-token-123', mockUser, new Date(Date.now() + 3600000).toISOString())
            } else {
                // Production: only use real auth service
                const response = await authService.login(email, password)
                setAuth(response.accessToken, response.user, new Date(Date.now() + 3600000).toISOString())
            }
        } catch (err) {
            // Security: Never fall back to mock in production
            // In production, auth failure must remain a failure
            setError(err instanceof Error ? err.message : 'Login failed')
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
