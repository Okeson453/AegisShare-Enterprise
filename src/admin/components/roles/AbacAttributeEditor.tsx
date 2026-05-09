export const AbacAttributeEditor = () => {
    return (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30 space-y-4'>
            <h3 className='font-bold text-slate-200'>ABAC Attributes</h3>

            <div>
                <p className='text-sm font-bold text-slate-400 mb-2'>Department</p>
                <input
                    type='text'
                    placeholder='e.g., Engineering, Security'
                    className='w-full px-3 py-2 bg-slate-800 border border-slate-700/50 rounded text-slate-300 focus:outline-none focus:border-amber-500/50'
                />
            </div>

            <div>
                <p className='text-sm font-bold text-slate-400 mb-2'>Cost Center</p>
                <input
                    type='text'
                    placeholder='e.g., CC-1001'
                    className='w-full px-3 py-2 bg-slate-800 border border-slate-700/50 rounded text-slate-300 focus:outline-none focus:border-amber-500/50'
                />
            </div>

            <button className='w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded font-bold border border-blue-500/30'>
                Add Attribute
            </button>
        </div>
    )
}
