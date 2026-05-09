import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const AutomationConfigPanel = () => {
    const [autoBackup, setAutoBackup] = useState(true)
    const [autoReporting, setAutoReporting] = useState(true)
    const [backupFrequency, setBackupFrequency] = useState('daily')
    const { executeAction } = useAdminActions()

    const handleSaveAutomation = async () => {
        await executeAction(
            async () => ({ success: true }),
            {
                loadingMessage: 'Saving automation settings...',
                successMessage: 'Automation settings updated',
                errorMessage: 'Failed to save automation settings'
            }
        )
    }

    return (
        <div className='space-y-4'>
            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={autoBackup}
                        onChange={(e) => setAutoBackup(e.target.checked)}
                        className='w-4 h-4 rounded'
                        aria-label='Enable automatic backups'
                    />
                    <span className='text-slate-300 font-medium'>Enable automatic backups</span>
                </label>
            </div>

            {autoBackup && (
                <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                    <label className='block text-slate-300 font-medium mb-2'>Backup Frequency</label>
                    <select
                        value={backupFrequency}
                        onChange={(e) => setBackupFrequency(e.target.value)}
                        className='w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm'
                        aria-label='Backup frequency selection'
                    >
                        <option value='hourly'>Hourly</option>
                        <option value='daily'>Daily</option>
                        <option value='weekly'>Weekly</option>
                    </select>
                </div>
            )}

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={autoReporting}
                        onChange={(e) => setAutoReporting(e.target.checked)}
                        className='w-4 h-4 rounded'
                        aria-label='Enable automatic compliance reporting'
                    />
                    <span className='text-slate-300 font-medium'>Enable automatic reporting</span>
                </label>
            </div>
            <button
                onClick={handleSaveAutomation}
                className='w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded font-bold border border-green-500/30'
            >
                Save Automation Settings
            </button>
        </div>
    )
}
