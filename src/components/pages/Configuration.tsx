import React, { useState, useEffect } from 'react'

/* S10 Config Types */
interface ConfigPreset {
    id: string
    name: string
    description: string
}

interface ComplianceProfile {
    id: string
    name: string
    framework: 'FIPS' | 'FedRAMP' | 'HIPAA' | 'PCI-DSS'
    description: string
    color: string
    impactChanges: ConfigChange[]
}

interface ConfigChange {
    setting: string
    current: string
    proposed: string
    isBreaking: boolean
}

interface ConfigSetting {
    key: string
    value: string
    type: 'string' | 'number' | 'boolean'
    original?: string
}

interface ConfigurationProps {
    presets?: ConfigPreset[]
    currentSettings?: ConfigSetting[]
}

const complianceProfiles: ComplianceProfile[] = [
    {
        id: 'fips',
        name: 'FIPS 140-2',
        framework: 'FIPS',
        description: 'Federal Information Processing Standards',
        color: '#FF6B6B',
        impactChanges: [
            { setting: 'crypto.algorithm', current: 'AES-256-GCM', proposed: 'AES-256-GCM (FIPS-validated)', isBreaking: false },
            { setting: 'hsm.required', current: 'false', proposed: 'true', isBreaking: true },
            { setting: 'tls.version', current: '1.2+', proposed: '1.2+ (FIPS mode)', isBreaking: false },
        ],
    },
    {
        id: 'fedramp',
        name: 'FedRAMP',
        framework: 'FedRAMP',
        description: 'Federal Risk and Authorization Management',
        color: '#4ECDC4',
        impactChanges: [
            { setting: 'audit.logging', current: 'true', proposed: 'true (enhanced)', isBreaking: false },
            { setting: 'access.logging', current: 'false', proposed: 'true', isBreaking: true },
            { setting: 'data.encryption_transit', current: 'true', proposed: 'true (mandatory)', isBreaking: false },
        ],
    },
    {
        id: 'hipaa',
        name: 'HIPAA',
        framework: 'HIPAA',
        description: 'Health Insurance Portability & Accountability Act',
        color: '#95E1D3',
        impactChanges: [
            { setting: 'phi.encryption', current: 'true', proposed: 'true (enforced)', isBreaking: false },
            { setting: 'access.mfa', current: 'false', proposed: 'true', isBreaking: true },
            { setting: 'audit.retention_days', current: '90', proposed: '365', isBreaking: false },
        ],
    },
    {
        id: 'pci-dss',
        name: 'PCI-DSS',
        framework: 'PCI-DSS',
        description: 'Payment Card Industry Data Security Standard',
        color: '#FFE66D',
        impactChanges: [
            { setting: 'crypto.min_key_length', current: '2048', proposed: '2048', isBreaking: false },
            { setting: 'password.min_length', current: '8', proposed: '12', isBreaking: false },
            { setting: 'session.timeout', current: '1800', proposed: '900', isBreaking: true },
        ],
    },
]

