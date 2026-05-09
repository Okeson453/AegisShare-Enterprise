import api from './api'

export const authService = {
    login: async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password })
        return data
    },

    logout: async () => {
        await api.post('/auth/logout')
    },

    refreshToken: async (refreshToken: string) => {
        const { data } = await api.post('/auth/refresh', { refreshToken })
        return data
    },

    verifyMfa: async (code: string) => {
        const { data } = await api.post('/auth/mfa/verify', { code })
        return data
    },
}
