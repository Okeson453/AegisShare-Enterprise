export const LicenseOverview = () => {
    return (
        <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-6'>
            <div className='mb-4 flex items-start justify-between'>
                <div>
                    <h3 className='text-lg font-bold text-slate-100'>Enterprise License</h3>
                    <p className='text-sm text-slate-400 mt-1'>Unlimited seats and features</p>
                </div>
                <div className='px-3 py-1 bg-green-500/20 text-green-300 rounded text-xs font-bold'>ACTIVE</div>
            </div>

            <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                    <span className='text-slate-400'>License Key</span>
                    <span className='text-slate-200 font-mono'>AEG-ENT-2024-****</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-slate-400'>Expires</span>
                    <span className='text-slate-200'>2027-12-31</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-slate-400'>Support Tier</span>
                    <span className='text-slate-200'>Premium 24/7</span>
                </div>
            </div>
        </div>
    )
}
