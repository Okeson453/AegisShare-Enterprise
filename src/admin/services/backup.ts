import api from '@/services/api'
import type { Snapshot, RecoveryTest, RtoRpo, BackupSchedule } from '../types'

export const backupService = {
    listSnapshots: async (): Promise<Snapshot[]> => {
        const { data } = await api.get('/admin/backups/snapshots')
        return data
    },

    createSnapshot: async (name: string, type: 'manual' | 'scheduled'): Promise<Snapshot> => {
        const { data } = await api.post('/admin/backups/snapshots', { name, type })
        return data
    },

    getSnapshot: async (id: string): Promise<Snapshot> => {
        const { data } = await api.get(`/admin/backups/snapshots/${id}`)
        return data
    },

    restoreSnapshot: async (id: string): Promise<{ jobId: string }> => {
        const { data } = await api.post(`/admin/backups/snapshots/${id}/restore`)
        return data
    },

    verifySnapshot: async (id: string): Promise<{ valid: boolean }> => {
        const { data } = await api.post(`/admin/backups/snapshots/${id}/verify`)
        return data
    },

    listRecoveryTests: async (): Promise<RecoveryTest[]> => {
        const { data } = await api.get('/admin/backups/recovery-tests')
        return data
    },

    startRecoveryTest: async (snapshotId: string): Promise<RecoveryTest> => {
        const { data } = await api.post('/admin/backups/recovery-tests', { snapshotId })
        return data
    },

    getRtoRpo: async (): Promise<RtoRpo> => {
        const { data } = await api.get('/admin/backups/rto-rpo')
        return data
    },

    updateBackupSchedule: async (schedule: BackupSchedule): Promise<BackupSchedule> => {
        const { data } = await api.patch('/admin/backups/schedule', schedule)
        return data
    },
}
