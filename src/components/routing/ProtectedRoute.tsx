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
  const { user, isAuthenticated, isMfaVerified } = useAuth()

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

