export const UsageAnalyticsChart = () => {
    const data = [
        { month: 'Jan', usage: 40 },
        { month: 'Feb', usage: 55 },
        { month: 'Mar', usage: 65 },
        { month: 'Apr', usage: 72 },
        { month: 'May', usage: 78 },
        { month: 'Jun', usage: 85 },
    ]

    const maxUsage = Math.max(...data.map(d => d.usage))

    return (
        <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-6'>
            <h3 className='text-lg font-bold text-slate-100 mb-4'>Usage Trend (Last 6 Months)</h3>

            <div className='flex items-end justify-between h-32 gap-1'>
                {data.map((item, idx) => (
                    <div key={idx} className='flex-1 flex flex-col items-center'>
                        <div
                            className='w-full bg-gradient-to-t from-amber-600 to-amber-500 rounded-t transition-all hover:opacity-80 usage-bar'
                            style={{ '--usage-height': ((item.usage / maxUsage) * 100) + '%' } as any}
                            aria-label={`${item.month}: ${item.usage}%`}
                        />
                        <span className='text-xs text-slate-500 mt-2'>{item.month}</span>
                    </div>
                ))}
            </div>

            <div className='mt-4 text-xs text-slate-400'>
                Average: 66% | Peak: 85% (Jun)
            </div>
        </div>
    )
}
