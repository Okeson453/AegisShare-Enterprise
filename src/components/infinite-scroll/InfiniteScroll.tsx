import { ReactNode } from 'react'
import { VARIANTS } from '@/styles/motion'

interface InfiniteScrollProps {
    observerTarget: React.RefObject<HTMLDivElement>
    isLoading: boolean
    hasMore: boolean
    children: ReactNode
    loadingFallback?: ReactNode
}

export const InfiniteScroll = ({
    observerTarget,
    isLoading,
    hasMore,
    children,
    loadingFallback,
}: InfiniteScrollProps) => {
    return (
        <div style={{ width: '100%' }}>
            {children}

            {/* Observer target for intersection */}
            <div
                ref={observerTarget}
                style={{
                    height: '20px',
                    marginTop: '20px',
                    visibility: hasMore ? 'visible' : 'hidden',
                }}
            >
                {isLoading && loadingFallback}
            </div>
        </div>
    )
}
