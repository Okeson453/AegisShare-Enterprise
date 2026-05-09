export interface Snapshot {
  id: string
  name: string
  createdAt: string
  completedAt: string
  sizeGB: number
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  type: 'automatic' | 'manual' | 'scheduled'
  retentionPolicy: string
  backupLocation: string
  verifyHash: string
  canRestore: boolean
}

export interface RecoveryTest {
  id: string
  snapshotId: string
  startedAt: string
  completedAt?: string
  status: 'scheduled' | 'running' | 'success' | 'failed'
  validationPassed: boolean
  dataIntegrityChecks: number
  failureReason?: string
}

export interface RtoRpo {
  recoveryTimeObjective: number
  recoveryPointObjective: number
  lastTestAt: string
  lastTestStatus: 'passed' | 'failed'
  slaCompliance: number
  recommendations: string[]
}

export interface BackupSchedule {
  id: string
  frequency: 'hourly' | 'daily' | 'weekly'
  retentionDays: number
  timeOfDay?: string
  nextScheduledAt: string
  enabled: boolean
}
