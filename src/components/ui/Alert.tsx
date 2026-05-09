import React from 'react'

type AlertLevel = 'info' | 'warning' | 'critical'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    level?: AlertLevel
    title: string
    description?: string
    icon?: React.ReactNode
    action?: {
        label: string
        onClick: () => void
    }
    onDismiss?: () => void
    dismissible?: boolean
}

const levelConfig = {
    info: {
        bg: 'bg-bl/10',
        border: 'border-bl/30',
        text: 'text-bl',
        icon: 'ℹ',
    },
    warning: {
        bg: 'bg-go/10',
        border: 'border-go/30',
        text: 'text-go',
        icon: '⚠',
    },
    critical: {
        bg: 'bg-rd/10',
        border: 'border-rd/30',
        text: 'text-rd',
        icon: '●',
    },
}

/**
 * Alert Component — Contextual alerts with optional actions
 * Used for info, warnings, and critical notifications
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({
        level = 'info',
        title,
        description,
        icon,
        action,
        onDismiss,
        dismissible = true,
        className = '',
        ...props
    }, ref) => {
        const config = levelConfig[level]

        return (
            <div
                ref={ref}
                className={`
                    ${config.bg}
                    ${config.border}
                    border rounded-lg p-4
                    flex justify-between items-start gap-3
                    animate-in slide-in-up-2 fade-in duration-300
                    ${className}
                `}
                role="alert"
                {...props}
            >
                <div className="flex flex-col gap-2 flex-1">
                    <div className={`${config.text} font-semibold flex items-center gap-2`}>
                        {icon || <span className="text-lg">{config.icon}</span>}
                        {title}
                    </div>
                    {description && (
                        <div className="text-t2 text-sm">{description}</div>
                    )}
                </div>

                <div className="flex gap-2">
                    {action && (
                        <button
                            onClick={action.onClick}
                            className={`
                                ${config.text}
                                px-3 py-1.5 text-sm font-semibold
                                bg-black/30 rounded hover:bg-black/50
                                transition-all duration-300
                                whitespace-nowrap
                            `}
                        >
                            {action.label}
                        </button>
                    )}
                    {dismissible && onDismiss && (
                        <button
                            onClick={onDismiss}
                            className={`
                                ${config.text}
                                px-3 py-1.5 text-sm font-semibold
                                bg-transparent border border-current rounded
                                hover:bg-current/10
                                transition-all duration-300
                            `}
                            aria-label="Dismiss alert"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
        )
    }
)

Alert.displayName = 'Alert'

export default Alert
