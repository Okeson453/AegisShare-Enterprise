export interface RootKey {
    id: string
    status: KeyStatus
    createdAt: string
    lastRotated?: string
    metadata: object
}

export interface Kek {
    id: string
    rkId: string
    status: KeyStatus
    createdAt: string
    metadata: object
}

export interface Dek {
    id: string
    kekId: string
    status: KeyStatus
    createdAt: string
    expiresAt?: string
    fileId: string
}

export type KeyStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_ROTATION' | 'RETIRED'

export interface HsmCluster {
    id: string
    name: string
    region: string
    primary: HsmNode
    backup?: HsmNode
    status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE'
    keyCount: number
    capacity: number
    type: string
}

export interface HsmNode {
    id: string
    status: 'ONLINE' | 'OFFLINE'
    serialNumber: string
    firmwareVersion: string
}

export interface RotationEntry {
    keyId: string
    keyType: 'RK' | 'KEK' | 'DEK'
    scheduledDate: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
}

export type Algorithm = 'AES-256-GCM' | 'ECIES' | 'ARGON2ID' | 'HMAC-SHA256'
