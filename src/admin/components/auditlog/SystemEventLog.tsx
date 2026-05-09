export const SystemEventLog = () => {
    const events = [
        { id: 1, type: 'Service Health', message: 'PostgreSQL latency spike detected', timestamp: '2026-04-06 14:20' },
        { id: 2, type: 'Security', message: 'Failed login attempts from IP 192.168.1.x', timestamp: '2026-04-06 13:45' },
        { id: 3, type: 'Compliance', message: 'GDPR data request received', timestamp: '2026-04-06 13:00' },
        { id: 4, type: 'Backup', message: 'Daily backup completed successfully', timestamp: '2026-04-06 02:15' },
    ]

    const getEventColor = (type: string) => {
        switch (type) {
            case 'Security':
                return 'bg-red-500/20 text-red-300'
            case 'Compliance':
                return 'bg-yellow-500/20 text-yellow-300'
            case 'Backup':
                return 'bg-green-500/20 text-green-300'
            default:
                return 'bg-blue-500/20 text-blue-300'
        }
    }

    return (
        <div className='space-y-2 max-h-96 overflow-y-auto'>
            {events.map((event) => (
                <div key={event.id} className='bg-slate-900/30 border border-slate-700/50 rounded p-3'>
                    <div className='flex items-start justify-between gap-3'>
                        <div className='flex-1'>
                            <span className={`inline-block px-2 py-1 text-xs rounded font-bold ${getEventColor(event.type)}`}>
                                {event.type}
                            </span>
                            <p className='text-slate-300 text-sm mt-2'>{event.message}</p>
                        </div>
                        <span className='text-xs text-slate-500 whitespace-nowrap'>{event.timestamp}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
