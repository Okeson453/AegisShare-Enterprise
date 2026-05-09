import api from '@/services/api'
import type { Region, ErasureRequest, TransferLog } from '../types'

export const sovereigntyService = {
    listRegions: async (): Promise<Region[]> => {
        const { data } = await api.get('/admin/sovereignty/regions')
        return data
    },

    updateRegion: async (id: string, updates: Partial<Region>): Promise<Region> => {
        const { data } = await api.patch(`/admin/sovereignty/regions/${id}`, updates)
        return data
    },

    listErasureRequests: async (): Promise<ErasureRequest[]> => {
        const { data } = await api.get('/admin/sovereignty/erasure')
        return data
    },

    approveErasure: async (id: string): Promise<ErasureRequest> => {
        const { data } = await api.post(`/admin/sovereignty/erasure/${id}/approve`)
        return data
    },

    rejectErasure: async (id: string, reason: string): Promise<ErasureRequest> => {
        const { data } = await api.post(`/admin/sovereignty/erasure/${id}/reject`, { reason })
        return data
    },

    listTransferLog: async (): Promise<TransferLog[]> => {
        const { data } = await api.get('/admin/sovereignty/transfers')
        return data
    },
}
