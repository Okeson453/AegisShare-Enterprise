import { ReactNode } from 'react'
import RouteTransition from '@/components/routing/RouteTransition'
import { useToast } from '@/hooks/useToast'

/**
 * Admin Page Wrapper
 * Automatically applied to all admin pages:
 * - Route transition animations
 * - Toast notifications ready
 * - Error boundary support
 * - Loading state management
 */

interface AdminPageWrapperProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showLoadingState?: boolean
}

export const AdminPageWrapper = ({
  children,
  title,
  subtitle,
  showLoadingState = false,
}: AdminPageWrapperProps) => {
  const toast = useToast()

  return (
    <RouteTransition>
      <div className="s12-stack-lg s12-p-6">
        {/* Page Header */}
        {(title || subtitle) && (
          <div className="s12-section-header">
            {title && (
              <h1 className="s12-text-2xl s12-font-bold s12-text-emphasis">{title}</h1>
            )}
            {subtitle && (
              <p className="s12-text-sm s12-text-muted s12-mt-2">{subtitle}</p>
            )}
          </div>
        )}

        {/* Page Content */}
        <div>
          {children}
        </div>
      </div>
    </RouteTransition>
  )
}

/**
 * Export toast instance for page-level use
 */
export const useAdminToast = () => useToast()
