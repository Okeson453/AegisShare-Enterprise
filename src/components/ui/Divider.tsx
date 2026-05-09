import React from 'react'

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: string
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    ({ label, className = '', ...props }, ref) => {
        if (label) {
            return (
                <div
                    ref={ref}
                    className={`flex items-center gap-3 ${className}`}
                    {...props}
                >
                    <div className="flex-1 h-px bg-bd" />
                    <span className="text-xs text-t2 uppercase tracking-wide">{label}</span>
                    <div className="flex-1 h-px bg-bd" />
                </div>
            )
        }

        return (
            <div
                ref={ref}
                className={`h-px bg-bd ${className}`}
                {...props}
            />
        )
    }
)

Divider.displayName = 'Divider'

export default Divider
