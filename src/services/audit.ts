import api from './api'

export const auditService = {
    getEvents: async (limit?: number) => {
        const { data } = await api.get('/audit/events', { params: { limit } })
        return data
    },

    getChain: async () => {
        const { data } = await api.get('/audit/chain')
        return data
    },

    verifyChain: async () => {
        const { data } = await api.get('/audit/chain/verify')
        return data
    },

    exportReport: async () => {
        const { data } = await api.get('/audit/report/export')
        return data
    },
}
