import { useState, useCallback, useRef, useEffect } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => Promise<void>
  threshold?: number
  enabled?: boolean
}

export const useInfiniteScroll = ({
  onLoadMore,
  threshold = 0.1,
  enabled = true,
}: UseInfiniteScrollOptions) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const observerTarget = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleLoadMore = useCallback(async () => {
    if (!enabled || isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)
    abortControllerRef.current = new AbortController()

    try {
      await onLoadMore()
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [onLoadMore, enabled, isLoading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && enabled) {
          handleLoadMore()
        }
      },
      { threshold }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      observer.disconnect()
      abortControllerRef.current?.abort()
    }
  }, [handleLoadMore, hasMore, isLoading, enabled, threshold])

  return {
    observerTarget,
    isLoading,
    hasMore,
    setHasMore,
    error,
    retry: handleLoadMore,
  }
}
