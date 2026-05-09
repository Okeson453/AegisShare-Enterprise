import React, { useState, useCallback } from 'react'
import { Card, Badge, Modal, Collapse } from '@/components/ui'
import useUiStore from '@/store/useUiStore'
import '../../styles/configuration.css'

interface ComplianceProfile {
    id: string
    name: string
    description: string
    standards: string[]
    settingsCount: number
}

interface ConfigDiff {
    key: string
    current: string
    proposed: string
    category: string
}

interface ConfigChange {
    id: string
    setting: string
    oldValue: string
    newValue: string
    timestamp: Date
    approved: boolean
}

const Configuration: React.FC = () => {
    const { activeTab, setActiveTab } = useUiStore()
    const [selectedProfile, setSelectedProfile] = useState<ComplianceProfile | null>(null)
    const [showDiffPane, setShowDiffPane] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [diffs, setDiffs] = useState<ConfigDiff[]>([
        { key: 'encryption.algorithm', current: 'AES-256-GCM', proposed: 'AES-256-GCM', category: 'Encryption' },
        { key: 'tls.version', current: '1.2', proposed: '1.3', category: 'Network' },
        { key: 'audit.retention', current: '90 days', proposed: '180 days', category: 'Compliance' },
        { key: 'mfa.required', current: 'true', proposed: 'true', category: 'Auth' },
        { key: 'session.timeout', current: '30 min', proposed: '15 min', category: 'Auth' },
        { key: 'password.complexity', current: 'HIGH', proposed: 'CRITICAL', category: 'Auth' },
    ])

    // S10 State Variables
    const [applyingProfiles, setApplyingProfiles] = useState<Set<string>>(new Set())
    const [appliedProfiles, setAppliedProfiles] = useState<Set<string>>(new Set())
    const [profileApplyInProgress, setProfileApplyInProgress] = useState(false)
    const [verifyingConfig, setVerifyingConfig] = useState<Set<string>>(new Set())
    const [configConsistencyInProgress, setConfigConsistencyInProgress] = useState(false)
    const [deployingChanges, setDeployingChanges] = useState<Set<string>>(new Set())
    const [changeDeployInProgress, setChangeDeployInProgress] = useState(false)

    const complianceProfiles: ComplianceProfile[] = [
        { id: 'soc2', name: 'SOC 2', description: 'Service Organization Control 2', standards: ['Confidentiality', 'Integrity', 'Availability', 'Processing Integrity'], settingsCount: 24 },
        { id: 'hipaa', name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act', standards: ['E2E Encryption', 'Audit Logging', 'Access Controls'], settingsCount: 18 },
        { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation', standards: ['Data Minimization', 'Consent', 'Right to Erasure'], settingsCount: 22 },
        { id: 'pci', name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard', standards: ['Encryption', 'Tokenization', 'Monitoring'], settingsCount: 20 },
    ]

    const configChanges: ConfigChange[] = [
        { id: 'c1', setting: 'audit.retention', oldValue: '90 days', newValue: '180 days', timestamp: new Date(Date.now() - 86400000), approved: true },
        { id: 'c2', setting: 'tls.version', oldValue: '1.2', newValue: '1.3', timestamp: new Date(Date.now() - 172800000), approved: true },
        { id: 'c3', setting: 'mfa.algorithm', oldValue: 'TOTP', newValue: 'FIDO2', timestamp: new Date(Date.now() - 259200000), approved: false },
    ]

    const applyProfile = (profile: ComplianceProfile) => {
        setSelectedProfile(profile)
        setShowDiffPane(true)
        setHasUnsavedChanges(true)
    }

    const approveChange = (diffKey: string) => {
        setDiffs(
            diffs.map((d) => {
                if (d.key === diffKey) {
                    return { ...d, current: d.proposed }
                }
                return d
            })
        )
    }

    const discardChanges = () => {
        setShowDiffPane(false)
        setSelectedProfile(null)
        setHasUnsavedChanges(false)
    }

    const saveAllChanges = () => {
        setHasUnsavedChanges(false)
        setShowDiffPane(false)
    }

    // S10 Core Functions
    const applyAllProfiles = useCallback(async () => {
        setProfileApplyInProgress(true)
        const profileIds = complianceProfiles.map(p => p.id)
        
        for (const profileId of profileIds) {
            await new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 300))
            setApplyingProfiles(prev => new Set([...prev, profileId]))
            await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200))
            setApplyingProfiles(prev => {
                const newSet = new Set(prev)
                newSet.delete(profileId)
                return newSet
            })
            setAppliedProfiles(prev => new Set([...prev, profileId]))
        }
        
        setProfileApplyInProgress(false)
    }, [complianceProfiles])

    const verifyConfigConsistency = useCallback(async () => {
        setConfigConsistencyInProgress(true)
        
        for (const diff of diffs) {
            await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 250))
            setVerifyingConfig(prev => new Set([...prev, diff.key]))
            await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 150))
            setVerifyingConfig(prev => {
                const newSet = new Set(prev)
                newSet.delete(diff.key)
                return newSet
            })
        }
        
        setConfigConsistencyInProgress(false)
    }, [diffs])

    const deployAllChanges = useCallback(async () => {
        setChangeDeployInProgress(true)
        const changedDiffs = diffs.filter(d => d.current !== d.proposed)
        
        for (const diff of changedDiffs) {
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 350))
            setDeployingChanges(prev => new Set([...prev, diff.key]))
            await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300))
            setDeployingChanges(prev => {
                const newSet = new Set(prev)
                newSet.delete(diff.key)
                return newSet
            })
        }
        
        setChangeDeployInProgress(false)
    }, [diffs])

    return (
        <div className="configuration">
            <div className="cfg-header">
                <span className="cfg-breadcrumb">Configuration</span>
                <div className="cfg-tabs">
                    <button
                        className={`cfg-tab ${activeTab === 'profiles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profiles')}
                    >
                        Compliance Profiles
                    </button>
                    <button
                        className={`cfg-tab ${activeTab === 'diff' ? 'active' : ''}`}
                        onClick={() => setActiveTab('diff')}
                    >
                        Config Diff
                    </button>
                    <button
                        className={`cfg-tab ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Change History
                    </button>
                </div>
            </div>

            {activeTab === 'profiles' && (
                <div className="cfg-profiles">
                    <div className="cfg-profiles-header">
                        <h3>Compliance Presets</h3>
                        <p className="cfg-profiles-subtitle">Apply industry-standard configurations</p>
                        <button className={`cfg-apply-all-btn ${profileApplyInProgress ? 'applying' : ''}`}
                            onClick={applyAllProfiles}
                            disabled={profileApplyInProgress}
                        >
                            <span className="cfg-apply-icon">{profileApplyInProgress ? '⊙' : '▶'}</span>
                            <span className="cfg-apply-text">
                                {profileApplyInProgress ? `Applying (${appliedProfiles.size}/${complianceProfiles.length})` : 'Apply All'}
                            </span>
                            {profileApplyInProgress && <span className="cfg-apply-spinner" />}
                        </button>
                    </div>

                    <div className="cfg-profile-grid">
                        {complianceProfiles.map((profile) => (
                            <div
                                key={profile.id}
                                className={`cfg-profile-card ${selectedProfile?.id === profile.id ? 'selected' : ''}`}
                                onClick={() => applyProfile(profile)}
                            >
                                <div className="cfg-profile-icon">{profile.name[0]}</div>
                                <div className="cfg-profile-content">
                                    <h4>{profile.name}</h4>
                                    <p className="cfg-profile-desc">{profile.description}</p>
                                    <div className="cfg-profile-standards">
                                        {profile.standards.map((std, i) => (
                                            <span key={i} className="cfg-standard-tag">
                                                {std}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="cfg-settings-count">{profile.settingsCount} settings</p>
                                </div>
                                {selectedProfile?.id === profile.id && <div className="cfg-profile-check">✓</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'diff' && (
                <div className="cfg-diff">
                    <div className="cfg-diff-header">
                        <h3>Configuration Diff</h3>
                        <p className="cfg-diff-subtitle">Current ← → Proposed Changes</p>
                        <button className={`cfg-verify-btn ${configConsistencyInProgress ? 'verifying' : ''}`}
                            onClick={verifyConfigConsistency}
                            disabled={configConsistencyInProgress}
                        >
                            <span className="cfg-verify-icon">{configConsistencyInProgress ? '⊙' : '✓'}</span>
                            <span className="cfg-verify-text">
                                {configConsistencyInProgress ? `Verifying (${diffs.length - verifyingConfig.size}/${diffs.length})` : 'Verify Consistency'}
                            </span>
                            {configConsistencyInProgress && <span className="cfg-verify-spinner" />}
                        </button>
                    </div>

                    <div className="cfg-diff-pane">
                        <div className="cfg-diff-column cfg-diff-current">
                            <div className="cfg-diff-col-header">Current Configuration</div>
                            <div className="cfg-diff-items">
                                {diffs.map((diff) => (
                                    <div key={`curr-${diff.key}`} className="cfg-diff-item">
                                        <p className="cfg-diff-key">{diff.key}</p>
                                        <code className="cfg-diff-value">{diff.current}</code>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cfg-diff-column cfg-diff-proposed">
                            <div className="cfg-diff-col-header">Proposed Changes</div>
                            <div className="cfg-diff-items">
                                {diffs.map((diff) => {
                                    const changed = diff.current !== diff.proposed
                                    return (
                                        <div key={`prop-${diff.key}`} className={`cfg-diff-item ${changed ? 'changed' : ''}`}>
                                            <p className="cfg-diff-key">
                                                {diff.key}
                                                {changed && <span className="cfg-change-indicator">● Changed</span>}
                                            </p>
                                            <code className="cfg-diff-value">{diff.proposed}</code>
                                            {changed && (
                                                <button className="cfg-approve-btn" onClick={() => approveChange(diff.key)}>
                                                    ✓ Approve
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="cfg-diff-actions">
                        <button className="cfg-action-btn secondary" onClick={discardChanges}>
                            ✕ Discard
                        </button>
                        <button className="cfg-action-btn primary" onClick={saveAllChanges}>
                            ✓ Approve & Deploy
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="cfg-history">
                    <div className="cfg-history-header">
                        <h3>Configuration Change History</h3>
                        <p className="cfg-history-subtitle">All applied configuration changes</p>
                        <button className={`cfg-deploy-all-btn ${changeDeployInProgress ? 'deploying' : ''}`}
                            onClick={deployAllChanges}
                            disabled={changeDeployInProgress || diffs.filter(d => d.current !== d.proposed).length === 0}
                        >
                            <span className="cfg-deploy-icon">{changeDeployInProgress ? '⊙' : '⬆'}</span>
                            <span className="cfg-deploy-text">
                                {changeDeployInProgress ? `Deploying (${deployingChanges.size}/${diffs.filter(d => d.current !== d.proposed).length})` : 'Deploy All'}
                            </span>
                            {changeDeployInProgress && <span className="cfg-deploy-spinner" />}
                        </button>
                    </div>

                    <div className="cfg-change-list">
                        {configChanges.map((change) => (
                            <div key={change.id} className={`cfg-change-item ${change.approved ? 'approved' : 'pending'}`}>
                                <div className="cfg-change-status">
                                    {change.approved ? '✓' : '⏳'}
                                </div>
                                <div className="cfg-change-content">
                                    <h4>{change.setting}</h4>
                                    <p className="cfg-change-details">
                                        <code>{change.oldValue}</code>
                                        <span className="cfg-arrow">→</span>
                                        <code>{change.newValue}</code>
                                    </p>
                                    <p className="cfg-change-time">
                                        {Math.floor((Date.now() - change.timestamp.getTime()) / (1000 * 60))}m ago
                                    </p>
                                </div>
                                <span className={`cfg-badge ${change.approved ? 'deployed' : 'pending-approval'}`}>
                                    {change.approved ? 'Deployed' : 'Pending Approval'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {hasUnsavedChanges && (
                <div className="cfg-unsaved-banner">
                    <div className="cfg-banner-content">
                        <span className="cfg-banner-icon">⚠</span>
                        <span className="cfg-banner-text">You have unsaved changes</span>
                    </div>
                    <div className="cfg-banner-actions">
                        <button className="cfg-banner-save" onClick={saveAllChanges}>
                            💾 Save All
                        </button>
                        <button className="cfg-banner-discard" onClick={discardChanges}>
                            ✕ Discard
                        </button>
                    </div>
                </div>
            )}

            {/* Compliance Profile Modal */}
            <Modal isOpen={!!selectedProfile} onClose={() => setSelectedProfile(null)} title={selectedProfile?.name || 'Profile Details'}>
                {selectedProfile && (
                    <div className="space-y-4">
                        <Collapse title="Profile Information" defaultOpen>
                            <div className="space-y-2">
                                <p className="text-sm">{selectedProfile.description}</p>
                                <div className="mt-2"><span className="font-semibold">Settings:</span><code>{selectedProfile.settingsCount}</code></div>
                            </div>
                        </Collapse>
                        <Collapse title="Standards & Controls">
                            <div className="space-y-1">
                                {selectedProfile.standards.map(std => (
                                    <div key={std} className="text-sm">✓ {std}</div>
                                ))}
                            </div>
                        </Collapse>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Configuration
