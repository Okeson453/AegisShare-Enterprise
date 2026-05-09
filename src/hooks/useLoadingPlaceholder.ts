import React from 'react';
import { useSkeletonState } from './useSkeletonState';

/**
 * useLoadingPlaceholder — Render skeleton or content based on loading state
 * Simplifies conditional skeleton rendering in components
 */

interface UseLoadingPlaceholderOptions {
    isLoading: boolean;
    error?: Error | null;
    isEmpty?: boolean;
    minDuration?: number;
}

interface UseLoadingPlaceholderResult {
    shouldShowSkeleton: boolean;
    shouldShowContent: boolean;
    shouldShowError: boolean;
    shouldShowEmpty: boolean;
}

export function useLoadingPlaceholder(opts: UseLoadingPlaceholderOptions): UseLoadingPlaceholderResult {
    const { isLoading, error, isEmpty = false, minDuration = 300 } = opts;

    const { isLoading: internalIsLoading } = useSkeletonState({
        minDuration,
    });

    const shouldShowSkeleton = isLoading && !error;
    const shouldShowContent = !isLoading && !error && !isEmpty;
    const shouldShowError = !!error;
    const shouldShowEmpty = !isLoading && !error && isEmpty;

    return {
        shouldShowSkeleton,
        shouldShowContent,
        shouldShowError,
        shouldShowEmpty,
    };
}

/**
 * Compound component for rendering loading, content, error, or empty states
 * Usage:
 * <LoadingPlaceholder {...useLoadingPlaceholder(opts)}>
 *   <LoadingPlaceholder.Skeleton><SkeletonCard /></LoadingPlaceholder.Skeleton>
 *   <LoadingPlaceholder.Content>Content here</LoadingPlaceholder.Content>
 *   <LoadingPlaceholder.Error>Error message</LoadingPlaceholder.Error>
 *   <LoadingPlaceholder.Empty>No data</LoadingPlaceholder.Empty>
 * </LoadingPlaceholder>
 */

interface LoadingPlaceholderProps extends UseLoadingPlaceholderResult {
    children: React.ReactNode;
}

interface LoadingPlaceholderComponent extends React.FC<LoadingPlaceholderProps> {
    Skeleton: React.FC<{ children: React.ReactNode }>;
    Content: React.FC<{ children: React.ReactNode }>;
    Error: React.FC<{ children: React.ReactNode }>;
    Empty: React.FC<{ children: React.ReactNode }>;
}

export const LoadingPlaceholder: LoadingPlaceholderComponent = ({
    shouldShowSkeleton,
    shouldShowContent,
    shouldShowError,
    shouldShowEmpty,
    children,
}) => {
    return React.createElement(React.Fragment, null, children);
};

LoadingPlaceholder.displayName = 'LoadingPlaceholder';

LoadingPlaceholder.Skeleton = ({ children }) => {
    const parent = React.useContext(LoadingPlaceholderContext);
    return parent?.shouldShowSkeleton ? React.createElement(React.Fragment, null, children) : null;
};

LoadingPlaceholder.Content = ({ children }) => {
    const parent = React.useContext(LoadingPlaceholderContext);
    return parent?.shouldShowContent ? React.createElement(React.Fragment, null, children) : null;
};

LoadingPlaceholder.Error = ({ children }) => {
    const parent = React.useContext(LoadingPlaceholderContext);
    return parent?.shouldShowError ? React.createElement(React.Fragment, null, children) : null;
};

LoadingPlaceholder.Empty = ({ children }) => {
    const parent = React.useContext(LoadingPlaceholderContext);
    return parent?.shouldShowEmpty ? React.createElement(React.Fragment, null, children) : null;
};

// Context for sub-components
const LoadingPlaceholderContext = React.createContext<UseLoadingPlaceholderResult | null>(null);

/**
 * Simple conditional component for skeleton or content
 * Simpler alternative when you only need skeleton vs content
 */

interface SkeletonOrContentProps {
    isLoading: boolean;
    skeleton: React.ReactNode;
    children: React.ReactNode;
    minDuration?: number;
}

export const SkeletonOrContent: React.FC<SkeletonOrContentProps> = ({
    isLoading,
    skeleton,
    children,
    minDuration = 300,
}) => {
    const { isLoading: shouldShowLoading } = useSkeletonState({ minDuration });

    return isLoading && shouldShowLoading 
        ? React.createElement(React.Fragment, null, skeleton)
        : React.createElement(React.Fragment, null, children);
};

SkeletonOrContent.displayName = 'SkeletonOrContent';

/**
 * Hook to manage async data loading with automatic skeleton timing
 * Ensures skeletons show for minimum duration even if data loads quickly
 */

interface UseAsyncLoadOptions {
    minDuration?: number;
}

export function useAsyncLoad<T>(
    asyncFn: () => Promise<T>,
    deps: React.DependencyList = [],
    opts?: UseAsyncLoadOptions
) {
    const { minDuration = 300 } = opts || {};

    const [data, setData] = React.useState<T | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const startTimeRef = React.useRef<number>(Date.now());

    React.useEffect(() => {
        startTimeRef.current = Date.now();

        asyncFn()
            .then((result) => {
                const elapsedTime = Date.now() - startTimeRef.current;
                const remainingTime = Math.max(0, minDuration - elapsedTime);

                setTimeout(() => {
                    setData(result);
                    setIsLoading(false);
                }, remainingTime);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, deps);

    return { data, isLoading, error };
}

/**
 * Hook for intersection-based lazy skeleton loading
 * Only renders skeletons for items that will be visible
 */

interface UseLazySkeletonsOptions {
    itemCount: number;
    threshold?: number;
}

export function useLazySkeletons(opts: UseLazySkeletonsOptions) {
    const { itemCount, threshold = 0.1 } = opts;
    const [visibleIndices, setVisibleIndices] = React.useState(new Set<number>());
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = parseInt(entry.target.getAttribute('data-skeleton-index') || '-1');
                    if (index !== -1) {
                        setVisibleIndices((prev) => {
                            const next = new Set(prev);
                            if (entry.isIntersecting) {
                                next.add(index);
                            } else {
                                next.delete(index);
                            }
                            return next;
                        });
                    }
                });
            },
            { threshold }
        );

        const children = containerRef.current.querySelectorAll('[data-skeleton-index]');
        children.forEach((child) => observer.observe(child));

        return () => observer.disconnect();
    }, [threshold]);

    return { containerRef, visibleIndices };
}
