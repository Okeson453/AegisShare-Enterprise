interface Props {
    name: string
    enabled: boolean
}

export const FeatureFlagItem = ({ name, enabled }: Props) => {
    return (
        <div className='bg-slate-900/30 border border-slate-700/50 rounded p-3 flex items-center justify-between'>
            <span className='text-sm text-slate-300'>{name}</span>
            <div
                className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-slate-600'}`}
                aria-label={`${name} is ${enabled ? 'enabled' : 'disabled'}`}
            />
        </div>
    )
}
