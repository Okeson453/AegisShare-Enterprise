export interface License {
  id: string
  customerId: string
  tier: 'starter' | 'professional' | 'enterprise'
  startDate: string
  expiryDate: string
  quotaSeats: number
  quotaStorage: number
  quotaApiCalls: number
  autoRenew: boolean
  terms: string
}

export interface SeatUsage {
  licensed: number
  used: number
  available: number
  utilizationPercent: number
  trend: 'up' | 'down' | 'stable'
}

export interface FeatureFlag {
  id: string
  name: string
  description: string
  isEnabled: boolean
  tier: 'starter' | 'professional' | 'enterprise' | 'all'
  rolledOutPercent: number
  createdAt: string
  updatedAt: string
  updatedBy: string
}

export interface UsageAnalytics {
  date: string
  activeUsers: number
  seatsUsed: number
  storageUsedGB: number
  apiCallsProcessed: number
  averageResponseTime: number
}
