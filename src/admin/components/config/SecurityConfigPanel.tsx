import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const SecurityConfigPanel = () => {
    const [mfaRequired, setMfaRequired] = useState(true)
    const [ipWhitelist, setIpWhitelist] = useState(true)
    const [sessionTimeout, setSessionTimeout] = useState(30)
    const { executeAction } = useAdminActions()

    const handleSaveSettings = async () => {
        await executeAction(
            async () => ({
                success: true,
                message: 'Security settings updated'
            }),
            {
                loadingMessage: 'Saving security settings...',
                successMessage: 'Security settings updated successfully',
                errorMessage: 'Failed to save settings'
            }
        )
    }

    return (
        <div className='space-y-4'>
            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={mfaRequired}
                        onChange={(e) => setMfaRequired(e.target.checked)}
                        className='w-4 h-4 rounded'
                        aria-label='Require MFA for all admin users'
                    />
                    <span className='text-slate-300 font-medium'>Require MFA for all admins</span>
                </label>
            </div>

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={ipWhitelist}
                        onChange={(e) => setIpWhitelist(e.target.checked)}
                        className='w-4 h-4 rounded'
                        aria-label='Enable IP whitelist'
                    />
                    <span className='text-slate-300 font-medium'>Enable IP whitelist</span>
                </label>
            </div>

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <label className='block text-slate-300 font-medium mb-2'>Session Timeout (minutes)</label>
                <input
                    type='number'
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                    min='5'
                    max='480'
                    className='w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm'
                    aria-label='Session timeout duration'
                />
            </div>

            <button
                onClick={handleSaveSettings}
                className='w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded font-bold border border-green-500/30'
            >
                Save Security Settings
            </button>
        </div>
    )
}
