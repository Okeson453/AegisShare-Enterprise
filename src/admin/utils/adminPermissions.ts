import type { AdminClearanceLevel } from '../types'

const clearanceHierarchy: Record<AdminClearanceLevel, number> = {
  L1: 1, L2: 2, L3: 3, L4: 4, L5: 5,
}

export const canPerformAction = (userClearance: AdminClearanceLevel, requiredClearance: AdminClearanceLevel): boolean => {
  return clearanceHierarchy[userClearance] >= clearanceHierarchy[requiredClearance]
}

export const isSuperAdmin = (clearance: AdminClearanceLevel): boolean => clearance === 'L5'

export const canAccessDangerZone = (clearance: AdminClearanceLevel): boolean => clearance === 'L5'

export const canManageUsers = (clearance: AdminClearanceLevel): boolean => clearance >= 'L3'

export const canViewAuditLog = (clearance: AdminClearanceLevel): boolean => clearance >= 'L2'
