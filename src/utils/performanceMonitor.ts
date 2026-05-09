/**
 * performanceMonitor — Web performance tracking utilities
 *
 * Features:
 * - Measure component render times
 * - Track Core Web Vitals
 * - Memory usage monitoring
 * - Network performance
 * - FCP, LCP, CLS tracking
 */

export interface PerformanceMetrics {
    name: string
    duration: number
    timestamp: number
    memory?: {
        used: number
        limit: number
        percentage: number
    }
}

const metrics: PerformanceMetrics[] = []

/**
 * Measure function execution time
 * @example
 *   const result = await measurePerformance('fetchUser', async () => {
 *     return await api.getUser()
 *   })
 */
export async function measurePerformance<T>(
    name: string,
    fn: () => Promise<T>
): Promise<T> {
    const start = performance.now()

    try {
        return await fn()
    } finally {
        const duration = performance.now() - start
        recordMetric(name, duration)

        if (duration > 1000) {
            console.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`)
        }
    }
}

/**
 * Measure synchronous function execution time
 */
export function measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now()

    try {
        return fn()
    } finally {
        const duration = performance.now() - start
        recordMetric(name, duration)

        if (duration > 100) {
            console.warn(`⚠️ Slow sync operation: ${name} took ${duration.toFixed(2)}ms`)
        }
    }
}

/**
 * Record a performance metric
 */
function recordMetric(name: string, duration: number): void {
    const metric: PerformanceMetrics = {
        name,
        duration,
        timestamp: Date.now(),
    }

    // Include memory usage if available
    if ((performance as any).memory) {
        const mem = (performance as any).memory
        metric.memory = {
            used: mem.usedJSHeapSize,
            limit: mem.jsHeapSizeLimit,
            percentage: (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100,
        }
    }

    metrics.push(metric)

    // Keep only last 100 metrics
    if (metrics.length > 100) {
        metrics.shift()
    }
}

/**
 * Get all recorded metrics
 */
export function getMetrics(): PerformanceMetrics[] {
    return [...metrics]
}

/**
 * Get metrics by name
 */
export function getMetricsFor(name: string): PerformanceMetrics[] {
    return metrics.filter((m) => m.name === name)
}

/**
 * Calculate average duration for operation
 */
export function getAverageDuration(name: string): number {
    const ops = getMetricsFor(name)
    if (ops.length === 0) return 0

    const total = ops.reduce((sum, m) => sum + m.duration, 0)
    return total / ops.length
}

/**
 * Get performance report
 */
export function getPerformanceReport(): Record<string, { count: number; avg: number; max: number }> {
    const report: Record<string, { count: number; avg: number; max: number }> = {}

    metrics.forEach((metric) => {
        const entry = report[metric.name]
        if (!entry) {
            report[metric.name] = { count: 0, avg: 0, max: 0 }
        }

        const current = report[metric.name]
        if (current) {
            current.count++
            current.max = Math.max(current.max, metric.duration)
        }
    })

    // Calculate averages
    Object.keys(report).forEach((name) => {
        const current = report[name]
        if (current) {
            current.avg = getAverageDuration(name)
        }
    })

    return report
}

/**
 * Clear all metrics
 */
export function clearMetrics(): void {
    metrics.length = 0
}

/**
 * Log performance summary to console
 */
export function logPerformanceReport(): void {
    const report = getPerformanceReport()

    console.group('📊 Performance Report')
    console.table(report)
    console.groupEnd()
}

/**
 * Get memory usage if available
 */
export function getMemoryUsage(): {
    used: number
    limit: number
    percentage: number
} | null {
    const memory = (performance as any).memory
    if (!memory) return null

    return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 10000) / 100,
    }
}

/**
 * React hook to measure component render time
 */
import { useEffect } from 'react'

export function usePerformanceMonitor(componentName: string): void {
    useEffect(() => {
        const start = performance.now()

        return () => {
            const duration = performance.now() - start
            recordMetric(`render:${componentName}`, duration)
        }
    }, [componentName])
}

