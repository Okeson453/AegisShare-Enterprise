import type { ServiceStatus } from '../types'

const statusColors = {
  healthy: { bg: 'bg-green-900/20', border: 'border-green-500/30', text: 'text-green-400', icon: '●' },
  degraded: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: '◐' },
  down: { bg: 'bg-red-900/20', border: 'border-red-500/30', text: 'text-red-400', icon: '○' },
  restarting: { bg: 'bg-gray-900/20', border: 'border-gray-500/30', text: 'text-gray-400', icon: '↻' },
}

export const getStatusColor = (status: ServiceStatus) => statusColors[status]

export const getStatusLabel = (status: ServiceStatus) => {
  const labels: Record<ServiceStatus, string> = {
    healthy: 'Healthy',
    degraded: 'Degraded',
    down: 'Down',
    restarting: 'Restarting',
  }
  return labels[status]
}
