import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const IncidentResponseForm = () => {
    const [response, setResponse] = useState('')
    const [action, setAction] = useState('acknowledge')
    const { executeAction } = useAdminActions()

    const handleSubmitResponse = async () => {
        await executeAction(
            async () => {
                // TODO: Call API to submit incident response
                return { success: true, message: `Incident ${action}d successfully` }
            },
            {
                loadingMessage: 'Submitting response...',
                successMessage: `Response submitted successfully (${action})`,
                errorMessage: 'Failed to submit response'
            }
        )
        setResponse('')
        setAction('acknowledge')
    }

    const handleCancel = () => {
        setResponse('')
        setAction('acknowledge')
    }

    return (
        <div className='space-y-4 p-4 rounded border border-slate-700/50 bg-slate-900/30'>
            <h3 className='font-bold text-slate-200'>Respond to Incident</h3>

            <select
                value={action}
                onChange={e => setAction(e.target.value)}
                className='w-full px-3 py-2 bg-slate-800 border border-slate-700/50 rounded text-slate-300 focus:outline-none focus:border-amber-500/50'
                aria-label='Incident response action'
            >
                <option value='acknowledge'>Acknowledge</option>
                <option value='escalate'>Escalate</option>
                <option value='resolve'>Resolve</option>
            </select>

            <textarea
                value={response}
                onChange={e => setResponse(e.target.value)}
                placeholder='Add response notes...'
                className='w-full px-3 py-2 bg-slate-800 border border-slate-700/50 rounded text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 h-24'
            />

            <div className='flex gap-2'>
                <button 
                    onClick={handleSubmitResponse}
                    disabled={!response}
                    className='flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded font-bold border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    Submit Response
                </button>
                <button 
                    onClick={handleCancel}
                    className='flex-1 px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded font-bold border border-slate-600/30'
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}
