export type AdminClearanceLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'compliance' | 'security' | 'devops'
  clearanceLevel: AdminClearanceLevel
  active: boolean
  lastLogin?: string
  mfaEnabled: boolean
  ipWhitelist: string[]
  restrictions: AdminRestriction[]
  auditedAt: string
}

export interface AdminRestriction {
  resource: string
  action: string
  allowed: boolean
  reason?: string
}

export interface AdminAction {
  id: string
  actor: string
  action: string
  resource: string
  resourceId: string
  changes?: Record<string, any>
  result: 'success' | 'failure'
  timestamp: string
  ipAddress: string
  userAgent: string
}

export interface SystemConfigType {
  id: string
  key: string
  value: any
  type: 'boolean' | 'string' | 'number' | 'json'
  updatedBy: string
  updatedAt: string
  description?: string
}

export interface DangerZoneAction {
  id: string
  name: string
  description: string
  riskLevel: 'high' | 'critical'
  confirmation: string
  disabled: boolean
}
