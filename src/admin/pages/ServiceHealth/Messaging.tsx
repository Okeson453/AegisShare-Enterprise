export const Messaging = () => {
  const services = [
    { id: 'kafka-1', name: 'Kafka Cluster', status: 'healthy', topics: 45, partitions: 320, lag: 0 },
    { id: 'redis-1', name: 'Redis Cache', status: 'healthy', operations: 125000, memory: '8.5GB', hits: 98.2 },
    { id: 'rabbitmq-1', name: 'RabbitMQ', status: 'healthy', queues: 28, messages: 5430, consumers: 45 },
  ]

  return (
    <div className='space-y-3'>
      {services.map((service) => (
        <div key={service.id} className='bg-slate-900/30 border border-slate-700/50 rounded p-4'>
          <div className='flex justify-between items-start mb-3'>
            <div>
              <h4 className='text-slate-100 font-medium'>{service.name}</h4>
              <p className='text-xs text-slate-500'>{service.id}</p>
            </div>
            <span className='px-2 py-1 text-xs rounded font-bold bg-green-500/20 text-green-300'>
              {service.status}
            </span>
          </div>
          <div className='grid grid-cols-3 gap-4 text-sm'>
            {'topics' in service && (
              <>
                <div>
                  <p className='text-slate-400'>Topics</p>
                  <p className='text-slate-200 font-bold'>{(service as any).topics}</p>
                </div>
                <div>
                  <p className='text-slate-400'>Partitions</p>
                  <p className='text-slate-200 font-bold'>{(service as any).partitions}</p>
                </div>
                <div>
                  <p className='text-slate-400'>Lag</p>
                  <p className='text-slate-200 font-bold'>{(service as any).lag}</p>
                </div>
              </>
            )}
            {'operations' in service && (
              <>
                <div>
                  <p className='text-slate-400'>Operations/s</p>
                  <p className='text-slate-200 font-bold'>{(service as any).operations.toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-slate-400'>Memory</p>
                  <p className='text-slate-200 font-bold'>{(service as any).memory}</p>
                </div>
                <div>
                  <p className='text-slate-400'>Hit Rate</p>
                  <p className='text-slate-200 font-bold'>{(service as any).hits}%</p>
                </div>
              </>
            )}
            {'queues' in service && (
              <>
                <div>
                  <p className='text-slate-400'>Queues</p>
                  <p className='text-slate-200 font-bold'>{(service as any).queues}</p>
                </div>
                <div>
                  <p className='text-slate-400'>Messages</p>
                  <p className='text-slate-200 font-bold'>{(service as any).messages.toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-slate-400'>Consumers</p>
                  <p className='text-slate-200 font-bold'>{(service as any).consumers}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
