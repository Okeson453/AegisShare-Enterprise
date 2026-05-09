export const Databases = () => {
  const databases = [
    { id: 'postgres-1', name: 'PostgreSQL Primary', status: 'healthy', queries: 5234, connections: 150, cache_hit: 98.5 },
    { id: 'postgres-2', name: 'PostgreSQL Replica', status: 'healthy', queries: 1250, connections: 45, cache_hit: 97.8 },
    { id: 'clickhouse-1', name: 'ClickHouse Analytics', status: 'healthy', queries: 850, connections: 12, cache_hit: 99.2 },
  ]

  return (
    <div className='space-y-3'>
      {databases.map((db) => (
        <div key={db.id} className='bg-slate-900/30 border border-slate-700/50 rounded p-4'>
          <div className='flex justify-between items-start mb-3'>
            <div>
              <h4 className='text-slate-100 font-medium'>{db.name}</h4>
              <p className='text-xs text-slate-500'>{db.id}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded font-bold ${db.status === 'healthy' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
              {db.status}
            </span>
          </div>
          <div className='grid grid-cols-3 gap-4 text-sm'>
            <div>
              <p className='text-slate-400'>Queries/s</p>
              <p className='text-slate-200 font-bold'>{db.queries}</p>
            </div>
            <div>
              <p className='text-slate-400'>Connections</p>
              <p className='text-slate-200 font-bold'>{db.connections}</p>
            </div>
            <div>
              <p className='text-slate-400'>Cache Hit</p>
              <p className='text-slate-200 font-bold'>{db.cache_hit}%</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
