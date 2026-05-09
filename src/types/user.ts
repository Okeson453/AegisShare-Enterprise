export interface User {
    id: string
    email: string
    name: string
    initials: string
    role: UserRole
    clearance: ClearanceLevel
    abacAttributes: AbacAttributes
    mfaEnabled: boolean
    mfa: boolean
    sso: boolean
    ssoEnabled: boolean
    riskLevel: RiskLevel
    lastLogin?: string
    lastSeen: string
    createdAt: string
    fileCount: number
    geo: string
}

export enum ClearanceLevel {
    L0 = 0,
    L1 = 1,
    L2 = 2,
    L3 = 3,
    L4 = 4,
    L5 = 5,
}

export type UserRole = 'SUPER_ADMIN' | 'SECURITY_ADMIN' | 'AUDITOR' | 'USER' | 'READONLY' | 'admin' | 'user' | 'auditor' | 'guest' | 'Admin' | 'Compliance'

export interface AbacAttributes {
    department?: string
    location?: string
    clearance?: string
    [key: string]: any
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface Session {
    id: string
    userId: string
    ipAddress: string
    userAgent: string
    createdAt: string
    expiresAt: string
    isActive: boolean
}
