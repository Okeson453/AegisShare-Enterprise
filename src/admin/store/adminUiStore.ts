import { create } from 'zustand'

interface AdminUiStore {
    activeNav: string
    activeTab: string
    openModals: Record<string, boolean>
    sidebarCollapsed: boolean

    setActiveNav: (nav: string) => void
    setActiveTab: (tab: string) => void
    toggleModal: (modalId: string, state?: boolean) => void
    toggleSidebar: () => void
    collapseSidebar: (state: boolean) => void
}

export const useAdminUiStore = create<AdminUiStore>((set) => ({
    activeNav: 'overview',
    activeTab: 'overview',
    openModals: {},
    sidebarCollapsed: false,

    setActiveNav: (nav) => set({ activeNav: nav }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    toggleModal: (modalId, state) => set((s) => ({
        openModals: { ...s.openModals, [modalId]: state ?? !s.openModals[modalId] },
    })),
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    collapseSidebar: (state) => set({ sidebarCollapsed: state }),
}))
