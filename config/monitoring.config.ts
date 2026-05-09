/**
 * Web Vitals & Performance Monitoring Configuration
 * Integrates Core Web Vitals tracking, Sentry error tracking, and analytics
 */

import * as React from 'react'

// Sentry will be available globally if loaded in HTML
// This import is optional - Sentry should be initialized in index.html or main.tsx
declare global {
    interface Window {
        Sentry?: any
    }
}

/**
 * Core Web Vitals Thresholds
 * Based on Google's recommended thresholds
 */
export const WEB_VITALS_THRESHOLDS = {
    // Largest Contentful Paint (LCP)
    // Time until largest content element is visible
    LCP: {
        good: 2500, // ms - should be <= 2.5s
        moderate: 4000, // ms - between 2.5s and 4s
        poor: Infinity, // > 4s is poor
    },

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    // Time from user input to response
    INP: {
        good: 200, // ms - should be <= 200ms
        moderate: 500, // ms - between 200ms and 500ms
        poor: Infinity, // > 500ms is poor
    },

    // Cumulative Layout Shift (CLS)
    // Visual stability score (multiplied by 100)
    CLS: {
        good: 0.1, // should be <= 0.1
        moderate: 0.25, // between 0.1 and 0.25
        poor: Infinity, // > 0.25 is poor
    },

    // First Contentful Paint (FCP)
    // Time until first content appears
    FCP: {
        good: 1800, // ms - should be <= 1.8s
        moderate: 3000, // ms - between 1.8s and 3s
        poor: Infinity, // > 3s is poor
    },

    // Time to First Byte (TTFB)
    // Server response time
    TTFB: {
        good: 800, // ms - should be <= 800ms
        moderate: 1800, // ms - between 800ms and 1.8s
        poor: Infinity, // > 1.8s is poor
    },
}

/**
 * Classify Web Vital rating
 */
export const classifyVital = (
    metric: keyof typeof WEB_VITALS_THRESHOLDS,
    value: number
): 'good' | 'moderate' | 'poor' => {
    const thresholds = WEB_VITALS_THRESHOLDS[metric]

    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.moderate) return 'moderate'
    return 'poor'
}

/**
 * Web Vitals Metrics Type
 */
export type WebVitalsMetric = {
    name: string
    value: number
    rating: 'good' | 'moderate' | 'poor'
    delta?: number
    id?: string
    navigationTiming?: PerformanceEntryList
    entries?: PerformanceEntryList
}

/**
 * Track Core Web Vitals - Client-side implementation
 * Usage: trackWebVitals(({ name, value, rating }) => { ... })
 */
export const trackWebVitals = (callback: (metric: WebVitalsMetric) => void) => {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries()
                const lastEntry = entries[entries.length - 1] as any

                callback({
                    name: 'LCP',
                    value: lastEntry.renderTime || lastEntry.loadTime || 0,
                    rating: classifyVital('LCP', lastEntry.renderTime || lastEntry.loadTime || 0),
                    id: lastEntry.id || '',
                })
            })

            observer.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (e) {
            console.log('LCP observer not supported')
        }

        // INP/FID (Interaction to Next Paint / First Input Delay)
        try {
            const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const processingDuration = (entry as any).processingDuration
                    callback({
                        name: 'INP',
                        value: (entry as any).duration,
                        rating: classifyVital('INP', (entry as any).duration),
                    })
                }
            })

            observer.observe({ entryTypes: ['first-input', 'event'] })
        } catch (e) {
            console.log('INP observer not supported')
        }

        // CLS (Cumulative Layout Shift)
        try {
            let clsValue = 0
            const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                        clsValue += (entry as any).value
                        callback({
                            name: 'CLS',
                            value: clsValue,
                            rating: classifyVital('CLS', clsValue),
                        })
                    }
                }
            })

            observer.observe({ entryTypes: ['layout-shift'] })
        } catch (e) {
            console.log('CLS observer not supported')
        }

        // FCP (First Contentful Paint)
        try {
            const observer = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries()
                const fcpEntry = entries.find((e) => e.name === 'first-contentful-paint')

                if (fcpEntry) {
                    callback({
                        name: 'FCP',
                        value: fcpEntry.startTime,
                        rating: classifyVital('FCP', fcpEntry.startTime),
                    })
                }
            })

            observer.observe({ entryTypes: ['paint'] })
        } catch (e) {
            console.log('FCP observer not supported')
        }

        // TTFB (Time to First Byte)
        try {
            const navTiming = window.performance.timing
            const ttfb = navTiming.responseStart - navTiming.navigationStart

            callback({
                name: 'TTFB',
                value: ttfb,
                rating: classifyVital('TTFB', ttfb),
            })
        } catch (e) {
            console.log('TTFB measurement not available')
        }
    }
}

/**
 * Send metrics to analytics backend
 */
export const sendMetricsToAnalytics = async (metrics: WebVitalsMetric[]) => {
    try {
        const response = await fetch('/api/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                metrics,
                url: window.location.href,
                userAgent: navigator.userAgent,
            }),
        })

        if (!response.ok) {
            console.error('Failed to send metrics:', response.statusText)
        }
    } catch (error) {
        console.error('Error sending metrics:', error)
    }
}

/**
 * Sentry Integration Configuration
 */
