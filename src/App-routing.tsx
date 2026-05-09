import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';

// Layout
import AppLayout from '@/components/layout/AppLayout';

// Pages
import CommandCenter from '@/pages/CommandCenter/CommandCenter';
import Vault from '@/pages/Vault/Vault';
import ComplianceHub from '@/pages/ComplianceHub';
import PolicyEngine from '@/pages/PolicyEngine/PolicyEngine';
import AuditChain from '@/pages/AuditChain/AuditChain';
import ThreatIntel from '@/pages/ThreatIntel/ThreatIntel';
import KeyManagement from '@/pages/KeyManagement/KeyManagement';
import AccessControl from '@/pages/AccessControl/AccessControl';
import Settings from '@/pages/Settings/Settings';

/**
 * ProtectedRoute - Route guard requiring authentication
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { accessToken, mfaVerified } = useAuthStore();
    if (!accessToken) return <Navigate to="/login" replace />;
    if (!mfaVerified) return <Navigate to="/login?mfa=1" replace />;
    return <>{children}</>;
}

/**
 * App Routes - Protected shell with sidebar and topbar
 */
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Login placeholder */}
                <Route path="/login" element={<div className="p-8">Login Page</div>} />

                {/* Protected shell */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/overview" replace />} />
                    <Route path="overview/*" element={<CommandCenter />} />
                    <Route path="vault/*" element={<Vault />} />
                    <Route path="compliance/*" element={<ComplianceHub />} />
                    <Route path="policy/*" element={<PolicyEngine />} />
                    <Route path="audit/*" element={<AuditChain />} />
                    <Route path="threat/*" element={<ThreatIntel />} />
                    <Route path="keys/*" element={<KeyManagement />} />
                    <Route path="access/*" element={<AccessControl />} />
                    <Route path="settings/*" element={<Settings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/overview" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
