import type { ServiceHealth } from '@/admin/types'
import { DataTableWrapper } from '../DataTableIntegration'

interface Props {
    services?: ServiceHealth[]
    isLoading?: boolean
    error?: string | null
}

export const ServiceMetricsTable = ({ services = [], isLoading = false, error = null }: Props) => {
    if (error) {
        return (
            <div className='p-4 rounded border border-red-500/30 bg-red-500/10 text-red-300'>
                <p className='font-bold'>Error loading metrics</p>
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
                <tr className='border-b border-slate-700/30 hover:bg-slate-800/20'>
                    <td className='px-4 py-2 text-slate-300'>{service.name}</td>
                    <td className='px-4 py-2 text-slate-300'>{service.status}</td>
                    <td className='px-4 py-2 text-slate-300'>{(service.uptime * 100).toFixed(1)}%</td>
                    <td className='px-4 py-2 text-slate-300'>{service.latency}ms</td>
                </tr>
            )}
        />
    )
}
