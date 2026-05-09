export const HistoricalIncidents = () => {
  const incidents = [
    { id: 101, title: 'Cache Invalidation Issue', resolved: '2026-04-05', duration: '2h 15m', mttr: 'Medium' },
    { id: 102, title: 'Load Balancer Failover', resolved: '2026-04-04', duration: '45m', mttr: 'Fast' },
    { id: 103, title: 'DNS Resolution Failure', resolved: '2026-04-03', duration: '1h 30m', mttr: 'Medium' },
    { id: 104, title: 'Backup Job Failed', resolved: '2026-04-02', duration: '30m', mttr: 'Fast' },
  ]

  return (
    <div className='space-y-2 max-h-96 overflow-y-auto'>
      {incidents.map((incident) => (
        <div key={incident.id} className='bg-slate-900/30 border border-slate-700/50 rounded p-3'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-slate-300 font-medium'>{incident.title}</p>
              <p className='text-xs text-slate-500 mt-1'>ID: INC-{incident.id}</p>
            </div>
            <span className='px-2 py-1 text-xs rounded font-bold bg-blue-500/20 text-blue-300'>RESOLVED</span>
          </div>
          <div className='grid grid-cols-3 gap-4 mt-2 text-xs'>
            <div>
              <p className='text-slate-400'>Resolved</p>
              <p className='text-slate-200'>{incident.resolved}</p>
            </div>
            <div>
              <p className='text-slate-400'>Duration</p>
              <p className='text-slate-200'>{incident.duration}</p>
            </div>
            <div>
              <p className='text-slate-400'>MTTR</p>
              <p className={`${incident.mttr === 'Fast' ? 'text-green-400' : 'text-yellow-400'}`}>{incident.mttr}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
