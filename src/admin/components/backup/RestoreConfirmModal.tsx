import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

interface Props {
    snapshotId: string
    snapshotDate: string
    onSuccess?: () => void
}

export const RestoreConfirmModal = ({ snapshotId, snapshotDate, onSuccess }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const { confirmDangerAction, executeAction } = useAdminActions()

    const handleRestore = async () => {
        if (confirmText === 'RESTORE') {
            await executeAction(
                async () => {
                    // TODO: Call API to restore from snapshot
                    return { success: true, message: `System restored from snapshot ${snapshotId}` }
                },
                {
                    loadingMessage: 'Restoring system from snapshot...',
                    successMessage: `System successfully restored to ${snapshotDate}`,
                    errorMessage: 'Failed to restore from snapshot'
                }
            )
            setIsOpen(false)
            setConfirmText('')
            onSuccess?.()
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className='bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold py-2 px-4 rounded transition-colors'
                aria-label='Restore from snapshot'
            >
                Restore from Snapshot
            </button>

            {isOpen && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded'>
                    <div className='bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-sm'>
                        <h3 className='text-lg font-bold text-slate-100 mb-4'>Restore from Snapshot?</h3>

                        <p className='text-sm text-slate-400 mb-4'>
                            This will restore the system to snapshot <span className='font-mono'>{snapshotId}</span> from {snapshotDate}. This action cannot be undone.
                        </p>

                        <div className='mb-6'>
                            <label className='block text-sm text-slate-300 mb-2'>
                                Type "RESTORE" to confirm
                            </label>
                            <input
                                type='text'
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                                className='w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm'
                                placeholder='RESTORE'
                                aria-label='Confirmation text input'
                            />
                        </div>

                        <div className='flex gap-3'>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded transition-colors'
                                aria-label='Cancel restore'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRestore}
                                disabled={confirmText !== 'RESTORE'}
                                className='flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white font-bold py-2 rounded transition-colors'
                                aria-label='Confirm restore'
                            >
                                Restore
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
