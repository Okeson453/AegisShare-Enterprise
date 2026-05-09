import { useMemo, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

interface VirtualListProps<T> {
    items: T[]
    renderItem: (item: T, index: number) => React.ReactNode
    itemHeight: number
    containerHeight: number
    gap?: number
    overscan?: number
}

/**
 * Virtual list for rendering large datasets efficiently
 * Only renders visible items + overscan buffer, dramatically improving performance
 */
export const VirtualList = <T extends any>({
    items,
    renderItem,
    itemHeight,
    containerHeight,
    gap = 0,
    overscan = 10,
}: VirtualListProps<T>) => {
    const parentRef = React.useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => itemHeight + gap,
        overscan,
        measureElement:
            typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
    })

    return (
        <div
            ref={parentRef}
            style={{
                height: `${containerHeight}px`,
                overflowY: 'auto',
                width: '100%',
            }}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualItem.start}px)`,
                        }}
                    >
                        {renderItem(items[virtualItem.index], virtualItem.index)}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Required import for React.useRef
import React from 'react'
