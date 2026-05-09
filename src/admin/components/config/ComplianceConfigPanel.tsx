import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const ComplianceConfigPanel = () => {
    const [gdprEnabled, setGdprEnabled] = useState(true)
    const [hipaaEnabled, setHipaaEnabled] = useState(true)
    const [dataRetention, setDataRetention] = useState(365)
    const { executeAction } = useAdminActions()

    const handleSaveCompliance = async () => {
        await executeAction(
            async () => ({ success: true }),
            {
                loadingMessage: 'Saving compliance settings...',
                successMessage: 'Compliance settings updated',
                errorMessage: 'Failed to save compliance settings'
            }
        )
    }

    return (
        <div className='space-y-4'>
            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={gdprEnabled}
                        onChange={(e) => setGdprEnabled(e.target.checked)}
                        className='w-4 h-4 rounded'
                        aria-label='Enable GDPR compliance'
                    />
                    <span className='text-slate-300 font-medium'>GDPR Compliance</span>
                </label>
            </div>

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={hipaaEnabled}
                        onChange={(e) => setHipaaEnabled(e.target.checked)}
                        className='w-4 h-4 rounded'
                        aria-label='Enable HIPAA compliance'
                    />
                    <span className='text-slate-300 font-medium'>HIPAA Compliance</span>
                </label>
            </div>

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <label className='block text-slate-300 font-medium mb-2'>Data Retention (days)</label>
                <input
                    type='number'
                    value={dataRetention}
                    onChange={(e) => setDataRetention(Number(e.target.value))}
                    min='30'
                    max='2555'
                    className='w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm'
                    aria-label='Data retention duration'
                />
                <p className='text-xs text-slate-500 mt-2'>~{Math.round(dataRetention / 365)} years</p>
            </div>
            <button
                onClick={handleSaveCompliance}
                className='w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded font-bold border border-green-500/30'
            >
                Save Compliance Settings
            </button>
        </div>
    )
}
