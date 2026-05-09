import { useEffect, useState } from 'react'
import { useIncidentStore } from '@/admin/store'
import { incidentsService } from '@/admin/services'
import type { Incident } from '@/admin/types'

export const useIncidents = () => {
    const { incidents, stats, setIncidents, setStats } = useIncidentStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const data = await incidentsService.listIncidents()
                const incidentStats = await incidentsService.getStats()
                setIncidents(data)
                setStats(incidentStats)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch incidents')
            } finally {
                setLoading(false)
            }
        }

        fetch()
    }, [setIncidents, setStats])

    const createIncident = async (incident: Omit<Incident, 'id' | 'detectedAt'>) => {
        try {
            await incidentsService.createIncident(incident)
            const data = await incidentsService.listIncidents()
            setIncidents(data)
        } catch (err) {
            throw err
        }
    }

    const updateIncident = async (id: string, updates: Partial<Incident>) => {
        try {
            await incidentsService.updateIncident(id, updates)
            const data = await incidentsService.listIncidents()
            setIncidents(data)
        } catch (err) {
            throw err
        }
    }

    return { incidents, stats, loading, error, createIncident, updateIncident }
}
