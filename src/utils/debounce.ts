import React from 'react';

/**
 * Debounce Utilities — Rate limit function calls
 * Essential for search, input validation, and resize events
 */

/**
 * Debounce a function call
 * Delays execution until the specified wait time has passed without new calls
 * @param func - The function to debounce
 * @param wait - Milliseconds to wait before executing
 * @param options - Configuration options
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options?: {
        leading?: boolean;
        trailing?: boolean;
        maxWait?: number;
    }
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => any } {
    const { leading = false, trailing = true, maxWait } = options || {};

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastCallTime: number | null = null;
    let lastInvokeTime = 0;
    let result: any = undefined;

    function invokeFunc(time: number) {
        lastInvokeTime = time;
        result = func();
        return result;
    }

    function shouldInvoke(time: number) {
        if (lastCallTime === null) {
            return leading;
        }

        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;

        return (
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
        );
    }

    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            trailingEdge(time);
        } else {
            const timeSinceLastCall = Date.now() - (lastCallTime || 0);
            const timeWaitingForTimer = wait - timeSinceLastCall;
            timeoutId = setTimeout(timerExpired, timeWaitingForTimer);
        }
    }

    function trailingEdge(time: number) {
        timeoutId = null;

        if (trailing && lastCallTime !== null) {
            return invokeFunc(time);
        }
        lastCallTime = null;
    }

    function debounced() {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastCallTime = time;

        if (isInvoking) {
            if (timeoutId === null && leading) {
                result = invokeFunc(time);
            }
            if (timeoutId === null) {
                timeoutId = setTimeout(timerExpired, wait);
            }
        }
        return result;
    }

    (debounced as any).cancel = function cancel() {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        lastInvokeTime = 0;
        lastCallTime = null;
        timeoutId = null;
    };

    (debounced as any).flush = function flush() {
        return timeoutId === null ? result : trailingEdge(Date.now());
    };

    return debounced as any;
}

/**
 * React hook for debounced values
 * Usage: const debouncedValue = useDebouncedValue(value, 300)
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * React hook for debounced callback
 * Usage: const debouncedSearch = useDebouncedCallback((query) => { ... }, 300)
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 300
): T {
    const ref = React.useRef<ReturnType<typeof debounce>>();

    // Create debounced callback
    React.useLayoutEffect(() => {
        ref.current = debounce(callback, delay);
    }, [callback, delay]);

    // Clean up on unmount
    React.useEffect(() => {
        return () => {
            ref.current?.cancel();
        };
    }, []);

    return ((...args) => ref.current?.(...args)) as T;
}

/**
 * React hook for debounced async callback (e.g., search API calls)
 * Usage: const searchAsync = useDebouncedAsyncCallback(async (query) => { ... }, 300)
 */
export function useDebouncedAsyncCallback<T extends (...args: any[]) => Promise<any>>(
    callback: T,
    delay: number = 300
): T {
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return ((...args: any[]) => {
        return new Promise((resolve, reject) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args).then(resolve).catch(reject);
            }, delay);
        });
    }) as T;
}

/**
 * Throttle function — Alternative to debounce
 * Executes function at most once every `wait` milliseconds
 * @param func - The function to throttle
 * @param wait - Milliseconds between executions
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastRanTime = 0;

    return function throttled(...args: Parameters<T>) {
        const now = Date.now();

        if (now - lastRanTime >= wait) {
            func(...args);
            lastRanTime = now;
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                func(...args);
                lastRanTime = Date.now();
                timeoutId = null;
            }, wait - (now - lastRanTime));
        }
    } as T;
}

/**
 * React hook for throttled callback
 * Usage: const throttledScroll = useThrottledCallback(() => { ... }, 100)
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 100
): T {
    const ref = React.useRef<ReturnType<typeof throttle>>();

    React.useLayoutEffect(() => {
        ref.current = throttle(callback, delay);
    }, [callback, delay]);

    return ((...args) => ref.current?.(...args)) as T;
}

/**
 * Debounce search input with loading state
 * Usage: const { query, isLoading, setQuery } = useDebouncedSearch(initialQuery, handleSearch, 300)
 */
export function useDebouncedSearch(
    initialQuery: string = '',
    onSearch: (query: string) => Promise<void> | void,
    delay: number = 300
) {
    const [query, setQuery] = React.useState<string>(initialQuery);
    const [isLoading, setIsLoading] = React.useState(false);
    const debouncedCallback = useDebouncedAsyncCallback(async (q: string) => {
        setIsLoading(true);
        try {
            await Promise.resolve(onSearch(q));
        } finally {
            setIsLoading(false);
        }
    }, delay);

    const handleQueryChange = React.useCallback(
        (newQuery: string) => {
            setQuery(newQuery);
            debouncedCallback(newQuery);
        },
        [debouncedCallback]
    );

    return { query, isLoading, setQuery: handleQueryChange };
}
