import { useEffect, useState } from 'react'
import { useServiceHealthStore } from '@/admin/store'
import { adminOverviewService } from '@/admin/services'

export const useServiceHealth = () => {
  const { services, isPolling, pollInterval, setServices, setPolling } = useServiceHealthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isPolling) return

    const fetch = async () => {
      setLoading(true)
      try {
        const data = await adminOverviewService.getServices()
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services')
      } finally {
        setLoading(false)
      }
    }

    fetch()
    const interval = setInterval(fetch, pollInterval)
    return () => clearInterval(interval)
  }, [isPolling, pollInterval, setServices])

  return { services, loading, error, setPolling }
}
