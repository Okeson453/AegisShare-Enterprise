import React from 'react'

type BadgeSeverity = 'critical' | 'high' | 'medium' | 'success' | 'allow' | 'deny' | 'info' | 'pending' | 'warning'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    severity?: BadgeSeverity
    size?: 'sm' | 'md' | 'lg'
    icon?: React.ReactNode
    removable?: boolean
    onRemove?: () => void
}

const severityStyles: Record<BadgeSeverity, string> = {
    critical: 'bg-rd/10 text-rd border border-rd/30 shadow-lg shadow-rd/10',
    high: 'bg-am/10 text-am border border-am/30 shadow-lg shadow-am/10',
    medium: 'bg-cy/10 text-cy border border-cy/30 shadow-lg shadow-cy/10',
    success: 'bg-em/10 text-em border border-em/30 shadow-lg shadow-em/10',
    allow: 'bg-em/10 text-em border border-em/30 shadow-lg shadow-em/10',
    deny: 'bg-rd/10 text-rd border border-rd/30 shadow-lg shadow-rd/10',
    info: 'bg-vl/10 text-vl border border-vl/30 shadow-lg shadow-vl/10',
    pending: 'bg-am/10 text-am border border-am/30 shadow-lg shadow-am/10 animate-pulse',
    warning: 'bg-go/10 text-go border border-go/30 shadow-lg shadow-go/10',
}

const sizeStyles: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-3 py-1 text-sm font-semibold gap-1.5',
    lg: 'px-4 py-1.5 text-base font-bold gap-2',
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ 
        severity = 'info',
        size = 'md',
        icon,
        removable = false,
        onRemove,
        className = '', 
        ...props 
    }, ref) => {
        return (
            <span
                ref={ref}
                className={`
                    inline-flex items-center
                    rounded-full font-medium
                    transition-all duration-300
                    ${severityStyles[severity]}
                    ${sizeStyles[size]}
                    ${className}
                `}
                {...props}
            >
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span>{props.children}</span>
                {removable && (
                    <button
                        onClick={onRemove}
                        className="flex-shrink-0 ml-1 hover:opacity-70 transition-opacity"
                        aria-label="Remove badge"
                    >
                        ✕
                    </button>
                )}
            </span>
        )
    }
)

Badge.displayName = 'Badge'

export default Badge
