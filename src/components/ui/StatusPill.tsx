import React from 'react'

type StatusType = 'success' | 'warning' | 'critical' | 'info' | 'pending'

interface StatusPillProps {
    status: StatusType
    label: string
    animate?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const StatusPill: React.FC<StatusPillProps> = ({
    status,
    label,
    animate = true,
    size = 'md',
    className = '',
}) => {
    const statusColors = {
        success: 'bg-em1 text-em border-em',
        warning: 'bg-am1 text-am border-am',
        critical: 'bg-rd1 text-rd border-rd animate-critical-pulse',
        info: 'bg-vl1 text-vl border-vl',
        pending: 'bg-cy1 text-cy border-cy',
    }

    const sizeClasses = {
        sm: 'px-8px py-4px text-10px',
        md: 'px-12px py-6px text-11px',
        lg: 'px-14px py-8px text-12px',
    }

    const animationClass = animate && status === 'critical' ? 'animate-pulse' : ''

    return (
        <div
            className={`status-pill inline-flex items-center gap-6px border rounded-full
            font-semibold transition-all duration-200 ${sizeClasses[size]}
            ${statusColors[status]} ${animationClass} ${className}`}
        >
            <span className="inline-block w-6px h-6px bg-current rounded-full" />
            {label}
        </div>
    )
}

export default StatusPill
