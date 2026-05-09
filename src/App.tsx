import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import '@/styles/admin-console.css'
import '@/styles/access-control-extension.css'
import PageLoader from '@/components/common/PageLoader'
import ProtectedRoute from '@/components/routing/ProtectedRoute'
import RouteTransition from '@/components/routing/RouteTransition'
import AppLayout from '@/components/layout/AppLayout'
import { ToastProvider } from '@/components/toast/ToastProvider'
import { ClearanceLevel, UserRole } from '@/types/user'

// ── AUTH PAGES (minimal bundle — load instantly)
const Login = lazy(() => import('@/pages/Login'))
const SsoCallback = lazy(() => import('@/pages/SsoCallback'))

// ── MAIN APP PAGES (per-page chunks)
const CommandCenter = lazy(() => import('@/pages/CommandCenter/CommandCenter'))
const Vault = lazy(() => import('@/pages/Vault/Vault'))
const ComplianceHub = lazy(() => import('@/pages/ComplianceHub'))
const PolicyEngine = lazy(() => import('@/pages/PolicyEngine/PolicyEngine'))
const AuditChain = lazy(() => import('@/pages/AuditChain/AuditChain'))
const ThreatIntel = lazy(() => import('@/pages/ThreatIntel/ThreatIntel'))
const KeyManagement = lazy(() => import('@/pages/KeyManagement/KeyManagement'))
const AccessControl = lazy(() => import('@/pages/AccessControl/AccessControl'))

// ── SETTINGS & USER PAGES
const Settings = lazy(() => import('@/pages/Settings/Settings'))
const Profile = lazy(() => import('@/pages/Profile/Profile'))
const Security = lazy(() => import('@/pages/Security/Security'))
const Notifications = lazy(() => import('@/pages/Notifications/Notifications'))
const Preferences = lazy(() => import('@/pages/Preferences/Preferences'))
const Appearance = lazy(() => import('@/pages/Appearance/Appearance'))

// ── ADMIN MODULE (separate large chunk)
const AdminApp = lazy(() => import('@/admin/AdminApp').then(m => ({ default: m.AdminApp })))

// ── ERROR PAGES (tiny — inline is fine)
const NotFound = lazy(() => import('@/pages/errors/NotFound'))
const ErrorPage = lazy(() => import('@/pages/errors/ErrorPage'))
const Forbidden = lazy(() => import('@/pages/errors/Forbidden'))
const Maintenance = lazy(() => import('@/pages/errors/Maintenance'))

export default function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback/:provider" element={<SsoCallback />} />
          <Route path="/maintenance" element={<Maintenance />} />

          {/* Protected main app routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/overview" replace />} />
            <Route
              path="/overview/*"
              element={
                <RouteTransition>
                  <CommandCenter />
                </RouteTransition>
              }
            />
            <Route
              path="/vault/*"
              element={
                <RouteTransition>
                  <Vault />
                </RouteTransition>
              }
            />
            <Route
              path="/compliance/*"
              element={
                <RouteTransition>
                  <ComplianceHub />
                </RouteTransition>
              }
            />
            <Route
              path="/policy/*"
              element={
                <ProtectedRoute requiredClearance={ClearanceLevel.L2}>
                  <RouteTransition>
                    <PolicyEngine />
                  </RouteTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit/*"
              element={
                <ProtectedRoute requiredClearance={ClearanceLevel.L2}>
                  <RouteTransition>
                    <AuditChain />
                  </RouteTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/threat/*"
              element={
                <ProtectedRoute requiredClearance={ClearanceLevel.L2}>
                  <RouteTransition>
                    <ThreatIntel />
                  </RouteTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/keys/*"
              element={
                <ProtectedRoute requiredClearance={ClearanceLevel.L3}>
                  <RouteTransition>
                    <KeyManagement />
                  </RouteTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/access/*"
              element={
                <ProtectedRoute requiredClearance={ClearanceLevel.L3}>
                  <RouteTransition>
                    <AccessControl />
                  </RouteTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/*"
              element={
                <RouteTransition>
                  <Settings />
                </RouteTransition>
              }
            />

            {/* User profile routes */}
            <Route
              path="/profile"
              element={
                <RouteTransition>
                  <Profile />
                </RouteTransition>
              }
            />
            <Route
              path="/security"
              element={
                <RouteTransition>
                  <Security />
                </RouteTransition>
              }
            />
            <Route
              path="/notifications"
              element={
                <RouteTransition>
                  <Notifications />
                </RouteTransition>
              }
            />
            <Route
              path="/preferences"
              element={
                <RouteTransition>
                  <Preferences />
                </RouteTransition>
              }
            />
            <Route
              path="/appearance"
              element={
                <RouteTransition>
                  <Appearance />
                </RouteTransition>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute
                  requiredClearance={ClearanceLevel.L4}
                  requiredRoles={[UserRole.Admin, UserRole.Compliance]}
                  requireMfa
                >
                  <RouteTransition>
                    <AdminApp />
                  </RouteTransition>
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Error routes */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}
