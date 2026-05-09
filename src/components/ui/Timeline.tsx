import { ReactNode } from 'react'

type TimelineStatus = 'completed' | 'in-progress' | 'pending'

interface TimelineStep {
    id: string
    step: number
    label: string
    status: TimelineStatus
    description?: string
    timestamp?: string
}

interface TimelineProps {
    steps: TimelineStep[]
    direction?: 'horizontal' | 'vertical'
    className?: string
}

const Timeline: React.FC<TimelineProps> = ({
    steps,
    direction = 'horizontal',
    className = '',
}) => {
    const statusColors = {
        completed: 'bg-em border-em',
        'in-progress': 'bg-cy border-cy animate-border-glow',
        pending: 'bg-s2 border-bd',
    }

    const statusTextColors = {
        completed: 'text-white',
        'in-progress': 'text-black font-700',
        pending: 'text-t2',
    }

    return (
        <div className={`timeline ${direction === 'horizontal' ? 'flex gap-16px' : 'flex flex-col gap-12px'} ${className}`}>
            {steps.map((step, index) => (
                <div
                    key={step.id}
                    className={`timeline-item flex items-center gap-12px ${direction === 'horizontal' ? 'flex-col' : 'flex-row'
                        }`}
                >
                    <div
                        className={`timeline-dot w-32px h-32px rounded-full border-2px flex items-center 
                        justify-center text-12px font-700 flex-shrink-0 transition-all duration-300
                        ${statusColors[step.status]} ${statusTextColors[step.status]}`}
                    >
                        {step.status === 'completed' ? '✓' : step.step}
                    </div>

                    {direction === 'horizontal' && index < steps.length - 1 && (
                        <div
                            className="w-2px h-40px bg-gradient-to-b from-bd to-transparent flex-shrink-0"
                        />
                    )}

                    <div
                        className={`timeline-content ${direction === 'horizontal' ? 'text-center min-w-60px' : 'flex-1'
                            }`}
                    >
                        <div className="text-11px font-600 text-t0">{step.label}</div>
                        {step.description && (
                            <div className="text-10px text-t2 mt-2px">{step.description}</div>
                        )}
                        {step.timestamp && (
                            <div className="text-9px text-t3 mt-2px font-mono">{step.timestamp}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Timeline
