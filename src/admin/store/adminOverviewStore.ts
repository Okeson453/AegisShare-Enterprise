import { create } from 'zustand'
import type { SystemHealth, ServiceHealth } from '../types'

interface AdminOverviewStore {
  systemHealth: SystemHealth | null
  incidents: { open: number; total: number }
  uptime: number
  lastSync: string
  setSystemHealth: (health: SystemHealth) => void
  setIncidents: (open: number, total: number) => void
  setUptime: (uptime: number) => void
}

export const useAdminOverviewStore = create<AdminOverviewStore>((set) => ({
  systemHealth: null,
  incidents: { open: 0, total: 0 },
  uptime: 0,
  lastSync: new Date().toISOString(),
  
  setSystemHealth: (health) => set({ systemHealth: health, lastSync: new Date().toISOString() }),
  setIncidents: (open, total) => set({ incidents: { open, total } }),
  setUptime: (uptime) => set({ uptime }),
}))
