/**
 * Core Web Vitals monitoring and reporting
 */

export interface VitalsMetric {
    name: string
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
    delta: number
    id: string
}

export const CWV_THRESHOLDS = {
    LCP: 1500,
    FCP: 900,
    FID: 50,
    INP: 100,
    CLS: 0.1,
    TTFB: 200,
} as const

export function isMetricGood(
    metricName: keyof typeof CWV_THRESHOLDS,
    value: number
): boolean {
    const threshold = CWV_THRESHOLDS[metricName]
    return value <= threshold
}

export function getMetricRating(
    metricName: keyof typeof CWV_THRESHOLDS,
    value: number
): 'good' | 'needs-improvement' | 'poor' {
    const threshold = CWV_THRESHOLDS[metricName]
    if (value <= threshold) return 'good'
    if (value <= threshold * 1.25) return 'needs-improvement'
    return 'poor'
}

export const initializeWebVitals = (callback?: (metric: VitalsMetric) => void) => {
    // TODO: Install web-vitals package: npm install web-vitals
    // Then import and initialize:
    // import { getCLS, getFID, getFCP, getLCP, getTTFB, getINP } from 'web-vitals'
    if (typeof callback === 'function') {
        // Placeholder implementation
    }
}

export const sendMetricsToAnalytics = async (metric: VitalsMetric, endpoint: string) => {
    // TODO: Implement after installing web-vitals package
}

export const trackWebVital = (callback: (metric: VitalsMetric) => void) => {
    // Placeholder
}
