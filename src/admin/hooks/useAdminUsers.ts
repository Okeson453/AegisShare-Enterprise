import { useEffect, useState } from 'react'
import { useAdminUsersStore } from '@/admin/store'
import { adminUsersService } from '@/admin/services'
import type { AdminUser } from '@/admin/types'

export const useAdminUsers = () => {
  const { users, setUsers, addUser, updateUser, removeUser } = useAdminUsersStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await adminUsersService.listAdminUsers()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch admin users')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [setUsers])

  const provision = async (user: Omit<AdminUser, 'id' | 'auditedAt'>) => {
    try {
      const created = await adminUsersService.provisionUser(user)
      addUser(created)
    } catch (err) {
      throw err
    }
  }

  const deprovision = async (id: string, reason: string) => {
    try {
      await adminUsersService.deprovisionUser(id, reason)
      removeUser(id)
    } catch (err) {
      throw err
    }
  }

  const edit = async (id: string, updates: Partial<AdminUser>) => {
    try {
      const updated = await adminUsersService.editUser(id, updates)
      updateUser(id, updated)
    } catch (err) {
      throw err
    }
  }

  return { users, loading, error, provision, deprovision, edit }
}
