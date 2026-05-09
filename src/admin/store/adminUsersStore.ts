import { create } from 'zustand'
import type { AdminUser } from '../types'

interface AdminUsersStore {
  users: AdminUser[]
  total: number
  
  setUsers: (users: AdminUser[]) => void
  setTotal: (total: number) => void
  addUser: (user: AdminUser) => void
  updateUser: (id: string, updates: Partial<AdminUser>) => void
  removeUser: (id: string) => void
}

export const useAdminUsersStore = create<AdminUsersStore>((set) => ({
  users: [],
  total: 0,
  
  setUsers: (users) => set({ users }),
  setTotal: (total) => set({ total }),
  addUser: (user) => set((state) => ({ users: [...state.users, user], total: state.total + 1 })),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map((u) => u.id === id ? { ...u, ...updates } : u),
  })),
  removeUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id),
    total: state.total - 1,
  })),
}))
