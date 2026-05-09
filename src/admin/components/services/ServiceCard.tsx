import { getStatusColor, getStatusLabel } from '@/admin/utils'
import type { ServiceHealth } from '@/admin/types'

interface Props {
  service: ServiceHealth
}

export const ServiceCard = ({ service }: Props) => {
  const colors = getStatusColor(service.status)

  return (
    <div className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
      <div className='flex items-center justify-between mb-2'>
        <div className='font-semibold text-sm text-slate-200'>{service.name}</div>
        <div className={`text-xs font-medium ${colors.text}`}>{getStatusLabel(service.status)}</div>
      </div>

      <div className='grid grid-cols-2 gap-2 text-xs text-slate-400'>
        <div>Uptime: <span className='text-slate-200'>{(service.uptime * 100).toFixed(2)}%</span></div>
        <div>Latency: <span className='text-slate-200'>{service.latency}ms</span></div>
        <div>Errors: <span className='text-slate-200'>{(service.errorRate * 100).toFixed(1)}%</span></div>
        <div>Throughput: <span className='text-slate-200'>{service.throughput}/s</span></div>
      </div>

      <div className='mt-3 text-xs text-slate-500'>
        {service.lastChecked && `Last checked: ${new Date(service.lastChecked).toLocaleTimeString()}`}
      </div>
    </div>
  )
}
