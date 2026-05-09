import api from './api'

export const threatService = {
    getAlerts: async () => {
        const { data } = await api.get('/threat/alerts')
        return data
    },

    getAnomalies: async () => {
        const { data } = await api.get('/threat/anomalies')
        return data
    },

    getIpReputation: async (ip: string) => {
        const { data } = await api.get(`/threat/ip/${ip}`)
        return data
    },

    dismissAlert: async (alertId: string) => {
        await api.post(`/threat/alerts/${alertId}/dismiss`)
    },
}
