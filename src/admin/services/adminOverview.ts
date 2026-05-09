import api from '@/services/api'
import type { SystemHealth, ServiceHealth } from '../types'

export const adminOverviewService = {
    getSystemHealth: async (): Promise<SystemHealth> => {
        const { data } = await api.get('/admin/health')
        return data
    },

    getServices: async (): Promise<ServiceHealth[]> => {
        const { data } = await api.get('/admin/services')
        return data
    },

    getServiceById: async (id: string): Promise<ServiceHealth> => {
        const { data } = await api.get(`/admin/services/${id}`)
        return data
    },

    getUptime: async (): Promise<{ uptime: number }> => {
        const { data } = await api.get('/admin/uptime')
        return data
    },
}
