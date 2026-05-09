export interface Region {
  id: string
  code: string
  name: string
  dataCenter: string
  compliance: string[]
  active: boolean
  replicationFactor: number
  backupRegion?: string
}

export interface ErasureRequest {
  id: string
  userId: string
  requestedAt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  dataTypes: string[]
  reason: 'GDPR' | 'user_request' | 'account_deletion'
  completedAt?: string
  verificationHash: string
}

export interface TransferLog {
  id: string
  fromRegion: string
  toRegion: string
  dataCategory: string
  bytesTransferred: number
  timestamp: string
  approvedBy: string
  reason: string
  complianceJustification: string
}

export interface DataSovereigntyPolicy {
  id: string
  name: string
  primaryRegion: string
  allowedRegions: string[]
  restrictedJurisdictions: string[]
  minReplicationFactor: number
  enforced: boolean
}
