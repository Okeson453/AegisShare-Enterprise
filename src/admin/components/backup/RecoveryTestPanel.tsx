import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const RecoveryTestPanel = () => {
    const [isRunning, setIsRunning] = useState(false)
    const [result, setResult] = useState<'success' | 'failed' | null>(null)
    const { executeAction } = useAdminActions()

    const handleRunTest = async () => {
        setIsRunning(true)
        setResult(null)

        await executeAction(
            async () => {
                // Simulate test run
                return { success: true, message: 'Recovery test completed successfully' }
            },
            {
                loadingMessage: 'Running recovery test...',
                successMessage: 'Recovery test passed',
                errorMessage: 'Recovery test failed'
            }
        )

        setIsRunning(false)
        setResult('success')
        setTimeout(() => setResult(null), 5000)
    }

    return (
        <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-6'>
            <h3 className='text-lg font-bold text-slate-100 mb-4'>Recovery Test</h3>

            <p className='text-sm text-slate-400 mb-4'>
                Schedule and run periodic recovery tests to ensure backup integrity
            </p>

            <div className='space-y-3'>
                <div>
                    <label htmlFor='test-frequency' className='block text-sm text-slate-300 mb-2'>Test Frequency</label>
                    <select id='test-frequency' className='w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm' aria-label='Test Frequency'>
                        <option>Weekly</option>
                        <option>Bi-weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>

                <button
                    onClick={handleRunTest}
                    disabled={isRunning}
                    className='w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 text-slate-950 font-bold py-2 rounded transition-colors'
                    aria-label='Run recovery test'
                >
                    {isRunning ? 'Running...' : 'Run Test Now'}
                </button>

                {result && (
                    <div className={`p-3 rounded text-sm ${result === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        Recovery test {result === 'success' ? '✓ passed' : '✗ failed'}
                    </div>
                )}
            </div>
        </div>
    )
}
