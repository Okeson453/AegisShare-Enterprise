import { ReactNode, Component, ErrorInfo } from 'react'
import ErrorPage from '@/pages/errors/ErrorPage'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary — Top-level error catcher
 *
 * Catches JavaScript errors in child components
 * Logs error details and displays error UI
 * Does NOT catch:
 *  - Event handler errors (use try-catch)
 *  - Async code errors (use .catch())
 *  - SSR errors
 *  - Boundary itself errors
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details to console and error tracking service
    console.error('Error Boundary caught:', error, errorInfo)

    // Could also send to error tracking service (Sentry, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   errorTrackingService.captureException(error, { errorInfo })
    // }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorPage />
    }

    return this.props.children
  }
}
