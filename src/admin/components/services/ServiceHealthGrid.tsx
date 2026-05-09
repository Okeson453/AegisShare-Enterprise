import { ServiceHealth } from '@/admin/types'
import { DataTableWrapper } from '../DataTableIntegration'

interface Props {
    services?: ServiceHealth[]
    isLoading?: boolean
    error?: string | null
}

export const ServiceHealthGrid = ({ services = [], isLoading = false, error = null }: Props) => {
    if (error) {
        return (
            <div className='p-4 rounded border border-red-500/30 bg-red-500/10 text-red-300'>
                <p className='font-bold'>Error loading services</p>
                <p className='text-sm mt-1'>{error}</p>
            </div>
        )
    }

    return (
        <DataTableWrapper<ServiceHealth>
            isLoading={isLoading}
            data={services}
            skeletonType='generic'
            columns={<div />}
            renderRow={(service: any) => (
                <div
                    key={service.id}
                    className='p-4 rounded border border-slate-700/50 bg-slate-900/30'
                >
                    <div className='font-bold text-slate-200 mb-2'>{service.name}</div>
                    <div className='text-2xl font-bold text-amber-400'>{service.status}</div>
                    <div className='text-xs text-slate-500 mt-2'>Uptime: {(service.uptime * 100).toFixed(1)}%</div>
                </div>
            )}
        />
    )
}
