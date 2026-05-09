import { create } from 'zustand'

export interface ModalState {
  id: string
  isOpen: boolean
}

interface ModalStore {
  modals: Map<string, ModalState>
  open: (id: string) => void
  close: (id: string) => void
  isOpen: (id: string) => boolean
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: new Map(),

  open: (id) => {
    set((state) => {
      const newModals = new Map(state.modals)
      newModals.set(id, { id, isOpen: true })
      return { modals: newModals }
    })
  },

  close: (id) => {
    set((state) => {
      const newModals = new Map(state.modals)
      const modal = newModals.get(id)
      if (modal) {
        modal.isOpen = false
      }
      return { modals: newModals }
    })
  },

  isOpen: (id) => {
    const state = get()
    return state.modals.get(id)?.isOpen ?? false
  },
}))
