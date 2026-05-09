import { useEffect, useState } from 'react'
import { backupService } from '@/admin/services'
import type { Snapshot, RecoveryTest, RtoRpo } from '@/admin/types'

export const useBackup = () => {
    const [snapshots, setSnapshots] = useState<Snapshot[]>([])
    const [recoveryTests, setRecoveryTests] = useState<RecoveryTest[]>([])
    const [rtoRpo, setRtoRpo] = useState<RtoRpo | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const [snap, tests, rto] = await Promise.all([
                    backupService.listSnapshots(),
                    backupService.listRecoveryTests(),
                    backupService.getRtoRpo(),
                ])
                setSnapshots(snap)
                setRecoveryTests(tests)
                setRtoRpo(rto)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch backup data')
            } finally {
                setLoading(false)
            }
        }

        fetch()
    }, [])

    const createSnapshot = async (name: string) => {
        try {
            const snapshot = await backupService.createSnapshot(name, 'manual')
            setSnapshots([snapshot, ...snapshots])
            return snapshot
        } catch (err) {
            throw err
        }
    }

    const restore = async (snapshotId: string) => {
        try {
            return await backupService.restoreSnapshot(snapshotId)
        } catch (err) {
            throw err
        }
    }

    return { snapshots, recoveryTests, rtoRpo, loading, error, createSnapshot, restore }
}
