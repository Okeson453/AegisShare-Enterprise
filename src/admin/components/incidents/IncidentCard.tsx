import { getPriorityColor, formatTimeRemaining } from '@/admin/utils'
import type { Incident } from '@/admin/types'

interface Props {
    incident: Incident
    onSelect?: (id: string) => void
}

export const IncidentCard = ({ incident, onSelect }: Props) => {
    const colors = getPriorityColor(incident.priority)

    return (
        <button
            onClick={() => onSelect?.(incident.id)}
            className={`w-full p-4 rounded-lg border text-left transition-all ${colors.bg} ${colors.border} hover:opacity-80`}
        >
            <div className='flex items-start justify-between mb-2'>
                <div className='flex-1'>
                    <div className='font-semibold text-sm text-slate-200'>{incident.title}</div>
                    <div className={`text-xs font-medium ${colors.text}`}>{colors.label}</div>
                </div>
                <div className={`text-xs font-bold ${colors.text}`}>{incident.priority}</div>
            </div>

            <div className='text-xs text-slate-400 mb-2 line-clamp-2'>{incident.description}</div>

            <div className='flex items-center justify-between text-xs text-slate-500'>
                <span>{(incident.affectedServices || []).join(', ')}</span>
                <span className='text-amber-400'>SLA: {formatTimeRemaining(incident.slaRemaining)}</span>
            </div>
        </button>
    )
}
