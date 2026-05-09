interface Props {
    region: { id: string; name: string; status: string }
}

export const RegionCard = ({ region }: Props) => {
    return (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30'>
            <h3 className='font-bold text-slate-200 mb-2'>{region.name}</h3>
            <div className='space-y-1 text-sm'>
                <p className='text-slate-400'>
                    Region ID: <span className='text-slate-300 font-mono'>{region.id}</span>
                </p>
                <p className='text-slate-400'>
                    Status:{' '}
                    <span className={`font-bold ${region.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                        {region.status}
                    </span>
                </p>
            </div>
        </div>
    )
}
