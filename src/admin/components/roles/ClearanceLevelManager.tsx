export const ClearanceLevelManager = () => {
    const levels = ['L1', 'L2', 'L3', 'L4', 'L5']

    return (
        <div className='grid grid-cols-1 md:grid-cols-5 gap-3'>
            {levels.map(level => (
                <div key={level} className='p-4 rounded border border-slate-700/50 bg-slate-900/30 text-center'>
                    <p className='font-bold text-lg text-slate-200 mb-2'>{level}</p>
                    <p className='text-xs text-slate-400'>
                        {level === 'L1' && 'Analyst'}
                        {level === 'L2' && 'Officer'}
                        {level === 'L3' && 'Admin'}
                        {level === 'L4' && 'Lead'}
                        {level === 'L5' && 'Super'}
                    </p>
                    <button className='w-full mt-3 px-2 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded border border-blue-500/30'>
                        Edit
                    </button>
                </div>
            ))}
        </div>
    )
}
