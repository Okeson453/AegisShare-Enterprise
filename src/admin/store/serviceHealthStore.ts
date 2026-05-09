import { create } from 'zustand'
import type { ServiceHealth } from '../types'

interface ServiceHealthStore {
    services: ServiceHealth[]
    pollInterval: number
    isPolling: boolean

    setServices: (services: ServiceHealth[]) => void
    updateService: (id: string, updates: Partial<ServiceHealth>) => void
    setPolling: (isPolling: boolean) => void
    setPollInterval: (interval: number) => void
}

export const useServiceHealthStore = create<ServiceHealthStore>((set) => ({
    services: [],
    pollInterval: 10000,
    isPolling: false,

    setServices: (services) => set({ services }),
    updateService: (id, updates) => set((state) => ({
        services: state.services.map((s) => s.id === id ? { ...s, ...updates } : s),
    })),
    setPolling: (isPolling) => set({ isPolling }),
    setPollInterval: (interval) => set({ pollInterval: interval }),
}))
