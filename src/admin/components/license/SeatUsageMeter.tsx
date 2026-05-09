export const SeatUsageMeter = () => {
    const usedSeats = 45
    const totalSeats = 100

    return (
        <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-6'>
            <h3 className='text-lg font-bold text-slate-100 mb-4'>Seat Usage</h3>

            <div className='mb-4'>
                <div className='flex justify-between mb-2'>
                    <span className='text-sm text-slate-400'>{usedSeats} of {totalSeats} seats</span>
                    <span className='text-sm font-bold text-amber-600'>{Math.round((usedSeats / totalSeats) * 100)}%</span>
                </div>
                <div className='w-full bg-slate-800/50 rounded-full h-3'>
                    <div
                        className='bg-amber-600 h-3 rounded-full transition-all seat-usage-bar'
                        style={{ '--seat-width': ((usedSeats / totalSeats) * 100) + '%' } as any}
                    />
                </div>
            </div>

            <div className='grid grid-cols-3 gap-3 text-xs'>
                <div className='bg-slate-800/30 rounded p-2'>
                    <span className='text-slate-400'>Active</span>
                    <p className='text-slate-200 font-bold mt-1'>{usedSeats}</p>
                </div>
                <div className='bg-slate-800/30 rounded p-2'>
                    <span className='text-slate-400'>Available</span>
                    <p className='text-slate-200 font-bold mt-1'>{totalSeats - usedSeats}</p>
                </div>
                <div className='bg-slate-800/30 rounded p-2'>
                    <span className='text-slate-400'>Total</span>
                    <p className='text-slate-200 font-bold mt-1'>{totalSeats}</p>
                </div>
            </div>
        </div>
    )
}
