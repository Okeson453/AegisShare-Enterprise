import React from 'react';

/**
 * useSkeletonState Hook — Manage loading states with skeleton animations
 * Provides isLoading flag and loading management
 */

interface SkeletonStateOptions {
    loadingDuration?: number;
    minDuration?: number;
    onLoadingComplete?: () => void;
}

export function useSkeletonState(opts?: SkeletonStateOptions) {
    const { loadingDuration = 0, minDuration = 300, onLoadingComplete } = opts || {};

    const [isLoading, setIsLoading] = React.useState(true);
    const startTimeRef = React.useRef<number>(Date.now());

    React.useEffect(() => {
        if (!isLoading) {
            return;
        }

        const elapsedTime = Date.now() - startTimeRef.current;
        const remainingTime = Math.max(0, minDuration - elapsedTime);

        const timer = setTimeout(() => {
            setIsLoading(false);
            onLoadingComplete?.();
        }, remainingTime);

        return () => clearTimeout(timer);
    }, [isLoading, minDuration, onLoadingComplete]);

    const finishLoading = React.useCallback(() => {
        setIsLoading(false);
    }, []);

    const startLoading = React.useCallback(() => {
        startTimeRef.current = Date.now();
        setIsLoading(true);
    }, []);

    return {
        isLoading,
        finishLoading,
        startLoading,
    };
}

/**
 * useDataLoading Hook — Specialized for data fetching with skeleton support
 * Handles loading, error, and success states
 */

interface UseDataLoadingOptions<T> {
    data?: T;
    isLoading?: boolean;
    error?: Error | null;
    minDuration?: number;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useDataLoading<T = any>(opts?: UseDataLoadingOptions<T>) {
    const {
        data,
        isLoading: externalIsLoading = false,
        error = null,
        minDuration = 300,
        onSuccess,
        onError,
    } = opts || {};

    const [internalIsLoading, setInternalIsLoading] = React.useState(externalIsLoading);
    const [internalError, setInternalError] = React.useState<Error | null>(error);
    const startTimeRef = React.useRef<number>(Date.now());

    // Update internal loading state when external loading changes
    React.useEffect(() => {
        if (!externalIsLoading) {
            const elapsedTime = Date.now() - startTimeRef.current;
            const remainingTime = Math.max(0, minDuration - elapsedTime);

            const timer = setTimeout(() => {
                setInternalIsLoading(false);
            }, remainingTime);

            return () => clearTimeout(timer);
        } else {
            startTimeRef.current = Date.now();
            setInternalIsLoading(true);
        }
    }, [externalIsLoading, minDuration]);

    // Handle errors
    React.useEffect(() => {
        if (error) {
            setInternalError(error);
            onError?.(error);
        }
    }, [error, onError]);

    // Handle success
    React.useEffect(() => {
        if (data && !externalIsLoading && !error) {
            setInternalError(null);
            onSuccess?.();
        }
    }, [data, externalIsLoading, error, onSuccess]);

    return {
        isLoading: internalIsLoading,
        error: internalError,
        isError: !!internalError,
        isSuccess: !!data && !internalIsLoading && !internalError,
    };
}

/**
 * useBatchSkeletonState Hook — Manage loading state for multiple items
 * Useful for lists with multiple concurrent loading states
 */

export interface BatchItem {
    id: string;
    isLoading?: boolean;
}

interface UseBatchSkeletonStateOptions {
    minDuration?: number;
}

export function useBatchSkeletonState<T extends BatchItem>(opts?: UseBatchSkeletonStateOptions) {
    const { minDuration = 300 } = opts || {};
    const [items, setItems] = React.useState<T[]>([]);
    const timersRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const updateItem = React.useCallback(
        (id: string, isLoading: boolean) => {
            // Clear existing timer
            if (timersRef.current.has(id)) {
                clearTimeout(timersRef.current.get(id)!);
                timersRef.current.delete(id);
            }

            if (!isLoading) {
                // Set minimum duration before marking as not loading
                const timer = setTimeout(() => {
                    setItems((prev) =>
                        prev.map((item) =>
                            item.id === id ? { ...item, isLoading: false } : item
                        )
                    );
                    timersRef.current.delete(id);
                }, minDuration);

                timersRef.current.set(id, timer);
            } else {
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, isLoading: true } : item
                    )
                );
            }
        },
        [minDuration]
    );

    const isAnyLoading = React.useMemo(() => items.some((item) => item.isLoading), [items]);

    React.useEffect(() => {
        return () => {
            timersRef.current.forEach((timer) => clearTimeout(timer));
            timersRef.current.clear();
        };
    }, []);

    return {
        items,
        setItems,
        updateItem,
        isAnyLoading,
    };
}

/**
 * Hook to stagger skeleton loading animations
 * Creates cascading load effect for lists
 */

interface UseStaggeredSkeletonsOptions {
    itemCount?: number;
    staggerDelay?: number;
    shouldShow?: boolean;
}

export function useStaggeredSkeletons(opts?: UseStaggeredSkeletonsOptions) {
    const { itemCount = 5, staggerDelay = 50, shouldShow = true } = opts || {};

    const visibleIndices = React.useMemo(() => {
        if (!shouldShow) return [];

        return Array.from({ length: itemCount }).map((_, i) => ({
            index: i,
            delay: i * staggerDelay,
        }));
    }, [itemCount, staggerDelay, shouldShow]);

    return visibleIndices;
}

/**
 * Hook to manage progressive skeleton loading
 * Shows full skeleton array then removes items as data loads
 */

interface UseProgressiveSkeletonsOptions<T> {
    data?: T[];
    isLoading?: boolean;
    skeletonCount?: number;
    staggerDelay?: number;
}

export function useProgressiveSkeletons<T = any>(opts?: UseProgressiveSkeletonsOptions<T>) {
    const { data = [], isLoading = false, skeletonCount = 5, staggerDelay = 50 } = opts || {};

    const skeletonsToShow = React.useMemo(() => {
        if (!isLoading && data.length > 0) {
            return 0;
        }

        if (isLoading && data.length === 0) {
            return skeletonCount;
        }

        // Partial load: show remaining skeletons
        if (isLoading && data.length > 0) {
            return Math.max(0, skeletonCount - data.length);
        }

        return 0;
    }, [data, isLoading, skeletonCount]);

    const renderedItems = React.useMemo(() => {
        const items: any[] = [];

        // Add loaded data
        data.forEach((item, idx) => {
            items.push({
                id: `item-${idx}`,
                type: 'data',
                data: item,
                index: idx,
            });
        });

        // Add remaining skeletons
        for (let i = 0; i < skeletonsToShow; i++) {
            items.push({
                id: `skeleton-${data.length + i}`,
                type: 'skeleton',
                index: data.length + i,
                delay: i * staggerDelay,
            });
        }

        return items;
    }, [data, skeletonsToShow, staggerDelay]);

    return {
        renderedItems,
        visibleSkeletons: skeletonsToShow,
        isFullyLoaded: !isLoading && data.length > 0,
    };
}
