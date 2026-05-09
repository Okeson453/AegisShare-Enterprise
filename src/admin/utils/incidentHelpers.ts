import type { Incident, Priority } from '../types'

const priorityColors = {
    P0: { bg: 'bg-red-900/30', border: 'border-red-500', text: 'text-red-400', label: 'Critical Outage' },
    P1: { bg: 'bg-red-900/20', border: 'border-red-500/60', text: 'text-red-300', label: 'Major Issue' },
    P2: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/60', text: 'text-yellow-300', label: 'Minor Issue' },
    P3: { bg: 'bg-blue-900/20', border: 'border-blue-500/60', text: 'text-blue-300', label: 'Low Priority' },
    P4: { bg: 'bg-gray-900/20', border: 'border-gray-500/60', text: 'text-gray-300', label: 'Information' },
}

export const getPriorityColor = (priority: Priority) => priorityColors[priority]

export const calculateSlaStatus = (incident: Incident) => {
    const percentRemaining = (incident.slaRemaining / incident.slaTarget) * 100
    if (percentRemaining > 50) return 'healthy'
    if (percentRemaining > 20) return 'warning'
    return 'critical'
}

export const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
}
