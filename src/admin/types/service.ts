export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'restarting'

export interface ServiceMetrics {
    latencyP50Ms: number
    latencyP99Ms: number
    cpuPercent: number
    memoryMb: number
    uptimePercent: number
    requestsPerMin: number
}

export interface ServiceReplicas {
    running: number
    total: number
}

export interface ServiceHealth {
    id: string
    name: string
    status: ServiceStatus
    version: string
    lastRestartAt: string
    replicas: ServiceReplicas
    metrics: ServiceMetrics
    uptime: number // 0-1 decimal
    latency: number // milliseconds
    errorRate: number // 0-1 decimal
    throughput: number // requests per second
    lastChecked: string // ISO timestamp
}

export interface SystemHealth {
    totalServices: number
    healthyCount: number
    degradedCount: number
    downCount: number
    overallStatus: ServiceStatus
    timestamp: string
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    activeConnections: number
    services: ServiceHealth[]
}
