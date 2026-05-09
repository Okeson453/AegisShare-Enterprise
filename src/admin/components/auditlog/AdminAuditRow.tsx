interface Props {
    admin: string
    action: string
    timestamp: string
    status: 'success' | 'failed'
}

export const AdminAuditRow = ({ admin, action, timestamp, status }: Props) => {
    return (
        <div className='bg-slate-900/30 border border-slate-700/50 rounded p-3 flex items-center justify-between text-sm hover:bg-slate-900/50 transition-colors'>
            <div className='flex-1'>
                <p className='text-slate-300 font-medium'>{action}</p>
                <p className='text-xs text-slate-500 mt-1'>{admin}</p>
            </div>

            <div className='flex items-center gap-3'>
                <span className='text-xs text-slate-500'>{timestamp}</span>
                <span
                    className={`px-2 py-1 text-xs rounded font-bold ${status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}
                    aria-label={`Action status: ${status}`}
                >
                    {status}
                </span>
            </div>
        </div>
    )
}
