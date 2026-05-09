import { useEffect, useState } from 'react'
import { useAdminOverviewStore } from '@/admin/store'
import { adminOverviewService } from '@/admin/services'

export const useAdminOverview = () => {
  const { systemHealth, setSystemHealth } = useAdminOverviewStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const health = await adminOverviewService.getSystemHealth()
        setSystemHealth(health)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch system health')
      } finally {
        setLoading(false)
      }
    }

    fetch()
    const interval = setInterval(fetch, 10000)
    return () => clearInterval(interval)
  }, [setSystemHealth])

  return { systemHealth, loading, error }
}
