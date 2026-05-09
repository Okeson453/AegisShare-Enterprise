import { IncidentList } from '../../components/incidents'

export const ActiveIncidents = () => {
  return (
    <div>
      <h3 className='text-lg font-bold text-slate-100 mb-4'>Active Incidents</h3>
      <IncidentList
        incidents={[
          { id: 'inc-001', title: 'Database Performance Degradation', description: 'PostgreSQL latency spike detected', service: 'postgres', priority: 'P1', status: 'open', createdAt: '2026-04-06T14:32:00Z', affectedServices: ['postgres'], slaTarget: 4, slaRemaining: 2 },
          { id: 'inc-002', title: 'API Service Error Rate Increase', description: 'Error rate increased to 2%', service: 'api', priority: 'P2', status: 'open', createdAt: '2026-04-06T13:15:00Z', affectedServices: ['api'], slaTarget: 1, slaRemaining: 0.5 },
        ]}
      />
    </div>
  )
}
