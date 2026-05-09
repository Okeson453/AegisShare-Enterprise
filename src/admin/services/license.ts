import api from '@/services/api'
import type { License, FeatureFlag, UsageAnalytics } from '../types'

export const licenseService = {
    getLicense: async (): Promise<License> => {
        const { data } = await api.get('/admin/license')
        return data
    },

    renewLicense: async (): Promise<License> => {
        const { data } = await api.post('/admin/license/renew')
        return data
    },

    listFeatureFlags: async (): Promise<FeatureFlag[]> => {
        const { data } = await api.get('/admin/features')
        return data
    },

    toggleFeatureFlag: async (id: string, enabled: boolean): Promise<FeatureFlag> => {
        const { data } = await api.patch(`/admin/features/${id}`, { isEnabled: enabled })
        return data
    },

    getUsageAnalytics: async (days?: number): Promise<UsageAnalytics[]> => {
        const { data } = await api.get('/admin/usage', { params: { days } })
        return data
    },
}
