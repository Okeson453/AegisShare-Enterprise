export const RtoRpoStatus = () => {
    return (
        <div className='grid grid-cols-2 gap-4'>
            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-6'>
                <h4 className='text-sm font-bold text-slate-300 mb-3'>RTO (Recovery Time Objective)</h4>
                <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                        <span className='text-xs text-slate-400'>Target</span>
                        <span className='text-lg font-bold text-amber-600'>4 hours</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-xs text-slate-400'>Current</span>
                        <span className='text-lg font-bold text-green-400'>2.5 hours</span>
                    </div>
                    <div className='w-full bg-slate-800/50 rounded-full h-2 mt-2'>
                        <div className='bg-green-500 h-2 rounded-full w-5/8' />
                    </div>
                </div>
            </div>

            <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-6'>
                <h4 className='text-sm font-bold text-slate-300 mb-3'>RPO (Recovery Point Objective)</h4>
                <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                        <span className='text-xs text-slate-400'>Target</span>
                        <span className='text-lg font-bold text-amber-600'>1 hour</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-xs text-slate-400'>Current</span>
                        <span className='text-lg font-bold text-green-400'>15 minutes</span>
                    </div>
                    <div className='w-full bg-slate-800/50 rounded-full h-2 mt-2'>
                        <div className='bg-green-500 h-2 rounded-full w-full' />
                    </div>
                </div>
            </div>
        </div>
    )
}
