import { lazy, Suspense, ReactNode } from 'react'
import { SkeletonCard } from '@/components/skeleton'

interface LazyComponentConfig {
  loadingFallback?: ReactNode
  delay?: number
}

/**
 * Wraps a lazy-loaded component with Suspense and optional loading fallback
 * Used for route-level code splitting
 */
export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  config: LazyComponentConfig = {}
) => {
  const { loadingFallback = <SkeletonCard />, delay = 0 } = config

  const LazyComponent = lazy(async () => {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
    return importFunc()
  })

  return (props: P) => (
    <Suspense fallback={loadingFallback}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  )
}

/**
 * Preload a lazy component before it's needed
 * Call in route change handlers or on user hover
 */
export const preloadComponent = (
  importFunc: () => Promise<{ default: React.ComponentType<any> }>
): void => {
  importFunc().catch((err) => console.warn('Failed to preload component:', err))
}
