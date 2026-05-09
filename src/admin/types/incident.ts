export type IncidentPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'
export type Priority = IncidentPriority
export type IncidentStatus = 'open' | 'investigating' | 'mitigating' | 'resolved' | 'closed'

export interface Incident {
    id: string
    priority: IncidentPriority
    title: string
    description: string
    service: string
    status: IncidentStatus
    createdAt: string
    acknowledgedAt?: string
    resolvedAt?: string
    owner?: string
    assignedTo?: string
    affectedUsers?: number
    affectedServices?: string[]
    slaTarget: number // milliseconds
    slaRemaining: number // milliseconds
    estimatedResolution?: string
}

export interface IncidentStats {
    total: number
    open: number
    investigating: number
    mitigating: number
    resolved: number
}

export interface IncidentResponse {
    incidentId: string
    action: 'acknowledge' | 'resolve' | 'escalate' | 'assign'
    notes?: string
    assigneeId?: string
    timestamp: string
}

export interface PostMortem {
    incidentId: string
    title: string
    rootCause: string
    resolution: string
    preventiveMeasures: string[]
    createdAt: string
    author: string
}
