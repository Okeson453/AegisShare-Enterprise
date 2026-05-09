import React, { useState } from 'react'
import { Tabs } from '@/components/common'
import { Card, Toggle, Button } from '@/components/ui'
import { useAuthStore, useUiStore } from '@/store'

const UserProfile: React.FC = () => {
    const { user } = useAuthStore()

    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-sm font-semibold text-t0 mb-4">Profile Information</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-t3 mb-1 block">Name</label>
                        <p className="text-sm text-t0 font-semibold">{user?.name}</p>
                    </div>
                    <div>
                        <label className="text-xs text-t3 mb-1 block">Email</label>
                        <p className="text-sm text-t0 font-mono">{user?.email}</p>
                    </div>
                    <div>
                        <label className="text-xs text-t3 mb-1 block">Role</label>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${user?.role === 'SUPER_ADMIN' ? 'bg-rd/20 text-rd' :
                                user?.role === 'SECURITY_ADMIN' ? 'bg-or/20 text-or' :
                                    user?.role === 'AUDITOR' ? 'bg-cy/20 text-cy' : 'bg-t3/20 text-t3'
                            }`}>
                            {user?.role}
                        </span>
                    </div>
                    <div>
                        <label className="text-xs text-t3 mb-1 block">Department</label>
                        <p className="text-sm text-t0">{user?.abacAttributes?.department || 'Security'}</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

const Encryption: React.FC = () => {
    const [settings, setSettings] = useState({
        aes: true,
        ece: true,
        watermark: true,
    })

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">Encryption Settings</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-t0">AES-256-GCM</span>
                        <p className="text-xs text-t3 mt-1">Symmetric encryption for data-at-rest</p>
                    </div>
                    <Toggle
                        checked={settings.aes}
                        onChange={(e) => setSettings({ ...settings, aes: e.target.checked })}
                        disabled
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-t0">ECIES Wrapping</span>
                        <p className="text-xs text-t3 mt-1">Key wrapping with ECIES</p>
                    </div>
                    <Toggle
                        checked={settings.ece}
                        onChange={(e) => setSettings({ ...settings, ece: e.target.checked })}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-t0">File Watermarking</span>
                        <p className="text-xs text-t3 mt-1">Digital watermark on sensitive files</p>
                    </div>
                    <Toggle
                        checked={settings.watermark}
                        onChange={(e) => setSettings({ ...settings, watermark: e.target.checked })}
                    />
                </div>
            </div>
        </Card>
    )
}

const AccessPolicy: React.FC = () => {
    const [policy, setPolicy] = useState({
        requireMfa: true,
        ssoRequired: true,
        ipWhitelist: true,
    })

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">Access Policy</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-t0">Require MFA</span>
                        <p className="text-xs text-t3 mt-1">Enforce multi-factor authentication</p>
                    </div>
                    <Toggle
                        checked={policy.requireMfa}
                        onChange={(e) => setPolicy({ ...policy, requireMfa: e.target.checked })}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-t0">SSO Required</span>
                        <p className="text-xs text-t3 mt-1">Single sign-on only access</p>
                    </div>
                    <Toggle
                        checked={policy.ssoRequired}
                        onChange={(e) => setPolicy({ ...policy, ssoRequired: e.target.checked })}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-t0">IP Whitelist</span>
                        <p className="text-xs text-t3 mt-1">Restrict to known IP ranges</p>
                    </div>
                    <Toggle
                        checked={policy.ipWhitelist}
                        onChange={(e) => setPolicy({ ...policy, ipWhitelist: e.target.checked })}
                    />
                </div>
            </div>
        </Card>
    )
}

const AuditConfig: React.FC = () => {
    const [audit, setAudit] = useState({
        wormMode: true,
        hsmSigning: true,
        retentionDays: 2555,
    })

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">Audit Configuration</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-t0">WORM Mode</span>
                        <p className="text-xs text-t3 mt-1">Write-Once-Read-Many (immutable audit logs)</p>
                    </div>
                    <Toggle
                        checked={audit.wormMode}
                        onChange={(e) => setAudit({ ...audit, wormMode: e.target.checked })}
                        disabled
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-t0">HSM Signing</span>
                        <p className="text-xs text-t3 mt-1">Sign audit logs with HSM keys</p>
                    </div>
                    <Toggle
                        checked={audit.hsmSigning}
                        onChange={(e) => setAudit({ ...audit, hsmSigning: e.target.checked })}
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-t0 block mb-2">Retention Period</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={audit.retentionDays}
                            onChange={(e) => setAudit({ ...audit, retentionDays: parseInt(e.target.value) })}
                            aria-label="Retention Period in Days"
                            className="w-24 px-2 py-1.5 bg-s2 border border-bd rounded text-sm text-t0"
                        />
                        <span className="text-sm text-t2">days ({Math.round(audit.retentionDays / 365)} years)</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

const Settings: React.FC = () => {
    const { activeTab, setActiveTab } = useUiStore()

    return (
        <div>
            <h1 className="text-3xl font-bold text-t0 mb-6">Settings</h1>
            <Tabs
                items={[
                    { id: 'profile', label: 'Profile' },
                    { id: 'encryption', label: 'Encryption' },
                    { id: 'policy', label: 'Access Policy' },
                    { id: 'audit', label: 'Audit' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <div className="mt-6 space-y-4">
                {activeTab === 'profile' && <UserProfile />}
                {activeTab === 'encryption' && <Encryption />}
                {activeTab === 'policy' && <AccessPolicy />}
                {activeTab === 'audit' && <AuditConfig />}
            </div>
        </div>
    )
}

export default Settings
