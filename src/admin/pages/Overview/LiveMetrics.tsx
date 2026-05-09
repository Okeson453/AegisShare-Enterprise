export const LiveMetrics = () => {
    return (
        <div className='grid grid-cols-4 gap-3'>
            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <p className='text-xs text-slate-400 mb-2'>Request Rate</p>
                <p className='text-2xl font-bold text-slate-100'>2.5K</p>
                <p className='text-xs text-green-400 mt-2'>↑ 12% from last hour</p>
            </div>

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <p className='text-xs text-slate-400 mb-2'>Avg Latency</p>
                <p className='text-2xl font-bold text-slate-100'>52ms</p>
                <p className='text-xs text-yellow-400 mt-2'>↑ 8% from baseline</p>
            </div>

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <p className='text-xs text-slate-400 mb-2'>Error Rate</p>
                <p className='text-2xl font-bold text-slate-100'>0.02%</p>
                <p className='text-xs text-green-400 mt-2'>↓ 5% from last hour</p>
            </div>

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
                <p className='text-xs text-slate-400 mb-2'>Active Users</p>
                <p className='text-2xl font-bold text-slate-100'>1,240</p>
                <p className='text-xs text-slate-500 mt-2'>Connected now</p>
            </div>
        </div>
    )
}
