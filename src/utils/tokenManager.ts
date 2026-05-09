/**
 * JWT Token Management
 * Handles secure token storage, validation, and refresh
 */

interface TokenPayload {
    sub: string // Subject (user ID)
    exp: number // Expiration
    iat: number // Issued at
    aud?: string // Audience
    [key: string]: any
}

interface TokenConfig {
    storageKey?: string
    expirationBuffer?: number // milliseconds before expiration to consider invalid (default: 60s)
}

export class TokenManager {
    private storageKey: string
    private expirationBuffer: number

    constructor(config: TokenConfig = {}) {
        this.storageKey = config.storageKey || 'auth_token'
        this.expirationBuffer = config.expirationBuffer || 60000 // 1 minute
    }

    /**
     * Store JWT token in sessionStorage (more secure than localStorage)
     * Only store tokens for same-origin requests
     */
    setToken(token: string): void {
        if (!this.isValidToken(token)) {
            throw new Error('Invalid token format')
        }
        try {
            sessionStorage.setItem(this.storageKey, token)
        } catch (err) {
            console.error('Failed to store token:', err)
        }
    }

    /**
     * Retrieve JWT token from session storage
     */
    getToken(): string | null {
        try {
            return sessionStorage.getItem(this.storageKey)
        } catch (err) {
            console.error('Failed to retrieve token:', err)
            return null
        }
    }

    /**
     * Decode JWT without verification (use only for client-side checks)
     * NEVER trust these values for authorization - always verify on server
     */
    decodeToken(token: string): TokenPayload | null {
        try {
            const parts = token.split('.')
            if (parts.length !== 3) return null

            const payload = JSON.parse(atob(parts[1]!))
            return payload as TokenPayload
        } catch (err) {
            console.error('Failed to decode token:', err)
            return null
        }
    }

    /**
     * Check if token is structurally valid and not expired
     */
    isValidToken(token: string): boolean {
        const payload = this.decodeToken(token)
        if (!payload) return false

        // Check expiration with buffer
        const expirationTime = payload.exp * 1000
        const now = Date.now()
        return expirationTime - this.expirationBuffer > now
    }

    /**
     * Check if token is expired or will expire soon
     */
    isExpired(token?: string): boolean {
        const tokenToCheck = token || this.getToken()
        if (!tokenToCheck) return true

        const payload = this.decodeToken(tokenToCheck)
        if (!payload) return true

        const expirationTime = payload.exp * 1000
        return expirationTime - this.expirationBuffer <= Date.now()
    }

    /**
     * Clear token from storage
     */
    clearToken(): void {
        try {
            sessionStorage.removeItem(this.storageKey)
        } catch (err) {
            console.error('Failed to clear token:', err)
        }
    }

    /**
     * Get time remaining until expiration (in milliseconds)
     */
    getTimeUntilExpiration(): number {
        const token = this.getToken()
        if (!token) return 0

        const payload = this.decodeToken(token)
        if (!payload) return 0

        const expirationTime = payload.exp * 1000
        const timeRemaining = expirationTime - Date.now()
        return Math.max(0, timeRemaining)
    }
}

export const tokenManager = new TokenManager()
