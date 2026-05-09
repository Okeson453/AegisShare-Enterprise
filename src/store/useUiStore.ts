/**
 * UI Store - Global state management for AegisShare v4
 * Manages tab states, modals, notifications, and UI preferences
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface UiStore {
    // Tab States
    activeTab: string
    setActiveTab: (tab: string) => void

    // Modal States
    modals: Record<string, boolean>
    openModal: (key: string) => void
    closeModal: (key: string) => void
    toggleModal: (key: string) => void

    // Sidebar State
    sidebarOpen: boolean
    toggleSidebar: () => void

    // Theme
    theme: 'dark' | 'light'
    setTheme: (theme: 'dark' | 'light') => void

    // Notifications
    notifications: Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>
    addNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
    removeNotification: (id: string) => void

    // Selected Items
    selectedItem: string | null
    setSelectedItem: (item: string | null) => void

    // Edit Mode
    editMode: boolean
    setEditMode: (mode: boolean) => void

    // Filters
    activeFilters: Record<string, string[]>
    setFilter: (key: string, values: string[]) => void
    clearFilters: () => void
}

export const useUiStore = create<UiStore>()(
    subscribeWithSelector((set) => ({
        // Tab States
        activeTab: 'overview',
        setActiveTab: (tab: string) => set({ activeTab: tab }),

        // Modal States
        modals: {},
        openModal: (key: string) => set((state) => ({ modals: { ...state.modals, [key]: true } })),
        closeModal: (key: string) => set((state) => ({ modals: { ...state.modals, [key]: false } })),
        toggleModal: (key: string) =>
            set((state) => ({
                modals: { ...state.modals, [key]: !state.modals[key] },
            })),

        // Sidebar State
        sidebarOpen: true,
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        // Theme
        theme: (localStorage.getItem('aegisshare-ui-theme') as 'dark' | 'light') || 'dark',
        setTheme: (theme: 'dark' | 'light') => {
            localStorage.setItem('aegisshare-ui-theme', theme)
            set({ theme })
        },

        // Notifications
        notifications: [],
        addNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') =>
            set((state) => ({
                notifications: [
                    ...state.notifications,
                    { id: `notif-${Date.now()}`, message, type },
                ],
            })),
        removeNotification: (id: string) =>
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            })),

        // Selected Items
        selectedItem: null,
        setSelectedItem: (item: string | null) => set({ selectedItem: item }),

        // Edit Mode
        editMode: false,
        setEditMode: (mode: boolean) => set({ editMode: mode }),

        // Filters
        activeFilters: {},
        setFilter: (key: string, values: string[]) =>
            set((state) => ({
                activeFilters: { ...state.activeFilters, [key]: values },
            })),
        clearFilters: () => set({ activeFilters: {} }),
    }))
)

export default useUiStore
