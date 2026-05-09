import React, { useState, useCallback } from 'react'
import { Badge, Modal, Collapse } from '@/components/ui'
import '../../styles/access-control.css'

type TableColumn<T> = {
    key: keyof T
    label: string
    width?: number
    flex?: number
    render?: (value: any, row: T) => React.ReactNode
}

interface User {
    id: string
    name: string
    email: string
    riskScore: number
    riskBreakdown: { anomalies: number; failedAuths: number; policyViolations: number }
    abacAttributes: { category: string; value: string; color: string }[]
    currentRole: string
    lastActive: Date
}

interface RBACRole {
    id: string
    name: string
}

interface Permission {
    id: string
    resource: string
    role: string
    permission: 'NONE' | 'READ' | 'WRITE' | 'ADMIN'
    changed?: boolean
}

interface JITRequest {
    id: string
    userId: string
    requestedRole: string
    reason: string
    duration: number
    autoRevokeAt?: Date
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired'
    approvers?: string[]
    mfaConfirmed?: boolean
    auditChainId?: string
}

const AccessControl: React.FC = () => {
    // Use local state for tab management (not global store - that was causing the issue)
    const [activeTab, setActiveTab] = useState<'users' | 'rbac' | 'jit'>('users')
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
    const [jitRequests, setJitRequests] = useState<JITRequest[]>([
        { id: 'j1', userId: 'u1', requestedRole: 'AUDITOR', reason: 'Quarterly compliance review', status: 'pending', duration: 4, approvers: ['admin1', 'admin2'] },
        { id: 'j2', userId: 'u2', requestedRole: 'KEY_ADMIN', reason: 'Key rotation task', status: 'approved', duration: 2, mfaConfirmed: true, auditChainId: 'ac-2024-001' },
        { id: 'j3', userId: 'u1', requestedRole: 'OPERATOR', reason: 'Emergency access', status: 'active', duration: 1, autoRevokeAt: new Date(Date.now() + 3600000), mfaConfirmed: true, auditChainId: 'ac-2024-002' },
    ])
    const [showJITModal, setShowJITModal] = useState(false)
    const [jitStep, setJitStep] = useState(0)
    const [showMFAPrompt, setShowMFAPrompt] = useState(false)
    const [showDiffView, setShowDiffView] = useState(false)
    const [showRecertModal, setShowRecertModal] = useState(false)
    const [rbacChanges, setRbacChanges] = useState<Map<string, { oldPerm: string; newPerm: string }>>(new Map())
    const [changedCellsBorder, setChangedCellsBorder] = useState<Set<string>>(new Set())

    // S9 State Variables
    const [scanningRisks, setScanningRisks] = useState<Set<string>>(new Set())
    const [scannedUsers, setScannedUsers] = useState<Set<string>>(new Set())
    const [riskScanInProgress, setRiskScanInProgress] = useState(false)
    const [approvingJIT, setApprovingJIT] = useState<Set<string>>(new Set())
    const [jitApprovalInProgress, setJitApprovalInProgress] = useState(false)
    const [auditingRBAC, setAuditingRBAC] = useState<Set<string>>(new Set())
    const [rbacAuditInProgress, setRbacAuditInProgress] = useState(false)

    const users: User[] = [
        {
            id: 'u1',
            name: 'm.chen',
            email: 'm.chen@aegisshare.io',
            riskScore: 15,
            riskBreakdown: { anomalies: 2, failedAuths: 1, policyViolations: 0 },
            abacAttributes: [
                { category: 'Department', value: 'Security', color: '#A78BFA' },
                { category: 'Clearance', value: 'Top Secret', color: '#F43F5E' },
                { category: 'Location', value: 'US-East', color: '#22D3EE' },
            ],
            currentRole: 'USER',
            lastActive: new Date(),
        },
        {
            id: 'u2',
            name: 'j.davis',
            email: 'j.davis@aegisshare.io',
            riskScore: 28,
            riskBreakdown: { anomalies: 5, failedAuths: 3, policyViolations: 2 },
            abacAttributes: [
                { category: 'Department', value: 'Operations', color: '#A78BFA' },
                { category: 'Clearance', value: 'Secret', color: '#F59E0B' },
                { category: 'Location', value: 'US-West', color: '#22D3EE' },
            ],
            currentRole: 'OPERATOR',
            lastActive: new Date(Date.now() - 3600000),
        },
        {
            id: 'u3',
            name: 'r.patel',
            email: 'r.patel@aegisshare.io',
            riskScore: 42,
            riskBreakdown: { anomalies: 12, failedAuths: 8, policyViolations: 5 },
            abacAttributes: [
                { category: 'Department', value: 'Admin', color: '#A78BFA' },
                { category: 'Clearance', value: 'Top Secret', color: '#F43F5E' },
                { category: 'Location', value: 'US-Central', color: '#22D3EE' },
            ],
            currentRole: 'ADMIN',
            lastActive: new Date(Date.now() - 7200000),
        },
        {
            id: 'u4',
            name: 'a.williams',
            email: 'a.williams@aegisshare.io',
            riskScore: 8,
            riskBreakdown: { anomalies: 0, failedAuths: 0, policyViolations: 0 },
            abacAttributes: [
                { category: 'Department', value: 'Support', color: '#A78BFA' },
                { category: 'Clearance', value: 'Confidential', color: '#10B981' },
                { category: 'Location', value: 'US-East', color: '#22D3EE' },
            ],
            currentRole: 'USER',
            lastActive: new Date(Date.now() - 86400000),
        },
    ]

    const roles: RBACRole[] = [
        { id: 'r1', name: 'USER' },
        { id: 'r2', name: 'OPERATOR' },
        { id: 'r3', name: 'AUDITOR' },
        { id: 'r4', name: 'KEY_ADMIN' },
        { id: 'r5', name: 'ADMIN' },
    ]

    const [rbacMatrix, setRbacMatrix] = useState<Permission[]>([
        { id: 'p1', resource: 'VAULT', role: 'USER', permission: 'READ' },
        { id: 'p2', resource: 'VAULT', role: 'OPERATOR', permission: 'WRITE' },
        { id: 'p3', resource: 'VAULT', role: 'ADMIN', permission: 'ADMIN' },
        { id: 'p4', resource: 'KEYS', role: 'USER', permission: 'NONE' },
        { id: 'p5', resource: 'KEYS', role: 'OPERATOR', permission: 'READ' },
        { id: 'p6', resource: 'KEYS', role: 'KEY_ADMIN', permission: 'ADMIN' },
        { id: 'p7', resource: 'AUDIT', role: 'AUDITOR', permission: 'READ' },
        { id: 'p8', resource: 'AUDIT', role: 'ADMIN', permission: 'ADMIN' },
        { id: 'p9', resource: 'POLICY', role: 'OPERATOR', permission: 'READ' },
        { id: 'p10', resource: 'POLICY', role: 'ADMIN', permission: 'ADMIN' },
    ])

    const resources = ['VAULT', 'KEYS', 'AUDIT', 'POLICY', 'CONFIG']

    const getRiskColor = (score: number) => {
        if (score >= 40) return '#F43F5E'
        if (score >= 25) return '#F59E0B'
        if (score >= 15) return '#3B82F6'
        return '#10B981'
    }

    const getPermissionColor = (perm: string) => {
        switch (perm) {
            case 'ADMIN':
                return '#F43F5E'
            case 'WRITE':
                return '#F59E0B'
            case 'READ':
                return '#10B981'
            case 'NONE':
                return '#64748B'
            default:
                return '#8BA4C2'
        }
    }

    const exportMatrix = (format: 'json' | 'csv') => {
        const data = rbacMatrix.map(p => ({
            resource: p.resource,
            role: p.role,
            permission: p.permission,
        }))

        if (format === 'json') {
            const json = JSON.stringify(data, null, 2)
            const blob = new Blob([json], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `rbac-matrix-${Date.now()}.json`
            a.click()
        } else {
            const csv = ['resource,role,permission', ...data.map(d => `${d.resource},${d.role},${d.permission}`)].join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `rbac-matrix-${Date.now()}.csv`
            a.click()
        }
    }

    const cyclePermission = (id: string) => {
        const perm = rbacMatrix.find(p => p.id === id)
        if (!perm) return
        const cycle = ['NONE', 'READ', 'WRITE', 'ADMIN']
        const currentIdx = cycle.indexOf(perm.permission)
        const nextIdx = (currentIdx + 1) % cycle.length
        perm.permission = cycle[nextIdx] as 'NONE' | 'READ' | 'WRITE' | 'ADMIN'
        perm.changed = true
        setRbacMatrix([...rbacMatrix])
        const oldPerm = cycle[currentIdx] || 'NONE'
        const newPerm = cycle[nextIdx] || 'ADMIN'
        rbacChanges.set(`${perm.resource}-${perm.role}`, { oldPerm, newPerm })
        setRbacChanges(new Map(rbacChanges))
    }

    const formatRevokeTime = (date: Date) => {
        const now = new Date()
        const diff = date.getTime() - now.getTime()
        const mins = Math.floor(diff / 60000)
        const hours = Math.floor(mins / 60)
        if (hours > 0) return `${hours}h ${mins % 60}m`
        return `${mins}m`
    }

    // S9 Core Functions
    const scanAllRisks = useCallback(async () => {
        setRiskScanInProgress(true)
        const userIds = users.map(u => u.id)

        for (const userId of userIds) {
            await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300))
            setScanningRisks(prev => new Set([...prev, userId]))
            await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200))
            setScanningRisks(prev => {
                const newSet = new Set(prev)
                newSet.delete(userId)
                return newSet
            })
            setScannedUsers(prev => new Set([...prev, userId]))
        }

        setRiskScanInProgress(false)
    }, [users])

    const approveAllJIT = useCallback(async () => {
        setJitApprovalInProgress(true)
        const pendingRequests = jitRequests.filter(r => r.status === 'pending')

        for (const request of pendingRequests) {
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400))
            setApprovingJIT(prev => new Set([...prev, request.id]))
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400))
            setApprovingJIT(prev => {
                const newSet = new Set(prev)
                newSet.delete(request.id)
                return newSet
            })
            setJitRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'approved', mfaConfirmed: true, auditChainId: `ac-2024-${Math.random().toString(36).substr(2, 9)}` } : r))
        }

        setJitApprovalInProgress(false)
    }, [jitRequests])

    const auditRBACConsistency = useCallback(async () => {
        setRbacAuditInProgress(true)

        for (const perm of rbacMatrix) {
            await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200))
            setAuditingRBAC(prev => new Set([...prev, perm.id]))
            await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 150))
            setAuditingRBAC(prev => {
                const newSet = new Set(prev)
                newSet.delete(perm.id)
                return newSet
            })
        }

        setRbacAuditInProgress(false)
    }, [rbacMatrix])

    return (
        <div className="access-control">
            <div className="ac-header">
                <span className="ac-breadcrumb">Access Control</span>
                <div className="ac-tabs">
                    <button
                        className={`ac-tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users & Risk
                    </button>
                    <button
                        className={`ac-tab ${activeTab === 'rbac' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rbac')}
                    >
                        RBAC Matrix
                    </button>
                    <button
                        className={`ac-tab ${activeTab === 'jit' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jit')}
                    >
                        JIT Access
                    </button>
                </div>
            </div>

            {activeTab === 'users' && (
                <div className="ac-users">
                    <div className="ac-users-header">
                        <h3>Users & Risk Assessment</h3>
                        <button className={`ac-scan-all-btn ${riskScanInProgress ? 'scanning' : ''}`}
                            onClick={scanAllRisks}
                            disabled={riskScanInProgress}
                        >
                            <span className="ac-scan-icon">{riskScanInProgress ? '⊙' : '⊙'}</span>
                            <span className="ac-scan-text">
                                {riskScanInProgress ? `Scanning (${scannedUsers.size}/${users.length})` : 'Scan All Risks'}
                            </span>
                            {riskScanInProgress && <span className="ac-scan-spinner" />}
                        </button>
                    </div>
                    <div className="ac-user-list">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className={`ac-user-row ${selectedUser?.id === user.id ? 'selected' : ''}`}
                                onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                            >
                                <div className="ac-user-name">
                                    <h4>{user.name}</h4>
                                    <p className="ac-user-email">{user.email}</p>
                                </div>

                                {/* ABAC Attribute Tags (S9.1) */}
                                <div className="ac-abac-tags">
                                    {user.abacAttributes.map((attr, idx) => (
                                        <span key={idx} className="ac-abac-tag" style={{ backgroundColor: attr.color + '20', color: attr.color, borderColor: attr.color }}>
                                            <span className="ac-abac-category">{attr.category}:</span> {attr.value}
                                        </span>
                                    ))}
                                </div>

                                <div className="ac-risk-meter">
                                    <div className="ac-risk-label">Risk</div>
                                    <div className="ac-risk-dots">
                                        {[1, 2, 3, 4, 5].map((dot) => {
                                            const isFilled = dot <= Math.ceil(user.riskScore / 20)
                                            const color = getRiskColor(user.riskScore)
                                            return (
                                                <span
                                                    key={dot}
                                                    className={`ac-risk-dot ${isFilled ? 'filled' : 'empty'}`}
                                                    data-color={color}
                                                />
                                            )
                                        })}
                                    </div>
                                    <span className="ac-risk-value">{user.riskScore}</span>
                                </div>

                                <div className="ac-role-badge" data-risk-color={getRiskColor(user.riskScore)}>
                                    {user.currentRole}
                                </div>

                                <div className="ac-user-last-active">
                                    {Math.floor((Date.now() - user.lastActive.getTime()) / 60000)}min ago
                                </div>

                                {selectedUser?.id === user.id && (
                                    <div className="ac-user-actions">
                                        <button className="ac-action-btn">🔏 Reset Password</button>
                                        <button className="ac-action-btn">⚠ Revoke Session</button>
                                        <button className="ac-action-btn" onClick={() => { setShowJITModal(true); setJitStep(0); }}>
                                            ⏱ Request JIT Access
                                        </button>
                                        <button className="ac-action-btn ac-recert-btn" onClick={() => setShowRecertModal(true)}>
                                            📋 Review Access
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'rbac' && (
                <div className="ac-rbac">
                    <div className="ac-rbac-header">
                        <h3>Role-Based Access Control Matrix</h3>
                        <p className="ac-rbac-hint">Click cells to cycle through permissions</p>
                        {rbacChanges.size > 0 && <span className="ac-unsaved-badge">⚠ {rbacChanges.size} unsaved changes</span>}
                        <div className="ac-rbac-actions">
                            <button className="ac-export-btn" onClick={() => exportMatrix('json')}>📥 Export JSON</button>
                            <button className="ac-export-btn" onClick={() => exportMatrix('csv')}>📥 Export CSV</button>
                            {rbacChanges.size > 0 && <button className="ac-diff-btn" onClick={() => setShowDiffView(!showDiffView)}>🔍 View Diff</button>}
                            <button className={`ac-audit-rbac-btn ${rbacAuditInProgress ? 'auditing' : ''}`}
                                onClick={auditRBACConsistency}
                                disabled={rbacAuditInProgress}
                            >
                                <span className="ac-audit-icon">{rbacAuditInProgress ? '⊙' : '🔍'}</span>
                                <span className="ac-audit-text">
                                    {rbacAuditInProgress ? `Auditing (${auditingRBAC.size}/${rbacMatrix.length})` : 'Audit RBAC'}
                                </span>
                                {rbacAuditInProgress && <span className="ac-audit-spinner" />}
                            </button>
                        </div>
                    </div>

                    {showDiffView && rbacChanges.size > 0 && (
                        <div className="ac-diff-view">
                            <h4>Permission Changes</h4>
                            <div className="ac-diff-list">
                                {Array.from(rbacChanges.entries()).map(([key, change]) => (
                                    <div key={key} className="ac-diff-row">
                                        <span className="ac-diff-key">{key}</span>
                                        <span className="ac-diff-old" style={{ color: '#F59E0B' }}>{change.oldPerm}</span>
                                        <span className="ac-diff-arrow">→</span>
                                        <span className="ac-diff-new" style={{ color: '#10B981' }}>{change.newPerm}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="ac-rbac-matrix">
                        <div className="ac-rbac-row ac-rbac-header-row">
                            <div className="ac-rbac-cell ac-rbac-header-cell" />
                            {roles.map((role) => (
                                <div key={role.id} className="ac-rbac-cell ac-rbac-header-cell">
                                    {role.name}
                                </div>
                            ))}
                        </div>

                        {resources.map((resource) => (
                            <div key={resource} className="ac-rbac-row">
                                <div className="ac-rbac-cell ac-rbac-resource-cell">{resource}</div>
                                {roles.map((role) => {
                                    const perm = rbacMatrix.find((p) => p.resource === resource && p.role === role.name)
                                    const permValue = perm?.permission || 'NONE'
                                    const permColor = getPermissionColor(permValue)
                                    const isChanged = perm?.changed
                                    return (
                                        <div
                                            key={`${resource}-${role.id}`}
                                            className={`ac-rbac-cell ac-rbac-perm-cell ${isChanged ? 'changed' : ''}`}
                                            data-perm-color={permColor}
                                            onClick={() => perm && cyclePermission(perm.id)}
                                        >
                                            <span
                                                className="ac-perm-text"
                                            >
                                                {permValue}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'jit' && (
                <div className="ac-jit">
                    <div className="ac-jit-header">
                        <h3>Just-in-Time Access Requests</h3>
                        <button className="ac-jit-new-btn" onClick={() => { setShowJITModal(true); setJitStep(0); }}>
                            + New Request
                        </button>
                        <button className={`ac-approve-all-btn ${jitApprovalInProgress ? 'approving' : ''}`}
                            onClick={approveAllJIT}
                            disabled={jitApprovalInProgress || jitRequests.filter(r => r.status === 'pending').length === 0}
                        >
                            <span className="ac-approve-icon">{jitApprovalInProgress ? '⊙' : '✓'}</span>
                            <span className="ac-approve-text">
                                {jitApprovalInProgress ? `Approving (${approvingJIT.size}/${jitRequests.filter(r => r.status === 'pending').length})` : 'Approve All'}
                            </span>
                            {jitApprovalInProgress && <span className="ac-approve-spinner" />}
                        </button>
                    </div>

                    <div className="ac-jit-requests" role="list">
                        {jitRequests.map((req) => {
                            const user = users.find((u) => u.id === req.userId)
                            return (
                                <div key={req.id} className={`ac-jit-card ac-jit-${req.status}`} role="listitem">
                                    <div className="ac-jit-status">
                                        {req.status === 'pending' ? '⏳' : req.status === 'approved' ? '✓' : req.status === 'active' ? '▶' : req.status === 'expired' ? '⏹' : '✗'}
                                    </div>
                                    <div className="ac-jit-content">
                                        <h4>{user?.name}</h4>
                                        <p className="ac-jit-role">Role: {req.requestedRole}</p>
                                        <p className="ac-jit-reason">{req.reason}</p>
                                        <p className="ac-jit-duration">Duration: {req.duration}h</p>

                                        {/* Auto-revoke Timer (S9.3) */}
                                        {req.autoRevokeAt && (
                                            <div className="ac-jit-auto-revoke">
                                                ⏱ Auto-revoke in: <strong>{formatRevokeTime(req.autoRevokeAt)}</strong>
                                            </div>
                                        )}

                                        {/* MFA Confirmation Status (S9.3) */}
                                        {req.mfaConfirmed && (
                                            <div className="ac-jit-mfa-badge">🔒 MFA Confirmed</div>
                                        )}

                                        {/* Audit Chain Reference (S9.3) */}
                                        {req.auditChainId && (
                                            <div className="ac-jit-audit-chain">
                                                Audit: <code>{req.auditChainId}</code>
                                            </div>
                                        )}
                                    </div>

                                    {/* Approvers List */}
                                    {req.approvers && req.approvers.length > 0 && (
                                        <div className="ac-jit-approvers">
                                            <span className="ac-label">Approvers:</span>
                                            <span>{req.approvers.join(', ')}</span>
                                        </div>
                                    )}

                                    {req.status === 'pending' && (
                                        <div className="ac-jit-actions">
                                            <button className="ac-jit-approve">✓ Approve</button>
                                            <button className="ac-jit-deny">✗ Deny</button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {showJITModal && (
                <div className="ac-modal-overlay" onClick={() => setShowJITModal(false)}>
                    <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ac-modal-header">
                            <h2>JIT Access Request</h2>
                            <button className="ac-modal-close" onClick={() => setShowJITModal(false)}>
                                ✕
                            </button>
                        </div>

                        <div className="ac-modal-progress" role="progressbar" aria-valuenow={jitStep} aria-valuemin={0} aria-valuemax={4} aria-label={`Step ${jitStep + 1} of 5: ${['User', 'Role', 'Reason', 'MFA', 'Confirm'][jitStep]}`}>
                            {['User', 'Role', 'Reason', 'MFA', 'Confirm'].map((step, i) => (
                                <div
                                    key={step}
                                    className={`ac-progress-step ${i < jitStep ? 'done' : i === jitStep ? 'current' : ''}`}
                                    aria-current={i === jitStep ? 'step' : undefined}
                                >
                                    {i < jitStep ? '✓' : i + 1}
                                </div>
                            ))}
                        </div>

                        <div className="ac-modal-content">
                            {jitStep === 0 && (
                                <div className="ac-step-section">
                                    <label>Select User</label>
                                    <div className="ac-user-options">
                                        {users.map((user) => (
                                            <button key={user.id} className="ac-user-option">
                                                {user.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {jitStep === 1 && (
                                <div className="ac-step-section">
                                    <label>Select Role</label>
                                    <div className="ac-role-options">
                                        {roles.map((role) => (
                                            <button key={role.id} className="ac-role-option">
                                                {role.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {jitStep === 2 && (
                                <div className="ac-step-section">
                                    <label>Reason for Access</label>
                                    <textarea className="ac-reason-input" placeholder="Describe the reason..." />
                                    <label htmlFor="jit-duration">Duration (hours)</label>
                                    <div className="ac-duration-selector">
                                        <input id="jit-duration" type="number" className="ac-duration-input" defaultValue="4" min="1" max="24" />
                                        <small className="ac-duration-hint">⏱ Auto-revoke timer will be set</small>
                                    </div>
                                </div>
                            )}

                            {jitStep === 3 && (
                                <div className="ac-step-section">
                                    <h3>Multi-Factor Authentication</h3>
                                    <div className="ac-mfa-methods">
                                        <div className="ac-mfa-method">
                                            <input type="radio" id="mfa-totp" name="mfa" defaultChecked />
                                            <label htmlFor="mfa-totp">📱 TOTP (Google Authenticator)</label>
                                        </div>
                                        <div className="ac-mfa-method">
                                            <input type="radio" id="mfa-push" name="mfa" />
                                            <label htmlFor="mfa-push">📲 Push Notification</label>
                                        </div>
                                        <div className="ac-mfa-method">
                                            <input type="radio" id="mfa-hardware" name="mfa" />
                                            <label htmlFor="mfa-hardware">🔐 Hardware Token</label>
                                        </div>
                                    </div>
                                    <input type="text" className="ac-mfa-input" placeholder="Enter verification code..." maxLength={6} />
                                </div>
                            )}

                            {jitStep === 4 && (
                                <div className="ac-step-section">
                                    <h3>Request Summary</h3>
                                    <p className="ac-confirm-text">Review your request and it will be sent for approval</p>
                                    <div className="ac-confirm-details">
                                        <div className="ac-confirm-row">
                                            <span>User:</span> <strong>m.chen</strong>
                                        </div>
                                        <div className="ac-confirm-row">
                                            <span>Role:</span> <strong>AUDITOR</strong>
                                        </div>
                                        <div className="ac-confirm-row">
                                            <span>Duration:</span> <strong>4 hours</strong>
                                        </div>
                                        <div className="ac-confirm-row">
                                            <span>Auto-Revoke:</span> <strong>Yes (immutable)</strong>
                                        </div>
                                        <div className="ac-approval-routing">
                                            <h4>Approval Routing</h4>
                                            <ul>
                                                <li>👤 Security Lead (required)</li>
                                                <li>👤 Compliance Officer (required)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="ac-modal-actions">
                            {jitStep > 0 && (
                                <button className="ac-btn secondary" onClick={() => setJitStep(jitStep - 1)}>
                                    Back
                                </button>
                            )}
                            {jitStep < 4 && (
                                <button className="ac-btn primary" onClick={() => setJitStep(jitStep + 1)}>
                                    Next
                                </button>
                            )}
                            {jitStep === 4 && (
                                <button className="ac-btn primary" onClick={() => { setShowJITModal(false); setShowMFAPrompt(true); }}>
                                    Submit for Approval
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Quarterly Recertification Modal (S9.1) */}
            {showRecertModal && selectedUser && (
                <div className="ac-modal-overlay" onClick={() => setShowRecertModal(false)}>
                    <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ac-modal-header">
                            <h2>Quarterly Access Recertification — {selectedUser.name}</h2>
                            <button className="ac-modal-close" onClick={() => setShowRecertModal(false)}>✕</button>
                        </div>
                        <div className="ac-modal-content">
                            <div className="ac-recert-section">
                                <h3>Risk Derivation</h3>
                                <div className="ac-risk-breakdown">
                                    <div className="ac-risk-item">
                                        <span>Anomalies Detected:</span> <strong>{selectedUser.riskBreakdown.anomalies}</strong>
                                    </div>
                                    <div className="ac-risk-item">
                                        <span>Failed Authentications:</span> <strong>{selectedUser.riskBreakdown.failedAuths}</strong>
                                    </div>
                                    <div className="ac-risk-item">
                                        <span>Policy Violations:</span> <strong>{selectedUser.riskBreakdown.policyViolations}</strong>
                                    </div>
                                    <div className="ac-risk-total">
                                        <span>Total Risk Score:</span> <strong style={{ color: getRiskColor(selectedUser.riskScore) }}>{selectedUser.riskScore}/100</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="ac-recert-section">
                                <h3>Current Permissions</h3>
                                <div className="ac-perm-list">
                                    {rbacMatrix.filter(p => p.role === selectedUser.currentRole).map(p => (
                                        <div key={p.id} className="ac-perm-item">
                                            <span>{p.resource}</span> <span className="ac-badge" style={{ background: getPermissionColor(p.permission) }}>{p.permission}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="ac-recert-section">
                                <h3>Certification Decision</h3>
                                <div className="ac-recert-options">
                                    <label><input type="radio" name="recert" /> ✓ Approve — Permissions remain unchanged</label>
                                    <label><input type="radio" name="recert" /> 🔄 Modify — Request access review</label>
                                    <label><input type="radio" name="recert" /> ✗ Revoke — Remove all access</label>
                                </div>
                            </div>
                        </div>
                        <div className="ac-modal-actions">
                            <button className="ac-btn" onClick={() => setShowRecertModal(false)}>Cancel</button>
                            <button className="ac-btn primary">Submit Certification</button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            <Modal isOpen={!!selectedUser && !showJITModal} onClose={() => setSelectedUser(null)} title={selectedUser?.name || 'User Details'}>
                {selectedUser && (
                    <div className="space-y-4">
                        <Collapse title="User Information" defaultOpen>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="font-semibold">Name:</span><code>{selectedUser.name}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Email:</span><code>{selectedUser.email}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Current Role:</span><code>{selectedUser.currentRole}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Last Active:</span><code>{selectedUser.lastActive.toLocaleString()}</code></div>
                            </div>
                        </Collapse>
                        <Collapse title="Risk Assessment">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center"><span className="font-semibold">Risk Score:</span><Badge severity={selectedUser.riskScore >= 40 ? 'critical' : selectedUser.riskScore >= 25 ? 'high' : selectedUser.riskScore >= 15 ? 'medium' : 'success'}>{selectedUser.riskScore}/100</Badge></div>
                            </div>
                        </Collapse>
                        <div className="flex gap-2 mt-4">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">🔏 Reset Password</button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">⚠ Revoke Session</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Permission Details Modal */}
            <Modal isOpen={!!selectedPermission} onClose={() => setSelectedPermission(null)} title="Permission Details">
                {selectedPermission && (
                    <div className="space-y-4">
                        <Collapse title="Permission Mapping" defaultOpen>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="font-semibold">Resource:</span><code>{selectedPermission.resource}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Role:</span><code>{selectedPermission.role}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Permission:</span><Badge severity={selectedPermission.permission === 'ADMIN' ? 'critical' : selectedPermission.permission === 'WRITE' ? 'high' : selectedPermission.permission === 'READ' ? 'success' : 'info'}>{selectedPermission.permission}</Badge></div>
                            </div>
                        </Collapse>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default AccessControl
