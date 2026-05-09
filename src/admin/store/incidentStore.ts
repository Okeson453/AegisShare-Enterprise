import { create } from 'zustand'
import type { Incident, IncidentStats } from '../types'

interface IncidentStore {
  incidents: Incident[]
  stats: IncidentStats
  activeIncidentId: string | null
  
  setIncidents: (incidents: Incident[]) => void
  setStats: (stats: IncidentStats) => void
  addIncident: (incident: Incident) => void
  updateIncident: (id: string, updates: Partial<Incident>) => void
  setActiveIncident: (id: string | null) => void
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: [],
  stats: { total: 0, open: 0, investigating: 0, mitigating: 0, resolved: 0, avgResolutionTime: 0, cumulativeDowntime: 0 },
  activeIncidentId: null,
  
  setIncidents: (incidents) => set({ incidents }),
  setStats: (stats) => set({ stats }),
  addIncident: (incident) => set((state) => ({ incidents: [incident, ...state.incidents] })),
  updateIncident: (id, updates) => set((state) => ({
    incidents: state.incidents.map((i) => i.id === id ? { ...i, ...updates } : i),
  })),
  setActiveIncident: (id) => set({ activeIncidentId: id }),
}))
