export const ResourceUsageChart = () => {
    return (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30'>
            <h3 className='font-bold text-slate-200 mb-4'>Resource Usage</h3>
            <div className='space-y-3'>
                {[
                    { label: 'CPU', value: 45 },
                    { label: 'Memory', value: 62 },
                    { label: 'Disk', value: 38 },
                    { label: 'Network', value: 28 },
                ].map(res => (
                    <div key={res.label}>
                        <div className='flex justify-between text-sm mb-1'>
                            <span className='text-slate-400'>{res.label}</span>
                            <span className='text-slate-300 font-mono'>{res.value}%</span>
                        </div>
                        <div className='w-full h-2 bg-slate-700/50 rounded-full overflow-hidden'>
                            <div
                                className='h-full bg-gradient-to-r from-amber-500 to-amber-400 resource-bar'
                                style={{ '--resource-width': res.value + '%' } as any}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
