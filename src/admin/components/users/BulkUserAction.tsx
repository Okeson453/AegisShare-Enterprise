import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const BulkUserAction = () => {
    const { executeAction } = useAdminActions()

    const handleBulkAction = async (action: string) => {
        await executeAction(
            async () => ({ success: true }),
            {
                loadingMessage: `Executing ${action}...`,
                successMessage: `${action} completed`,
                errorMessage: `Failed: ${action}`
            }
        )
    }

    return (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30 space-y-4'>
            <h3 className='font-bold text-slate-200'>Bulk Actions</h3>
            <p className='text-sm text-slate-400'>Select users and choose an action</p>

            <div className='flex gap-2 flex-wrap'>
                <button onClick={() => handleBulkAction('reset-mfa')} className='px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-sm font-bold border border-blue-500/30'>
                    Reset MFA
                </button>
                <button onClick={() => handleBulkAction('disable-mfa')} className='px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded text-sm font-bold border border-yellow-500/30'>
                    Disable MFA
                </button>
                <button onClick={() => handleBulkAction('deprovision')} className='px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm font-bold border border-red-500/30'>
                    Deprovision
                </button>
                <button onClick={() => handleBulkAction('export')} className='px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded text-sm font-bold border border-green-500/30'>
                    Export Report
                </button>
            </div>
        </div>
    )
}
