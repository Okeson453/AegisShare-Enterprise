import React from 'react'

interface ProgressBarProps {
    progress: number
    animated?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, animated = true }) => {
    return (
        <div className="w-full h-2 bg-s1 rounded-full overflow-hidden border border-bd">
            <div
                className={`h-full rounded-full bg-gradient-to-r from-cy to-em transition-all duration-300 ${animated ? 'animate-pulse' : ''}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
            />
        </div>
    )
}

export default ProgressBar
