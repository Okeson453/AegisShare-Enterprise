interface Props {
    permission: string
    enabled: boolean
    onChange?: (enabled: boolean) => void
}

export const PermissionToggle = ({ permission, enabled, onChange }: Props) => {
    return (
        <div className='flex items-center justify-between p-2 rounded border border-slate-700/50 bg-slate-900/30'>
            <span className='text-sm text-slate-300'>{permission}</span>
            <button
                onClick={() => onChange?.(!enabled)}
                className={`w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-green-500/40' : 'bg-slate-700/40'
                    }`}
                aria-label={`${permission} is ${enabled ? 'enabled' : 'disabled'}`}
                role='switch'
                aria-checked={enabled ? 'true' : 'false'}
            >
                <div
                    className={`w-5 h-5 rounded-full transition-all ${enabled ? 'translate-x-4.5 bg-green-400' : 'translate-x-0.5 bg-slate-500'
                        }`}
                />
            </button>
        </div>
    )
}