export const SENTRY_CONFIG = {
    // Initialize in your app entry point
    init: {
        dsn: (globalThis as any).process?.env?.REACT_APP_SENTRY_DSN || 'https://xxx@xxx.ingest.sentry.io/xxx',
        environment: (globalThis as any).process?.env?.NODE_ENV || 'development',
        tracesSampleRate: (globalThis as any).process?.env?.NODE_ENV === 'production' ? 0.1 : 1.0,
        release: (globalThis as any).process?.env?.REACT_APP_VERSION || '1.0.0',

        // Performance Monitoring
        integrations: [
            'Replay',
            'ReplaySessionSampleRate',
            'ReplayOnErrorSampleRate',
            'BrowserTracing',
        ],

        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,

        // Ignore certain errors
        ignoreErrors: [
            // Script errors from browser extensions
            'top.GLOBALS',
            // Network errors that are expected
            'NetworkError',
            'Network request failed',
        ],

        // Allowed URLs for tracing
        allowUrls: [
            /https?:\/\/(app|admin)\.aegisshare\.local/,
            /https?:\/\/localhost/,
        ],

        // Denied URLs (don't trace)
        denyUrls: [
            /graph\.instagram\.com/,
            /connect\.facebook\.net/,
        ],
    },

    // Configure error boundaries
    errorBoundary: {
        showDialog: true,
        dialogOptions: {
            title: 'Something went wrong',
            subtitle: 'Our team has been notified',
            labelComments: 'What happened?',
            labelClose: 'Close',
            labelSubmit: 'Submit',
            onClose: () => {
                // Reload page on close
                window.location.href = '/'
            },
        },
    },
}

/**
 * Initialize Web Vitals tracking in your app
 */
export const initializeWebVitalsTracking = () => {
    const metrics: WebVitalsMetric[] = []

    trackWebVitals((metric) => {
        metrics.push(metric)

        // Log to console in development
        const isDevelopment = (globalThis as any).process?.env?.NODE_ENV === 'development'
        if (isDevelopment) {
            console.log(`[${metric.name}] ${metric.value.toFixed(2)}ms (${metric.rating})`)
        }

        // Send to Sentry in production
        const isProduction = (globalThis as any).process?.env?.NODE_ENV === 'production'
        if (isProduction) {
            try {
                const Sentry = (window as any).Sentry
                if (Sentry) {
                    Sentry.captureMessage(`Web Vital - ${metric.name}: ${metric.value}ms`, {
                        level: metric.rating === 'poor' ? 'warning' : 'info',
                        tags: {
                            vital: metric.name,
                            rating: metric.rating,
                        },
                        measurements: {
                            [metric.name.toLowerCase()]: { value: metric.value },
                        },
                    })
                }
            } catch (error) {
                console.error('Failed to send metric to Sentry:', error)
            }
        }
    })

    // Send batch metrics every 30s
    setInterval(() => {
        if (metrics.length > 0) {
            sendMetricsToAnalytics([...metrics])
            metrics.length = 0
        }
    }, 30000)
}

/**
 * React Hook for tracking Web Vitals in components
 */
export const useWebVitalsTracking = () => {
    React.useEffect(() => {
        initializeWebVitalsTracking()
    }, [])
}

/**
 * Custom event tracking for user interactions
 */
export const trackCustomEvent = async (
    eventName: string,
    data?: Record<string, any>
) => {
    try {
        // Send to Sentry
        try {
            const Sentry = (window as any).Sentry
            if (Sentry) {
                Sentry.captureMessage(`Custom Event: ${eventName}`, {
                    level: 'info',
                    tags: { event: eventName },
                    extra: data,
                })
            }
        } catch (e) {
            console.error('Sentry error:', e)
        }

        // Send to analytics backend
        await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: eventName,
                data,
                timestamp: new Date().toISOString(),
                url: window.location.href,
            }),
        })
    } catch (error) {
        console.error('Failed to track event:', error)
    }
}

/**
 * React Error Boundary component
 * For Sentry integration, wrap this component or use ErrorBoundary from @sentry/react directly
 */
export const ErrorBoundary = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [hasError, setHasError] = React.useState(false)

    React.useEffect(() => {
        const errorHandler = () => {
            setHasError(true)
            // Optionally report to Sentry
            if ((window as any).Sentry) {
                ; (window as any).Sentry.captureException(new Error('Error Boundary triggered'))
            }
        }

        window.addEventListener('error', errorHandler)
        return () => window.removeEventListener('error', errorHandler)
    }, [])

    if (hasError) {
        return React.createElement(
            'div',
            { style: { padding: '20px', textAlign: 'center' } },
            React.createElement('h1', null, 'Something went wrong'),
            React.createElement(
                'p',
                null,
                'Our team has been notified and is working to fix it.'
            ),
            React.createElement(
                'button',
                { onClick: () => window.location.reload() },
                'Reload Page'
            )
        )
    }

    return children
}

/**
 * Example implementation in main App.tsx
 */
export const APP_MONITORING_SETUP = `
import React from 'react'
import * as Sentry from '@sentry/react'
import { initializeWebVitalsTracking, SENTRY_CONFIG } from '@/config/monitoring'

// Initialize Sentry
Sentry.init(SENTRY_CONFIG.init)

function App() {
  // Initialize Web Vitals tracking
  React.useEffect(() => {
    initializeWebVitalsTracking()
  }, [])

  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <Router>
        {/* Your app routes */}
      </Router>
    </Sentry.ErrorBoundary>
  )
}

export default Sentry.withProfiler(App)
`

/**
 * Environment variables needed
 */
export const REQUIRED_ENV_VARS = {
    'REACT_APP_SENTRY_DSN': 'Sentry DSN for error tracking',
    'REACT_APP_VERSION': 'App version from package.json',
    'NODE_ENV': 'development|staging|production',
    'REACT_APP_API_URL': 'Backend API URL for metrics submission',
}
