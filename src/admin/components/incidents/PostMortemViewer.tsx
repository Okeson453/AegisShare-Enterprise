export const PostMortemViewer = () => {
    return (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30 space-y-4'>
            <h3 className='font-bold text-slate-200'>Post-Mortem Report</h3>

            <div>
                <p className='text-xs font-bold text-slate-400 mb-1'>ROOT CAUSE</p>
                <p className='text-slate-300'>Database connection pool exhaustion under load</p>
            </div>

            <div>
                <p className='text-xs font-bold text-slate-400 mb-1'>RESOLUTION</p>
                <p className='text-slate-300'>Increased pool size from 100 to 250 connections</p>
            </div>

            <div>
                <p className='text-xs font-bold text-slate-400 mb-1'>PREVENTIVE MEASURES</p>
                <ul className='text-slate-300 space-y-1 ml-4 list-disc'>
                    <li>Implement connection pool monitoring alerts at 80% capacity</li>
                    <li>Add auto-scaling for database replicas</li>
                    <li>Review connection timeout limits</li>
                </ul>
            </div>
        </div>
    )
}
