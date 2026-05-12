import { ReactNode } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { ClearanceLevel, UserRole } from '@/types/user'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredClearance?: ClearanceLevel
  requiredRoles?: UserRole[]
  requireMfa?: boolean
  redirectTo?: string
}

/**
 * Protects routes from unauthorized access
 * Checks authentication, clearance level, roles, and MFA status
 */
export default function ProtectedRoute({
  children,
  requiredClearance,
  requiredRoles,
  requireMfa,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const location = useLocation()
  const { user, isAuthenticated, isMfaVerified, loading } = useAuth()

  // Show loading state while auth is being restored
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Restoring session...</p>
        </div>
      </div>
    )
  }

  // Not authenticated — redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // MFA required but not verified
  if (requireMfa && !isMfaVerified) {
    return <Navigate to="/mfa" state={{ from: location }} replace />
  }

  // Check clearance level
  if (requiredClearance && (!user || user.clearance < requiredClearance)) {
    return <Navigate to="/403" replace />
  }

  // Check required roles
  if (requiredRoles && (!user || !requiredRoles.includes(user.role))) {
    return <Navigate to="/403" replace />
  }

  // All checks passed
  return <>{children}</>
}

