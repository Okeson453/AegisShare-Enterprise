// @ts-nocheck  
import { RecoveryTestPanel, RestoreConfirmModal } from '../../components/backup'

export const RecoveryPlans = () => {
    return (
        <div className='space-y-6'>
            <RecoveryTestPanel />
            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-6'>
                <h3 className='text-lg font-bold text-slate-100 mb-4'>Restore Options</h3>
                <RestoreConfirmModal snapshotId='snap-latest' snapshotDate={new Date().toISOString().split('T')[0]} />
            </div>
        </div>
    )
}
