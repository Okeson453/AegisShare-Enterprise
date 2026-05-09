import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const ErasureRequestDetail = () => {
    const { executeAction, confirmDangerAction } = useAdminActions()

    const handleApprove = async () => {
        const confirmed = await confirmDangerAction({
            title: 'Approve Erasure Request',
            message: 'This will permanently delete all user data. This action cannot be undone.',
            confirmPhrase: 'APPROVE_ERASURE',
            onConfirm: async () => { /* TODO: API call to approve erasure */ }
        })
        if (confirmed) {
            await executeAction(
                async () => ({ success: true }),
                {
                    loadingMessage: 'Processing...',
                    successMessage: 'Erasure request approved',
                    errorMessage: 'Failed to approve'
                }
            )
        }
    }

    const handleReject = async () => {
        await executeAction(
            async () => ({ success: true }),
            {
                loadingMessage: 'Rejecting...',
                successMessage: 'Request rejected',
                errorMessage: 'Failed to reject'
            }
        )
    }

    return (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30 space-y-3'>
            <h3 className='font-bold text-slate-200'>Request Details</h3>

            <div>
                <p className='text-xs font-bold text-slate-400'>REQUEST ID</p>
                <p className='text-slate-300'>ERA-001</p>
            </div>

            <div>
                <p className='text-xs font-bold text-slate-400'>REASON</p>
                <p className='text-slate-300'>User right to be forgotten (GDPR)</p>
            </div>

            <div>
                <p className='text-xs font-bold text-slate-400'>DATA SCOPE</p>
                <p className='text-slate-300'>User ID 12345 from all regions</p>
            </div>

            <div className='flex gap-2'>
                <button onClick={handleApprove} className='flex-1 px-3 py-1 text-sm bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded border border-green-500/30'>
                    Approve
                </button>
                <button onClick={handleReject} className='flex-1 px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded border border-red-500/30'>
                    Reject
                </button>
            </div>
        </div>
    )
}
