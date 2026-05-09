import { DataTableWrapper } from '../DataTableIntegration'

interface TransferLog {
    from: string
    to: string
    status: 'completed' | 'pending' | 'failed'
    date: string
}

interface Props {
    logs?: TransferLog[]
    isLoading?: boolean
    error?: string | null
}

export const TransferLogTable = ({ logs, isLoading = false, error = null }: Props) => {
    const defaultLogs: TransferLog[] = [
        { from: 'us-east', to: 'eu-west', status: 'completed', date: '2026-04-06' },
        { from: 'eu-west', to: 'ap-south', status: 'pending', date: '2026-04-06' },
    ]

    const data = logs ?? defaultLogs

    if (error) {
        return (
            <div className='p-4 rounded border border-red-500/30 bg-red-500/10 text-red-300'>
                <p className='font-bold'>Error loading transfer logs</p>
                <p className='text-sm mt-1'>{error}</p>
            </div>
        )
    }

    return (
        <DataTableWrapper<TransferLog>
            isLoading={isLoading}
            data={data}
            skeletonType='audit'
            columns={<div />}
            renderRow={(log: any) => (
                <tr className='border-b border-slate-700/30 hover:bg-slate-800/20'>
                    <td className='px-4 py-2 text-slate-300'>{log.from}</td>
                    <td className='px-4 py-2 text-slate-300'>{log.to}</td>
                    <td className='px-4 py-2'>
                        <span className={`px-2 py-1 text-xs rounded ${log.status === 'completed' ? 'bg-green-500/20 text-green-300' : log.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                            {log.status}
                        </span>
                    </td>
                    <td className='px-4 py-2 text-slate-500 text-xs'>{log.date}</td>
                </tr>
            )}
        />
    )
}
