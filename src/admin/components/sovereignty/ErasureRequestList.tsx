import { DataTableWrapper } from '../DataTableIntegration'

interface ErasureRequest {
    id: string
    status: 'pending' | 'approved' | 'rejected'
    created: string
}

interface Props {
    requests?: ErasureRequest[]
    isLoading?: boolean
    error?: string | null
}

export const ErasureRequestList = ({ requests, isLoading = false, error = null }: Props) => {
    const defaultRequests: ErasureRequest[] = [
        { id: 'era-001', status: 'pending', created: '2026-04-06' },
        { id: 'era-002', status: 'approved', created: '2026-04-05' },
    ]

    const data = requests ?? defaultRequests

    if (error) {
        return (
            <div className='p-4 rounded border border-red-500/30 bg-red-500/10 text-red-300'>
                <p className='font-bold'>Error loading erasure requests</p>
                <p className='text-sm mt-1'>{error}</p>
            </div>
        )
    }

    return (
        <DataTableWrapper
            isLoading={isLoading}
            data={data}
            skeletonType='generic'
            columns={<div />}
            renderRow={(req: any) => (
                <div key={req.id} className='p-3 rounded border border-slate-700/50 bg-slate-900/30 flex justify-between'>
                    <div>
                        <p className='font-bold text-slate-200'>{req.id}</p>
                        <p className='text-xs text-slate-500'>{req.created}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : req.status === 'approved' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {req.status}
                    </span>
                </div>
            )}
        />
    )
}
