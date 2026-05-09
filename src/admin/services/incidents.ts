import api from '@/services/api'
import type { Incident, IncidentStats } from '../types'

export const incidentsService = {
    listIncidents: async (filter?: string): Promise<Incident[]> => {
        const { data } = await api.get('/admin/incidents', { params: { filter } })
        return data
    },

    getIncident: async (id: string): Promise<Incident> => {
        const { data } = await api.get(`/admin/incidents/${id}`)
        return data
    },

    createIncident: async (incident: Omit<Incident, 'id' | 'detectedAt'>): Promise<Incident> => {
        const { data } = await api.post('/admin/incidents', incident)
        return data
    },

    updateIncident: async (id: string, updates: Partial<Incident>): Promise<Incident> => {
        const { data } = await api.patch(`/admin/incidents/${id}`, updates)
        return data
    },

    resolveIncident: async (id: string, notes?: string): Promise<Incident> => {
        const { data } = await api.post(`/admin/incidents/${id}/resolve`, { notes })
        return data
    },

    addResponse: async (incidentId: string, action: string, notes?: string) => {
        const { data } = await api.post(`/admin/incidents/${incidentId}/response`, { action, notes })
        return data
    },

    getStats: async (): Promise<IncidentStats> => {
        const { data } = await api.get('/admin/incidents/stats')
        return data
    },
}
