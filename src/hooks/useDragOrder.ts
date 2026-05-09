import { useState, useCallback } from 'react'

export interface DragItem {
    id: string
    [key: string]: any
}

interface UseDragOrderOptions {
    onOrderChange?: (newOrder: DragItem[]) => Promise<void>
}

export const useDragOrder = <T extends DragItem>(
    initialItems: T[],
    options: UseDragOrderOptions = {}
) => {
    const { onOrderChange } = options
    const [items, setItems] = useState<T[]>(initialItems)
    const [isDragging, setIsDragging] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const reorder = useCallback(
        async (source: number, destination: number) => {
            if (source === destination) return

            // Optimistic update
            const newItems = Array.from(items)
            const [movedItem] = newItems.splice(source, 1)
            newItems.splice(destination, 0, movedItem)
            setItems(newItems)

            // Persist to server
            if (onOrderChange) {
                setIsSaving(true)
                setError(null)

                try {
                    await onOrderChange(newItems)
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to update order')
                    // Revert on error
                    setItems(items)
                } finally {
                    setIsSaving(false)
                }
            }
        },
        [items, onOrderChange]
    )

    return {
        items,
        setItems,
        reorder,
        isDragging,
        setIsDragging,
        isSaving,
        error,
    }
}
