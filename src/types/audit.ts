export interface AuditEvent {
    id: string
    seq: number
    type: EventType
    eventType: 'critical' | 'high' | 'info'
    actor: string
    actorId: string
    actorName: string
    user: string
    resource: string
    resourceId: string
    resourceType?: string
    action: string
    result: 'SUCCESS' | 'FAILURE' | 'PARTIAL'
    outcome?: 'SUCCESS' | 'FAILURE' | 'PARTIAL'
    sourceIp: string
    ip: string
    actorIp: string
    geo: string
    actorGeo: string
    userAgent: string
    timestamp: string
    hash: string
    prevHash: string
    chainHash: string
    merkleRoot: string
    verified: boolean
    risk: 'low' | 'medium' | 'high'
    metadata: object
}

export type EventType =
    | 'FILE_UPLOAD'
    | 'FILE_DELETE'
    | 'FILE_SHARE'
    | 'KEY_ROTATION'
    | 'POLICY_UPDATE'
    | 'USER_LOGIN'
    | 'USER_LOGOUT'
    | 'ACCESS_DENIED'

export interface MerkleBlock {
    sequence: number
    hash: string
    prevHash: string
    timestamp: string
    events: AuditEvent[]
}

export interface ChainVerification {
    isValid: boolean
    brokenAt?: number
    reason?: string
}

export interface SignedReport {
    id: string
    startDate: string
    endDate: string
    eventCount: number
    signature: string
    downloadUrl: string
    createdAt: string
}
