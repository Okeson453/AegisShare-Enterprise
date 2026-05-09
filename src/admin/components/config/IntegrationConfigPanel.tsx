import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const IntegrationConfigPanel = () => {
    const [integrations, setIntegrations] = useState([
        { name: 'Slack', enabled: true },
        { name: 'Datadog', enabled: true },
        { name: 'ServiceNow', enabled: false },
        { name: 'PagerDuty', enabled: true },
    ])
    const { executeAction } = useAdminActions()

    const toggleIntegration = (idx: number) => {
        const updated = [...integrations]
        updated[idx].enabled = !updated[idx].enabled
        setIntegrations(updated)
    }

    const handleSaveIntegrations = async () => {
        await executeAction(
            async () => ({ success: true }),
            {
                loadingMessage: 'Saving integrations...',
                successMessage: 'Integration settings updated',
                errorMessage: 'Failed to save integration settings'
            }
        )
    }

    return (
        <div className='space-y-4'>
            <div className='space-y-3'>
                {integrations.map((integration, idx) => (
                    <div key={idx} className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between'>
                        <span className='text-slate-300 font-medium'>{integration.name}</span>
                        <button
                            onClick={() => toggleIntegration(idx)}
                            className={`w-12 h-6 rounded-full transition-colors ${integration.enabled ? 'bg-green-600' : 'bg-slate-700'
                                }`}
                            aria-label={`Toggle ${integration.name} integration`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full bg-white transition-transform ${integration.enabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={handleSaveIntegrations}
                className='w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded font-bold border border-green-500/30'
            >
                Save Integration Settings
            </button>
        </div>
    )
}
