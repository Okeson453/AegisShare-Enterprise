export const DependencyStatus = () => {
    const dependencies = [
        { name: 'PostgreSQL', status: 'healthy', uptime: 99.9 },
        { name: 'ClickHouse', status: 'healthy', uptime: 99.8 },
        { name: 'Kafka', status: 'healthy', uptime: 99.9 },
        { name: 'Redis', status: 'healthy', uptime: 99.9 },
    ]

    return (
        <div className='space-y-2'>
            {dependencies.map(dep => (
                <div key={dep.name} className='flex items-center justify-between p-3 rounded border border-slate-700/50 bg-slate-900/30'>
                    <span className='text-slate-300 font-medium'>{dep.name}</span>
                    <div className='flex items-center gap-4'>
                        <span className='text-xs px-2 py-1 rounded bg-green-500/20 text-green-300'>{dep.status}</span>
                        <span className='text-xs text-slate-500'>{dep.uptime}%</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