const Configuration: React.FC<ConfigurationProps> = ({
    presets = [
        { id: '1', name: 'Production', description: 'High security, optimized performance' },
        { id: '2', name: 'Development', description: 'Loose constraints, detailed logging' },
        { id: '3', name: 'Testing', description: 'Sandbox mode with mocks' },
    ],
    currentSettings = [
        { key: 'auth.mfa_required', value: 'true', type: 'boolean', original: 'true' },
        { key: 'crypto.algorithm', value: 'AES-256-GCM', type: 'string', original: 'AES-256-GCM' },
        { key: 'log_level', value: '2', type: 'number', original: '3' },
        { key: 'session_timeout', value: '3600', type: 'number', original: '1800' },
    ],
}) => {
    const [activePreset, setActivePreset] = useState(presets[0]?.id)
    const [selectedProfile, setSelectedProfile] = useState<ComplianceProfile | null>(null)
    const [settings, setSettings] = useState(currentSettings)
    const [hasChanges, setHasChanges] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [showApprovalFlow, setShowApprovalFlow] = useState(false)
    const [autoDiscardTimer, setAutoDiscardTimer] = useState<number>(1800) // 30 minutes

    /* S10.3 — Auto-discard timer countdown */
    useEffect(() => {
        if (!hasChanges) return
        const interval = setInterval(() => {
            setAutoDiscardTimer((t) => {
                if (t <= 1) {
                    discardChanges()
                    return 1800
                }
                return t - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [hasChanges])

    const updateSetting = (key: string, value: string) => {
        setSettings(settings.map((s) => (s.key === key ? { ...s, value } : s)))
        setHasChanges(true)
        setAutoDiscardTimer(1800) // Reset timer
    }

    const savChanges = () => {
        setShowApprovalFlow(true)
    }

    const discardChanges = () => {
        setSettings(settings.map((s) => ({ ...s, value: s.original || s.value })))
        setHasChanges(false)
        setAutoDiscardTimer(1800)
    }

    const getChangedSettings = () => {
        return settings.filter((s) => s.value !== s.original)
    }

    const getBreakingChanges = () => {
        if (!selectedProfile) return []
        return selectedProfile.impactChanges.filter((change) => change.isBreaking)
    }

    const applyChanges = () => {
        setHasChanges(false)
        setSettings(settings.map((s) => ({ ...s, original: s.value })))
        setShowApprovalFlow(false)
        setAutoDiscardTimer(1800)
    }

    const loadPreset = (presetId: string) => {
        setActivePreset(presetId)
    }

    const selectComplianceProfile = (profile: ComplianceProfile) => {
        setSelectedProfile(profile)
        setShowPreview(true)
    }

    return (
        <div className="configuration">
            {/* S10.3 — Floating Unsaved Changes Banner */}
            {hasChanges && (
                <div className="cfg-unsaved-banner cfg-unsaved-floating">
                    <div className="cfg-banner-content">
                        <div className="cfg-banner-icon">⚡</div>
                        <div className="cfg-banner-text">
                            <div className="cfg-banner-title">{getChangedSettings().length} unsaved change(s)</div>
                            <div className="cfg-banner-timer">Auto-discard in {Math.floor(autoDiscardTimer / 60)}m {autoDiscardTimer % 60}s</div>
                        </div>
                    </div>
                    <div className="cfg-banner-actions">
                        <button className="cfg-banner-btn cfg-banner-save-btn" onClick={savChanges} title="Save changes">
                            ✓ Save & Apply
                        </button>
                        <button
                            className="cfg-banner-btn cfg-banner-discard-btn"
                            onClick={discardChanges}
                            title="Discard changes"
                        >
                            ✕ Discard
                        </button>
                    </div>
                </div>
            )}

            {/* S10.1 — Compliance Profile Preset Cards */}
            <div className="cfg-compliance-section">
                <div className="cfg-section-header">
                    <h2>Compliance Profiles</h2>
                    <p className="cfg-section-desc">Select a framework to apply compliance-specific settings</p>
                </div>
                <div className="cfg-profile-grid">
                    {complianceProfiles.map((profile) => (
                        <div
                            key={profile.id}
                            className={`cfg-profile-card cfg-profile-${profile.id} ${selectedProfile?.id === profile.id ? 'active' : ''}`}
                            onClick={() => selectComplianceProfile(profile)}
                        >
                            <div className="cfg-profile-header">
                                <div className={`cfg-profile-badge cfg-badge-${profile.framework.toLowerCase().replace(/-/g, '')}`}>
                                    {profile.framework}
                                </div>
                                <div className="cfg-profile-title">{profile.name}</div>
                            </div>
                            <div className="cfg-profile-desc">{profile.description}</div>
                            <div className="cfg-profile-impact">
                                <span className="cfg-impact-label">Changes: {profile.impactChanges.length}</span>
                                <span className={`cfg-impact-breaking ${getBreakingChanges().length > 0 ? 'has-breaking' : ''}`}>
                                    {profile.impactChanges.filter((c) => c.isBreaking).length} breaking
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* S10.1 — Impact Preview Modal/Panel */}
            {showPreview && selectedProfile && (
                <div className="cfg-preview-overlay">
                    <div className="cfg-preview-modal">
                        <div className="cfg-preview-header">
                            <div>
                                <h3>Preview Changes: {selectedProfile.name}</h3>
                                <p className="cfg-preview-desc">{selectedProfile.description}</p>
                            </div>
                            <button className="cfg-preview-close" onClick={() => setShowPreview(false)}>
                                ✕
                            </button>
                        </div>

                        <div className="cfg-preview-content">
                            {/* S10.2 — 3-Column Diff Pane */}
                            <div className="cfg-diff-table">
                                <div className="cfg-diff-header-row">
                                    <div className="cfg-diff-col cfg-diff-setting">Setting</div>
                                    <div className="cfg-diff-col cfg-diff-current">Current</div>
                                    <div className="cfg-diff-col cfg-diff-proposed">Proposed</div>
                                </div>
                                {selectedProfile.impactChanges.map((change, idx) => (
                                    <div
                                        key={idx}
                                        className={`cfg-diff-row ${change.isBreaking ? 'cfg-breaking' : 'cfg-improved'}`}
                                    >
                                        <div className="cfg-diff-col cfg-diff-setting">{change.setting}</div>
                                        <div className="cfg-diff-col cfg-diff-current">
                                            <span className="cfg-diff-value">{change.current}</span>
                                        </div>
                                        <div className="cfg-diff-col cfg-diff-proposed">
                                            <span className="cfg-diff-value">{change.proposed}</span>
                                            {change.isBreaking && <span className="cfg-breaking-badge">⚠️ Breaking</span>}
                                            {!change.isBreaking && <span className="cfg-improved-badge">✓ Improved</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Breaking Changes Warning */}
                            {getBreakingChanges().length > 0 && (
                                <div className="cfg-breaking-warning">
                                    <div className="cfg-warning-icon">⚠</div>
                                    <div className="cfg-warning-content">
                                        <div className="cfg-warning-title">
                                            {getBreakingChanges().length} breaking change(s) require 2-person approval
                                        </div>
                                        <div className="cfg-warning-desc">
                                            These changes may impact service availability and require sign-off from another administrator
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="cfg-preview-actions">
                            <button className="cfg-btn cfg-btn-secondary" onClick={() => setShowPreview(false)}>
                                Close
                            </button>
                            <button className="cfg-btn cfg-btn-primary" onClick={() => setShowPreview(false)}>
                                Apply Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* S10.3 — Approval Flow Modal */}
            {showApprovalFlow && (
                <div className="cfg-approval-overlay">
                    <div className="cfg-approval-modal">
                        <div className="cfg-approval-header">
                            <h3>Save & Apply Changes</h3>
                            <button className="cfg-approval-close" onClick={() => setShowApprovalFlow(false)}>
                                ✕
                            </button>
                        </div>

                        <div className="cfg-approval-content">
                            <div className="cfg-approval-summary">
                                <div className="cfg-summary-stat">
                                    <div className="cfg-stat-value">{getChangedSettings().length}</div>
                                    <div className="cfg-stat-label">Total Changes</div>
                                </div>
                                <div className="cfg-summary-stat">
                                    <div className="cfg-stat-value cfg-stat-breaking">
                                        {getChangedSettings().filter((s) => s.value !== s.original).length}
                                    </div>
                                    <div className="cfg-stat-label">Modified</div>
                                </div>
                                <div className="cfg-summary-stat">
                                    <div className="cfg-stat-value cfg-stat-impact">!</div>
                                    <div className="cfg-stat-label">Impact Analysis</div>
                                </div>
                            </div>

                            <div className="cfg-approval-checklist">
                                <div className="cfg-check-item">
                                    <input type="checkbox" id="review1" defaultChecked className="cfg-check" title="Acknowledge review" />
                                    <label htmlFor="review1">
                                        I have reviewed and approved these changes
                                    </label>
                                </div>
                                <div className="cfg-check-item">
                                    <input type="checkbox" id="review2" className="cfg-check" title="Acknowledge impact" />
                                    <label htmlFor="review2">
                                        I understand the potential impact on running services
                                    </label>
                                </div>
                            </div>

                            <div className="cfg-approval-notice">
                                <strong>Note:</strong> Changes will be logged in the audit chain and require verification from another administrator (2-person rule).
                            </div>
                        </div>

                        <div className="cfg-approval-actions">
                            <button
                                className="cfg-btn cfg-btn-secondary"
                                onClick={() => setShowApprovalFlow(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="cfg-btn cfg-btn-primary"
                                onClick={applyChanges}
                            >
                                Apply & Request Approval
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Regular Practice Presets */}
            <div className="cfg-presets-section">
                <div className="cfg-section-header">
                    <h2>Configuration Presets</h2>
                    <p className="cfg-section-desc">Quick-start configurations for common scenarios</p>
                </div>
                <div className="cfg-preset-grid">
                    {presets.map((preset) => (
                        <div
                            key={preset.id}
                            className={`cfg-preset-card ${activePreset === preset.id ? 'active' : ''}`}
                            onClick={() => loadPreset(preset.id)}
                        >
                            <div className="cfg-preset-title">{preset.name}</div>
                            <div className="cfg-preset-desc">{preset.description}</div>
                            <button className="cfg-preset-btn">Load</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Table */}
            <div className="cfg-settings-section">
                <div className="cfg-section-header">
                    <h2>Configuration Settings</h2>
                    <p className="cfg-section-desc">Edit individual settings or use profiles above</p>
                </div>
                <div className="cfg-settings-table">
                    {settings.map((setting) => (
                        <div key={setting.key} className="cfg-settings-row">
                            <div className="cfg-settings-key">{setting.key}</div>
                            <input
                                type="text"
                                className="cfg-settings-value"
                                value={setting.value}
                                onChange={(e) => updateSetting(setting.key, e.target.value)}
                                placeholder={`Enter value for ${setting.key}`}
                                title={`Edit ${setting.key}`}
                                aria-label={`Value for ${setting.key}`}
                            />
                            <div className="cfg-settings-type">
                                {setting.type.charAt(0).toUpperCase() + setting.type.slice(1)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Configuration
