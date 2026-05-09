import { create } from 'zustand'

interface PolicyState {
    policies: object[]
    pdpResults: object | null
    simulationState: object | null
    setPolicies: (policies: object[]) => void
    setPdpResults: (results: object) => void
    setSimulationState: (state: object) => void
}

export const usePolicyStore = create<PolicyState>((set) => ({
    policies: [],
    pdpResults: null,
    simulationState: null,

    setPolicies: (policies: object[]) => set({ policies }),
    setPdpResults: (results: object) => set({ pdpResults: results }),
    setSimulationState: (state: object) => set({ simulationState: state }),
}))
