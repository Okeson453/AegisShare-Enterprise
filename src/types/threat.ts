export interface ThreatAlert {
    id: string
    severity: AlertSeverity
    type: string
    message: string
    sourceIp?: string
    timestamp: string
    resolved: boolean
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'

export interface AnomalyScore {
    metric: string
    score: number
    threshold: number
    timestamp: string
    isAnomalous: boolean
}

export interface IpReputation {
    ip: string
    reputation: 'TRUSTED' | 'MONITORED' | 'BLOCKED'
    threatLevel: AlertSeverity
    asnNumber: string
    country: string
    lastSeen: string
    threatHistory: string[]
}

export type ThreatAction = 'ALLOW' | 'MONITOR' | 'BLOCK'
