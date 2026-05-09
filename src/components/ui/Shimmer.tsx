import React from 'react'
import '../../styles/shimmer.css'

interface ShimmerProps {
    variant?: 'text' | 'avatar' | 'card' | 'line' | 'button'
    width?: string | number
    height?: string | number
    count?: number
    className?: string
}

export const Shimmer: React.FC<ShimmerProps> = ({
    variant = 'text',
    width = '100%',
    height = '16px',
    count = 1,
    className = '',
}) => {
    const getShimmerClass = () => {
        switch (variant) {
            case 'avatar':
                return 'shimmer-avatar'
            case 'card':
                return 'shimmer-card'
            case 'line':
                return 'shimmer-line'
            case 'button':
                return 'shimmer-button'
            default:
                return 'shimmer-text'
        }
    }

    const shimmerStyle: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    }

    if (variant === 'card') {
        return (
            <div className={`shimmer-card-wrapper ${className}`}>
                <div className="shimmer-card-header">
                    <div className="shimmer-avatar" />
                    <div className="shimmer-text" style={{ width: '60%', height: '16px' }} />
                </div>
                <div className="shimmer-card-body">
                    <div className="shimmer-line" style={{ marginBottom: '12px' }} />
                    <div className="shimmer-line" style={{ width: '80%', marginBottom: '12px' }} />
                    <div className="shimmer-line" style={{ width: '60%' }} />
                </div>
            </div>
        )
    }

    return (
        <div className={`shimmer-container ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`${getShimmerClass()} ${i < count - 1 ? 'shimmer-spacing' : ''}`}
                    style={shimmerStyle}
                />
            ))}
        </div>
    )
}

interface ShimmerGroupProps {
    count?: number
    variant?: 'user-list' | 'data-grid' | 'activity-feed'
}

export const ShimmerGroup: React.FC<ShimmerGroupProps> = ({ count = 3, variant = 'user-list' }) => {
    if (variant === 'user-list') {
        return (
            <div className="shimmer-group" style={{ gap: '12px' }}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="shimmer-user-row">
                        <Shimmer variant="avatar" width={40} height={40} />
                        <div style={{ flex: 1 }}>
                            <Shimmer variant="text" width="70%" height="16px" />
                            <Shimmer variant="text" width="50%" height="12px" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (variant === 'data-grid') {
        return (
            <div className="shimmer-group" style={{ gap: '16px' }}>
                {Array.from({ length: count }).map((_, i) => (
                    <Shimmer key={i} variant="card" />
                ))}
            </div>
        )
    }

    if (variant === 'activity-feed') {
        return (
            <div className="shimmer-group" style={{ gap: '16px' }}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="shimmer-activity-item">
                        <Shimmer variant="avatar" width={32} height={32} />
                        <div style={{ flex: 1 }}>
                            <Shimmer variant="text" width="60%" height="14px" />
                            <Shimmer variant="text" width="40%" height="12px" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return null
}

export default Shimmer
