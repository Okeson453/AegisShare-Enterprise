import React from 'react'

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    locked?: boolean
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
    ({ label, locked = false, className = '', ...props }, ref) => {
        return (
            <div className="flex items-center gap-2">
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        className="sr-only"
                        disabled={locked}
                        {...props}
                    />
                    <div className={`
            w-10 h-6 rounded-full border border-bd
            ${props.checked ? 'bg-cy' : 'bg-s1'}
            ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            transition-colors duration-200
          `} />
                    <div className={`
            absolute top-1 left-1 w-4 h-4 bg-bg rounded-full
            transition-transform duration-200
            ${props.checked ? 'translate-x-4' : ''}
          `} />
                </div>
                {label && <span className="text-sm text-t1">{label}</span>}
            </div>
        )
    }
)

Toggle.displayName = 'Toggle'

export default Toggle
