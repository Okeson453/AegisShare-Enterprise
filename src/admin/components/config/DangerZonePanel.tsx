import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const DangerZonePanel = () => {
    const [confirmText, setConfirmText] = useState('')
    const [showWarning, setShowWarning] = useState(false)
    const { confirmDangerAction } = useAdminActions()

    const handleResetSystem = async () => {
        if (confirmText === 'RESET_SYSTEM') {
            const confirmed = await confirmDangerAction({
                title: 'Reset System to Defaults',
                message: 'This will reset ALL system configuration to defaults. This action CANNOT be undone.',
                confirmPhrase: 'RESET_SYSTEM',
                onConfirm: () => { /* TODO: API call */ }
            })
            if (confirmed) {
                // TODO: API call to reset system
                setConfirmText('')
                setShowWarning(false)
            }
        }
    }

    return (
        <div className='bg-red-500/5 border border-red-500/30 rounded-lg p-6'>
            <h3 className='text-lg font-bold text-red-400 mb-4'>⚠️ Danger Zone</h3>

            <div className='space-y-3'>
                <button
                    onClick={() => setShowWarning(true)}
                    className='w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-bold py-2 rounded transition-colors'
                    aria-label='Reset system to defaults'
                >
                    Reset System to Defaults
                </button>

                {showWarning && (
                    <div className='bg-red-500/10 border border-red-500/30 rounded p-4'>
                        <p className='text-sm text-red-300 mb-3'>
                            This will reset all system configuration to defaults. Type "RESET_SYSTEM" to confirm.
                        </p>
                        <input
                            type='text'
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                            placeholder='RESET_SYSTEM'
                            className='w-full bg-slate-800 border border-red-500/30 rounded px-3 py-2 text-slate-200 text-sm mb-3'
                            aria-label='Reset system confirmation input'
                        />
                        <div className='flex gap-2'>
                            <button
                                onClick={() => {
                                    setShowWarning(false)
                                    setConfirmText('')
                                }}
                                className='flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded transition-colors'
                                aria-label='Cancel reset'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetSystem}
                                disabled={confirmText !== 'RESET_SYSTEM'}
                                className='flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white font-bold py-2 rounded transition-colors'
                                aria-label='Confirm reset'
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
