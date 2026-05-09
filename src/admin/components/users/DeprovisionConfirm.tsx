import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

interface Props {
    userEmail: string
    onClose?: () => void
}

export const DeprovisionConfirm = ({ userEmail, onClose }: Props) => {
    const [confirmEmail, setConfirmEmail] = useState('')
    const { confirmDangerAction } = useAdminActions()

    const handleDeprovision = async () => {
        const confirmed = await confirmDangerAction({
            title: 'Confirm Deprovision',
            message: `This will immediately revoke all access for ${userEmail}. This action cannot be undone.`,
            confirmPhrase: userEmail,
            onConfirm: async () => { /* API call to deprovision user */ }
        })

        if (confirmed) {
            // TODO: Call API to deprovision user
            onClose?.()
        }
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-slate-900 border-2 border-red-500/50 rounded-lg p-6 max-w-md w-full space-y-4'>
                <h3 className='text-xl font-bold text-red-300'>Confirm Deprovision</h3>
                <p className='text-slate-400'>This will immediately revoke all access for {userEmail}. Type the email to confirm:</p>

                <input
                    type='text'
                    value={confirmEmail}
                    onChange={e => setConfirmEmail(e.target.value)}
                    placeholder='user@company.com'
                    className='w-full px-3 py-2 bg-slate-800 border border-slate-700/50 rounded text-slate-300 focus:outline-none focus:border-red-500/50'
                />

                <div className='flex gap-2'>
                    <button
                        onClick={handleDeprovision}
                        disabled={confirmEmail !== userEmail}
                        className='flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded font-bold border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Deprovision
                    </button>
                    <button
                        onClick={onClose}
                        className='flex-1 px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded font-bold'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
