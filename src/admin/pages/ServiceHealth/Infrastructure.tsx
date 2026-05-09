export const Infrastructure = () => {
  const resources = [
    { id: 'node-1', name: 'Node 1', cpu: 45, memory: 68, disk: 52, network: 34 },
    { id: 'node-2', name: 'Node 2', cpu: 52, memory: 72, disk: 48, network: 41 },
    { id: 'node-3', name: 'Node 3', cpu: 38, memory: 61, disk: 55, network: 28 },
  ]

  return (
    <div className='space-y-3'>
      {resources.map((node) => (
        <div key={node.id} className='bg-slate-900/30 border border-slate-700/50 rounded p-4'>
          <h4 className='text-slate-100 font-medium mb-3'>{node.name}</h4>
          <div className='grid grid-cols-4 gap-3'>
            {[
              { label: 'CPU', value: node.cpu },
              { label: 'Memory', value: node.memory },
              { label: 'Disk', value: node.disk },
              { label: 'Network', value: node.network },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className='text-xs text-slate-400 mb-2'>{label}</p>
                <div className='w-full bg-slate-800/50 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all infrastructure-bar ${
                      value < 50 ? 'bg-green-500' : value < 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ '--infra-width': value + '%' } as any}
                  />
                </div>
                <p className='text-xs text-slate-300 mt-1'>{value}%</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
