import type { Incident } from '@/admin/types'
import { DataTableWrapper } from '../DataTableIntegration'

interface Props {
    incidents: Incident[]
    isLoading?: boolean
    error?: string | null
}

export const IncidentList = ({ incidents, isLoading = false, error = null }: Props) => {
    if (error) {
        return (
            <div className='p-4 rounded border border-red-500/30 bg-red-500/10 text-red-300'>
                <p className='font-bold'>Error loading incidents</p>
                <p className='text-sm mt-1'>{error}</p>
            </div>
        )
    }

    return (
        <DataTableWrapper<Incident>
            isLoading={isLoading}
            data={incidents}
            skeletonType='generic'
            columns={<div />}
            renderRow={(incident: any) => (
                <div className='space-y-2'>
                    {incidents.length === 0 ? (
                        <div className='text-center py-6 text-slate-500'>No incidents</div>
                    ) : (
                        incidents.map(incident => (
                            <div key={incident.id} className='p-3 rounded border border-slate-700/50 bg-slate-900/30'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <p className='font-bold text-slate-200'>{incident.title}</p>
                                        <p className='text-sm text-slate-400 mt-1'>{incident.description}</p>
                                    </div>
                                    <span className='px-2 py-1 text-xs rounded bg-red-500/20 text-red-300'>{incident.priority}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        />
    )
}
