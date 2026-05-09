import { useIncidents } from '@/admin/hooks'
import { IncidentCard } from '@/admin/components/incidents/IncidentCard'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'
import { useAdminUiStore } from '@/admin/store'

export const IncidentsPage = () => {
    const { incidents, stats } = useIncidents()
    const { setActiveTab } = useAdminUiStore()

    return (
        <AdminPageWrapper title='Incident Management' subtitle='Track and manage system incidents'>
            <div className='s12-stack-md'>
                <div className='bento'>
                    <div className='bento-2 s12-stat-card'>
                        <div className='s12-stat-label'>Total</div>
                        <div className='s12-stat-value'>{stats.total}</div>
                    </div>
                    <div className='bento-2 s12-stat-card s12-error-state'>
                        <div className='s12-stat-label'>Open</div>
                        <div className='s12-stat-value s12-status-critical'>{stats.open}</div>
                    </div>
                    <div className='bento-2 s12-stat-card s12-warning-state'>
                        <div className='s12-stat-label'>Investigating</div>
                        <div className='s12-stat-value s12-status-warning'>{stats.investigating}</div>
                    </div>
                    <div className='bento-2 s12-stat-card'>
                        <div className='s12-stat-label'>Mitigating</div>
                        <div className='s12-stat-value s12-status-warning'>{stats.mitigating}</div>
                    </div>
                    <div className='bento-2 s12-stat-card s12-success-state'>
                        <div className='s12-stat-label'>Resolved</div>
                        <div className='s12-stat-value s12-status-healthy'>{stats.resolved}</div>
                    </div>
                </div>

                <div className='s12-stack-sm'>
                    {incidents.map((incident) => (
                        <IncidentCard key={incident.id} incident={incident} onSelect={() => setActiveTab(`incident-${incident.id}`)} />
                    ))}
                </div>

                {incidents.length === 0 && (
                    <div className='s12-section s12-text-center s12-text-muted'>
                        No incidents
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    )
}
