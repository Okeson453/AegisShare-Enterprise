import { ReactNode } from 'react'
import {
  SkeletonFileRow,
  SkeletonUserRow,
  SkeletonAuditRow,
  SkeletonStatCard,
} from '@/components/skeleton'

/**
 * Admin Data Table Integration Utilities
 * Provides skeleton loading states for common data tables
 */

export interface DataTableLoadingConfig {
  type: 'file' | 'user' | 'audit' | 'generic'
  count?: number
  animated?: boolean
}

/**
 * Render skeleton loading state based on table type
 */
export const renderTableSkeleton = (config: DataTableLoadingConfig): ReactNode => {
  const { type, count = 5, animated = true } = config

  const SkeletonComponent = {
    file: SkeletonFileRow,
    user: SkeletonUserRow,
    audit: SkeletonAuditRow,
    generic: SkeletonFileRow,
  }[type]

  if (!SkeletonComponent) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={`skeleton-${i}`} animated={animated && i === 0} />
      ))}
    </div>
  )
}

/**
 * Wrap table component with loading state
 */
interface DataTableWrapperProps<T> {
  data: T[]
  isLoading: boolean
  skeletonType: 'file' | 'user' | 'audit' | 'generic'
  columns: ReactNode
  renderRow: (item: T, index: number) => ReactNode
  emptyMessage?: string
  error?: Error | null
}

export const DataTableWrapper = <T extends any>({
  data,
  isLoading,
  skeletonType,
  renderRow,
  columns,
  emptyMessage = 'No data available',
  error,
}: DataTableWrapperProps<T>) => {
  if (isLoading) {
    return renderTableSkeleton({ type: skeletonType })
  }

  if (error) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
        }}
      >
        <p style={{ color: 'var(--rd)', fontWeight: 600, margin: 0 }}>Error loading data</p>
        <p style={{ color: 'var(--t2)', fontSize: '12px', margin: '8px 0 0 0' }}>
          {error.message}
        </p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--t2)',
        }}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div>
      {columns}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((item, index) => renderRow(item, index))}
      </div>
    </div>
  )
}

/**
 * Infinite scroll table integration
 */
export interface InfiniteScrollTableProps<T> extends DataTableWrapperProps<T> {
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
}

export const InfiniteScrollTable = <T extends any>({
  data,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  ...props
}: InfiniteScrollTableProps<T>) => {
  const observerTarget = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onLoadMore])

  return (
    <>
      <DataTableWrapper {...props} isLoading={isLoading} data={data} />
      {hasMore && (
        <div ref={observerTarget} style={{ height: '20px', marginTop: '20px' }}>
          {isLoadingMore && renderTableSkeleton({ type: props.skeletonType, count: 2 })}
        </div>
      )}
    </>
  )
}

import React from 'react'
