import { memo, useMemo, useCallback } from 'react'

/**
 * Memoizes a component to prevent unnecessary re-renders
 * Use for list items, cards, and other frequently re-rendered components
 */
export const withMemo = <P extends object>(
    Component: React.ComponentType<P>,
    propsAreEqual?: (prevProps: P, nextProps: P) => boolean
): React.MemoExoticComponent<React.ComponentType<P>> => {
    return memo(Component, propsAreEqual)
}

/**
 * Custom hook for memoizing complex objects/arrays with dependency tracking
 */
export const useMemoObject = <T extends object>(obj: T, deps: React.DependencyList): T => {
    return useMemo(() => obj, deps)
}

/**
 * Debounced callback with automatic cleanup
 * Prevents excessive function calls on scroll/resize events
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delayMs: number,
    deps: React.DependencyList
) => {
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args)
            }, delayMs)
        },
        [callback, delayMs]
    ) as T
}

import React from 'react'
