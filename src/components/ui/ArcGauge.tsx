import { useEffect, useRef } from 'react'

interface ArcGaugeProps {
    value: number // 0-100
    size?: number
    strokeWidth?: number
    colors?: [string, string] // [background, fill]
    animated?: boolean
    showPercentage?: boolean
    label?: string
}

/**
 * ArcGauge Component — Animated radial progress gauge
 * Displays a value 0-100 as an animated arc
 */
export function ArcGauge({ 
    value, 
    size = 120, 
    strokeWidth = 8, 
    colors = ['rgba(255,255,255,0.1)', '#22D3EE'],
    animated = true,
    showPercentage = true,
    label
}: ArcGaugeProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    useEffect(() => {
        const circle = svgRef.current?.querySelector('circle.fill')
        if (circle && animated) {
            const offset = circumference - (value / 100) * circumference
            circle.setAttribute('style', `stroke-dashoffset: ${offset}; transition: stroke-dashoffset 800ms var(--ease-smooth);`)
        }
    }, [value, circumference, animated])

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <svg 
                ref={svgRef} 
                width={size} 
                height={size} 
                style={{ transform: 'rotate(-90deg)' }}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle */}
                <circle 
                    cx={size/2} 
                    cy={size/2} 
                    r={radius} 
                    fill="none" 
                    stroke={colors[0]} 
                    strokeWidth={strokeWidth}
                />
                {/* Fill circle */}
                <circle 
                    className="fill transition-all"
                    cx={size/2} 
                    cy={size/2} 
                    r={radius} 
                    fill="none" 
                    stroke={colors[1]} 
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                />
                {/* Center text */}
                {showPercentage && (
                    <text 
                        x={size/2} 
                        y={size/2} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        fill="currentColor" 
                        fontSize={size * 0.25}
                        fontWeight="bold"
                    >
                        {Math.round(value)}
                    </text>
                )}
            </svg>
            {label && <div className="text-xs font-medium text-t1 text-center">{label}</div>}
        </div>
    )
}

export default ArcGauge
