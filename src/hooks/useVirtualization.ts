import { useMemo } from 'react'

interface UseVirtualizationParams {
    items: any[]
    rowHeight: number
    containerHeight: number
    scrollTop: number
}

interface VirtualizationResult {
    visibleItems: any[]
    startIndex: number
    endIndex: number
    offsetY: number
    totalHeight: number
}

/**
 * useVirtualization Hook — Efficient rendering of large lists
 * Only renders visible rows to improve performance with 10k+ items
 */
export function useVirtualization({
    items,
    rowHeight,
    containerHeight,
    scrollTop,
}: UseVirtualizationParams): VirtualizationResult {
    return useMemo(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight))
        const endIndex = Math.min(
            items.length,
            Math.ceil((scrollTop + containerHeight) / rowHeight) + 2
        )
        const visibleItems = items.slice(startIndex, endIndex)
        const offsetY = startIndex * rowHeight
        const totalHeight = items.length * rowHeight

        return { visibleItems, startIndex, endIndex, offsetY, totalHeight }
    }, [items, rowHeight, containerHeight, scrollTop])
}

export default useVirtualization
