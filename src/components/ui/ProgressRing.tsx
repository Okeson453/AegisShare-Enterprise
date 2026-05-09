import React from 'react'

interface ProgressRingProps {
    value: number
    max?: number
    radius?: number
    strokeWidth?: number
    color?: string
    backgroundColor?: string
    label?: string
    animate?: boolean
    className?: string
}

const ProgressRing: React.FC<ProgressRingProps> = ({
    value,
    max = 100,
    radius = 45,
    strokeWidth = 4,
    color = '#22D3EE',
    backgroundColor = '#0B1628',
    label,
    animate = true,
    className = '',
}) => {
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / max) * circumference
    const percentage = (value / max) * 100

    return (
        <div className={`progress-ring inline-flex flex-col items-center gap-12px ${className}`}>
            <svg
                width={radius * 2 + strokeWidth * 2}
                height={radius * 2 + strokeWidth * 2}
                className="transform -rotate-90"
            >
                <circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    fill="none"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={animate ? 'transition-all duration-500' : ''}
                    strokeLinecap="round"
                />
            </svg>

            <div className="text-center">
                <div className="text-18px font-700 text-t0">{percentage.toFixed(0)}%</div>
                {label && <div className="text-10px text-t2 mt-4px">{label}</div>}
            </div>
        </div>
    )
}

export default ProgressRing
