import api from '@/services/api'
import type { AdminUser, AdminAction, SystemConfigType } from '../types'

export const adminUsersService = {
    listAdminUsers: async (): Promise<AdminUser[]> => {
        const { data } = await api.get('/admin/users')
        return data
    },

    getAdminUser: async (id: string): Promise<AdminUser> => {
        const { data } = await api.get(`/admin/users/${id}`)
        return data
    },

    provisionUser: async (user: Omit<AdminUser, 'id' | 'auditedAt'>): Promise<AdminUser> => {
        const { data } = await api.post('/admin/users/provision', user)
        return data
    },

    deprovisionUser: async (id: string, reason: string): Promise<void> => {
        await api.post(`/admin/users/${id}/deprovision`, { reason })
    },

    editUser: async (id: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
        const { data } = await api.patch(`/admin/users/${id}`, updates)
        return data
    },

    resetMfa: async (id: string): Promise<{ secret: string }> => {
        const { data } = await api.post(`/admin/users/${id}/reset-mfa`)
        return data
    },
}

export const adminAuditService = {
    listActions: async (actor?: string): Promise<AdminAction[]> => {
        const { data } = await api.get('/admin/audit', { params: { actor } })
        return data
    },

    getAction: async (id: string): Promise<AdminAction> => {
        const { data } = await api.get(`/admin/audit/${id}`)
        return data
    },

    listSystemEvents: async (): Promise<AdminAction[]> => {
        const { data } = await api.get('/admin/events')
        return data
    },
}

export const systemConfigService = {
    getConfig: async (key: string): Promise<SystemConfigType> => {
        const { data } = await api.get(`/admin/config/${key}`)
        return data
    },

    updateConfig: async (key: string, value: any): Promise<SystemConfigType> => {
        const { data } = await api.patch(`/admin/config/${key}`, { value })
        return data
    },

    allConfigs: async (): Promise<SystemConfigType[]> => {
        const { data } = await api.get('/admin/config')
        return data
    },
}
