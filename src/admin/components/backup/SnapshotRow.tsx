interface Props {
    id: string
    date: string
    size: string
    status: 'healthy' | 'degraded' | 'failed'
}

export const SnapshotRow = ({ id, date, size, status }: Props) => {
    return (
        <div className='bg-slate-900/30 border border-slate-700/50 rounded p-4 flex items-center justify-between hover:bg-slate-900/50 transition-colors'>
            <div className='flex-1'>
                <p className='font-mono text-sm text-slate-300'>{id}</p>
                <p className='text-xs text-slate-500'>{date}</p>
            </div>

            <div className='flex items-center gap-4'>
                <span className='text-sm text-slate-400'>{size}</span>
                <span
                    className={`px-2 py-1 text-xs rounded font-bold ${status === 'healthy' ? 'bg-green-500/20 text-green-300' :
                            status === 'degraded' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                        }`}
                    aria-label={`Snapshot status: ${status}`}
                >
                    {status}
                </span>
            </div>
        </div>
    )
}
