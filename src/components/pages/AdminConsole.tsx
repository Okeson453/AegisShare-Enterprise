import React, { useState, useMemo, useEffect } from 'react'
import '../../styles/admin-console.css'
import '../../styles/access-control-extension.css'

interface ServiceNode {
    id: string
    name: string
    status: 'healthy' | 'warning' | 'critical' | 'degraded'
    latency: number
    errorRate: number
    uptime: number
    slo: number
    downstreamServices: string[]
}

interface SLAMetric {
    name: string
    value: number
    target: number
    burnRate: number // % of budget used
}

interface SecurityDimension {
    category: string
    score: number
    trend: 'up' | 'down' | 'stable'
    metadata?: string
}

interface IncidentPhase {
    id: string
    name: string
    startTime: string
    endTime?: string
    status: 'completed' | 'active' | 'pending'
    description: string
}

interface LegalHold {
    id: string
    jurisdiction: string
    description: string
    expiryDate: string
    status: 'active' | 'pending' | 'expired'
}

interface DRStep {
    id: string
    label: string
    description: string
    estimatedTime: string
}

interface AdminConsoleProps {
    isAdminMode?: boolean
}

const mockServices: ServiceNode[] = [
    {
        id: 'api',
        name: 'API Gateway',
        status: 'healthy',
        latency: 45,
        errorRate: 0.02,
        uptime: 99.99,
        slo: 99.9,
        downstreamServices: ['auth', 'crypto', 'vault'],
    },
    {
        id: 'auth',
        name: 'Auth Service',
        status: 'healthy',
        latency: 120,
        errorRate: 0.05,
        uptime: 99.95,
        slo: 99.9,
        downstreamServices: ['hsm'],
    },
    {
        id: 'crypto',
        name: 'Crypto Service',
        status: 'warning',
        latency: 250,
        errorRate: 0.1,
        uptime: 99.8,
        slo: 99.9,
        downstreamServices: ['hsm'],
    },
    {
        id: 'vault',
        name: 'Vault Service',
        status: 'healthy',
        latency: 180,
        errorRate: 0.01,
        uptime: 99.98,
        slo: 99.95,
        downstreamServices: ['storage'],
    },
    {
        id: 'hsm',
        name: 'HSM Interface',
        status: 'healthy',
        latency: 350,
        errorRate: 0.02,
        uptime: 99.94,
        slo: 99.8,
        downstreamServices: [],
    },
    {
        id: 'storage',
        name: 'Storage Backend',
        status: 'healthy',
        latency: 120,
        errorRate: 0.01,
        uptime: 99.99,
        slo: 99.95,
        downstreamServices: [],
    },
]

const mockSLAMetrics: SLAMetric[] = [
    { name: 'API Availability', value: 99.97, target: 99.9, burnRate: 45 },
    { name: 'P99 Latency', value: 180, target: 200, burnRate: 25 },
    { name: 'Error Rate', value: 0.05, target: 0.1, burnRate: 15 },
    { name: 'Data Replication', value: 99.98, target: 99.95, burnRate: 10 },
]

const mockSecurityScores: SecurityDimension[] = [
    { category: 'Encryption', score: 94, trend: 'up', metadata: 'AES-256 + FIPS' },
    { category: 'Access Control', score: 88, trend: 'stable', metadata: 'RBAC + JIT' },
    { category: 'Key Management', score: 91, trend: 'up', metadata: 'HSM-backed' },
    { category: 'Audit & Logging', score: 92, trend: 'stable', metadata: 'Immutable chain' },
    { category: 'DLP Protection', score: 86, trend: 'down', metadata: 'Pattern detection' },
]

const mockIncidentPhases: IncidentPhase[] = [
    {
        id: 'detection',
        name: 'Detection',
        startTime: '14:22 UTC',
        endTime: '14:24 UTC',
        status: 'completed',
        description: 'Anomaly detected in DB latency',
    },
    {
        id: 'triage',
        name: 'Triage',
        startTime: '14:24 UTC',
        endTime: '14:28 UTC',
        status: 'completed',
        description: 'Identified high query load on primary replica',
    },
    {
        id: 'containment',
        name: 'Containment',
        startTime: '14:28 UTC',
        endTime: '14:35 UTC',
        status: 'completed',
        description: 'Rerouted traffic to read replicas',
    },
    {
        id: 'eradicate',
        name: 'Eradicate',
        startTime: '14:35 UTC',
        status: 'active',
        description: 'Optimizing slow queries (in progress)',
    },
    {
        id: 'recover',
        name: 'Recover',
        startTime: '—',
        status: 'pending',
        description: 'Validate baseline metrics restored',
    },
]

const mockLegalHolds: LegalHold[] = [
    {
        id: 'us-ny',
        jurisdiction: 'New York, USA',
        description: 'Litigation hold for SDNY case #2026-1234',
        expiryDate: '2026-08-15',
        status: 'active',
    },
    {
        id: 'eu-gdpr',
        jurisdiction: 'EU (GDPR)',
        description: 'Regulatory preservation order',
        expiryDate: '2026-12-31',
        status: 'active',
    },
]

const AdminConsole: React.FC<AdminConsoleProps> = ({ isAdminMode = true }) => {
    const [selectedService, setSelectedService] = useState<ServiceNode | null>(null)
    const [showServiceDetail, setShowServiceDetail] = useState(false)
    const [failedServiceId, setFailedServiceId] = useState<string>('crypto') // Simulate failed service
    const [currentDRStep, setCurrentDRStep] = useState('1')
    const [completedDRSteps, setCompletedDRSteps] = useState<string[]>(['1'])
    const [showDRApproval, setShowDRApproval] = useState(false)
    const [showDRDryRun, setShowDRDryRun] = useState(false)
    const [dryRunResults, setDryRunResults] = useState<{ success: boolean; rto: number } | null>(null)
    const [activeTab, setActiveTab] = useState<'topology' | 'sla' | 'security' | 'incidents' | 'governance' | 'dr'>('topology')

    const tabList: Array<'topology' | 'sla' | 'security' | 'incidents' | 'governance' | 'dr'> = [
        'topology', 'sla', 'security', 'incidents', 'governance', 'dr'
    ]

    const drSteps: DRStep[] = [
        { id: '1', label: 'Plan Review', description: 'Verify DR plan current', estimatedTime: '2m' },
        { id: '2', label: 'Pre-Flight Checks', description: 'Validate backup integrity', estimatedTime: '5m' },
        { id: '3', label: 'Failover Test', description: 'Execute dry run failover', estimatedTime: '10m' },
        { id: '4', label: 'Validation', description: 'Verify RTO objectives met', estimatedTime: '5m' },
        { id: '5', label: 'Production Switch', description: 'Switch to DR environment', estimatedTime: '3m' },
    ]

    /* Keyboard Navigation */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showDRApproval && !showServiceDetail) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    const currentIdx = tabList.indexOf(activeTab)
                    const direction = e.key === 'ArrowRight' ? 1 : -1
                    const newIdx = (currentIdx + direction + tabList.length) % tabList.length
                    setActiveTab(tabList[newIdx])
                    e.preventDefault()
                }
            }
            if ((showDRApproval || showServiceDetail) && e.key === 'Escape') {
                setShowDRApproval(false)
                setShowServiceDetail(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [activeTab, showDRApproval, showServiceDetail, tabList])

    const cascadeFailures = useMemo(() => {
        const failed = new Set<string>()
        const recurse = (serviceId: string) => {
            failed.add(serviceId)
            const service = mockServices.find((s) => s.id === serviceId)
            if (service) {
                service.downstreamServices.forEach(recurse)
            }
        }
        if (failedServiceId) recurse(failedServiceId)
        return failed
    }, [failedServiceId])

    const handleServiceClick = (service: ServiceNode) => {
        setSelectedService(service)
        setShowServiceDetail(true)
    }

    const calculateOverallSecurityScore = () => {
        return Math.round(mockSecurityScores.reduce((sum, s) => sum + s.score, 0) / mockSecurityScores.length)
    }

    const handleDRDryRun = () => {
        setShowDRDryRun(true)
        setTimeout(() => {
            setDryRunResults({ success: true, rto: 12 })
        }, 1500)
    }

    const handleDRApproval = () => {
        if (completedDRSteps.length === drSteps.length) {
            alert('DR Failover initiated with 2-person approval')
            setShowDRApproval(false)
        }
    }

    const completeDRStep = () => {
        if (!completedDRSteps.includes(currentDRStep)) {
            setCompletedDRSteps([...completedDRSteps, currentDRStep])
        }
        const currentIdx = drSteps.findIndex((s) => s.id === currentDRStep)
        if (currentIdx < drSteps.length - 1) {
            setCurrentDRStep(drSteps[currentIdx + 1].id)
        }
    }

    const overallScore = calculateOverallSecurityScore()

    return (
        <div className={`admin-console ${isAdminMode ? 'admin-mode' : ''}`}>
            <section className="service-topology-section">
                <div className="section-header">
                    <h2>Service Topology & Dependencies</h2>
                    <p className="section-description">Click nodes for latency, error rate, and SLO details</p>
                </div>
                <div className="topology-container">
                    <svg className="topology-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                        {/* Service nodes */}
                        {mockServices.map((service) => {
                            const isCascaded = cascadeFailures.has(service.id)
                            const x = service.id === 'api' ? 400 : service.id === 'auth' ? 250 : service.id === 'crypto' ? 400 : service.id === 'vault' ? 550 : service.id === 'hsm' ? 325 : 575
                            const y = service.id === 'api' ? 80 : service.id === 'auth' ? 200 : service.id === 'crypto' ? 200 : service.id === 'vault' ? 200 : service.id === 'hsm' ? 320 : 320
                            const statusClass = isCascaded ? 'cascaded' : service.status
                            return (
                                <g key={service.id} className="service-node">
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="32"
                                        className={`node node-${statusClass}`}
                                        onClick={() => handleServiceClick(service)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <text x={x} y={y - 5} textAnchor="middle" className="node-name">
                                        {service.name}
                                    </text>
                                    <text x={x} y={y + 15} textAnchor="middle" className="node-status">
                                        {service.latency}ms
                                    </text>
                                </g>
                            )
                        })}
                        <line x1="400" y1="112" x2="250" y2="168" className="connection-line connection-active" />
                        <line x1="400" y1="112" x2="400" y2="168" className="connection-line connection-warning" />
                        <line x1="400" y1="112" x2="550" y2="168" className="connection-line connection-active" />
                        <line x1="250" y1="232" x2="325" y2="288" className="connection-line connection-active" />
                        <line x1="400" y1="232" x2="325" y2="288" className="connection-line connection-warning" />
                        <line x1="550" y1="232" x2="575" y2="288" className="connection-line connection-active" />
                    </svg>
                </div>
            </section>

            <section className="sla-metrics-section">
                <div className="section-header">
                    <h2>SLA Budget & Burn Rate</h2>
                    <p className="section-description">Monthly budget consumption by service (green {'>'} 50%, amber 20–50%, red {'<'} 20%)</p>
                </div>
                <div className="sla-metrics-grid">
                    {mockSLAMetrics.map((metric) => {
                        const burnColor =
                            metric.burnRate > 50
                                ? 'var(--em)'
                                : metric.burnRate > 20
                                    ? 'var(--am)'
                                    : 'var(--rd)'
                        return (
                            <div key={metric.name} className="sla-card">
                                <div className="sla-title">{metric.name}</div>
                                <div className="sla-value">{metric.value}%</div>
                                <div className="sla-bar">
                                    <div
                                        className="sla-bar-fill"
                                        style={{
                                            width: `${metric.burnRate}%`,
                                            background: burnColor,
                                        }}
                                    />
                                </div>
                                <div className="sla-meta">
                                    <span className="sla-burn">Burn: {metric.burnRate}%</span>
                                    <span className="sla-target">Target: {metric.target}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="security-scorecard-section">
                <div className="section-header">
                    <h2>Security Scorecard</h2>
                    <p className="section-description">Overall security posture with dimension breakdown and trends</p>
                </div>
                <div className="security-container">
                    <div className="security-gauge-wrapper">
                        <svg className="security-gauge" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="80" className="gauge-bg" />
                            <circle
                                cx="100"
                                cy="100"
                                r="80"
                                className="gauge-fill"
                                style={{
                                    strokeDasharray: `${(overallScore / 100) * 502.4} 502.4`,
                                }}
                            />
                            <text x="100" y="90" textAnchor="middle" className="gauge-value">
                                {overallScore}
                            </text>
                            <text x="100" y="115" textAnchor="middle" className="gauge-label">
                                Security
                            </text>
                        </svg>
                    </div>

                    <div className="dimensions-breakdown">
                        {mockSecurityScores.map((dim) => {
                            const trendIcon =
                                dim.trend === 'up' ? '↑' : dim.trend === 'down' ? '↓' : '→'
                            const trendClass = dim.trend === 'up' ? 'trending-up' : dim.trend === 'down' ? 'trending-down' : 'trending-stable'
                            return (
                                <div key={dim.category} className="dimension-bar">
                                    <div className="dimension-header">
                                        <span className="dimension-name">{dim.category}</span>
                                        <span className={`dimension-trend ${trendClass}`}>{trendIcon}</span>
                                    </div>
                                    <div className="dimension-progress">
                                        <div
                                            className="dimension-progress-fill"
                                            style={{
                                                width: `${dim.score}%`,
                                                background: dim.score >= 90 ? 'var(--em)' : dim.score >= 75 ? 'var(--cy)' : dim.score >= 50 ? 'var(--am)' : 'var(--rd)',
                                            }}
                                        />
                                    </div>
                                    <div className="dimension-footer">
                                        <span className="dimension-score">{dim.score}%</span>
                                        {dim.metadata && <span className="dimension-metadata">{dim.metadata}</span>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="incident-timeline-section">
                <div className="section-header">
                    <h2>Current Incident Timeline</h2>
                    <p className="section-description">5-phase incident progression with active phase pulsing</p>
                </div>
                <div className="incident-timeline">
                    {mockIncidentPhases.map((phase, idx) => (
                        <div key={phase.id} className={`timeline-phase phase-${phase.status}`}>
                            <div className="phase-dot" />
                            <div className="phase-content">
                                <div className="phase-name">{phase.name}</div>
                                <div className="phase-description">{phase.description}</div>
                                <div className="phase-time">
                                    {phase.startTime} – {phase.endTime || '...'}
                                </div>
                            </div>
                            {idx < mockIncidentPhases.length - 1 && <div className="phase-connector" />}
                        </div>
                    ))}
                    <button className="generate-postmortem-btn" title="Generate incident report">
                        📋 Generate Post-Mortem
                    </button>
                </div>
            </section>

            <section className="data-sovereignty-section">
                <div className="section-header">
                    <h2>Data Sovereignty & Legal Holds</h2>
                    <p className="section-description">Active legal holds and data distribution by jurisdiction</p>
                </div>
                <div className="sovereignty-container">
                    <div className="world-map">
                        <div className="map-region region-na">🗽 North America</div>
                        <div className="map-region region-eu">🇪🇺 European Union</div>
                        <div className="map-region region-apac">🌏 Asia-Pacific</div>
                    </div>

                    <div className="legal-holds-list">
                        <div className="holds-title">Active Legal Holds</div>
                        {mockLegalHolds.map((hold) => (
                            <div key={hold.id} className={`legal-hold-card hold-${hold.status}`}>
                                <div className="hold-header">
                                    <span className="hold-jurisdiction">{hold.jurisdiction}</span>
                                    <span className={`hold-status-badge badge-${hold.status}`}>
                                        {hold.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="hold-description">{hold.description}</div>
                                <div className="hold-expiry">Expires: {hold.expiryDate}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="dr-wizard-section">
                <div className="section-header">
                    <h2>Disaster Recovery Failover Wizard</h2>
                    <p className="section-description">5-step failover with dry run, validation, and 2-person approval</p>
                </div>
                <div className="dr-container">
                    <div className="dr-steps">
                        {drSteps.map((step, idx) => (
                            <div
                                key={step.id}
                                className={`failover-step step-${completedDRSteps.includes(step.id)
                                        ? 'completed'
                                        : currentDRStep === step.id
                                            ? 'active'
                                            : 'pending'
                                    }`}
                            >
                                <div className="step-number">{idx + 1}</div>
                                <div className="step-content">
                                    <div className="step-label">{step.label}</div>
                                    <div className="step-description">{step.description}</div>
                                    <div className="step-time">Est. {step.estimatedTime}</div>
                                </div>
                                {idx < drSteps.length - 1 && <div className="step-connector" />}
                            </div>
                        ))}
                    </div>

                    {dryRunResults && (
                        <div className={`dr-test-results results-${dryRunResults.success ? 'success' : 'failure'}`}>
                            <div className="results-header">
                                <span className="results-icon">✓</span>
                                Dry Run Complete
                            </div>
                            <div className="results-metric">Last DR Test: <strong>RTO Achieved: {dryRunResults.rto}s</strong></div>
                        </div>
                    )}

                    <div className="dr-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={handleDRDryRun}
                            disabled={currentDRStep !== drSteps[2].id}
                            title="Run failover simulation"
                        >
                            🧪 Dry Run Failover
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={completeDRStep}
                            disabled={currentDRStep === drSteps[drSteps.length - 1].id}
                            title="Progress to next step"
                        >
                            ▶ Next Step
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowDRApproval(true)}
                            disabled={completedDRSteps.length < drSteps.length}
                            title="Initiate failover with dual approval"
                        >
                            ⚡ Execute Failover (2-Person)
                        </button>
                    </div>
                </div>
            </section>

            {showServiceDetail && selectedService && (
                <div className="modal-overlay" onClick={() => setShowServiceDetail(false)}>
                    <div className="service-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedService.name}</h3>
                            <button
                                className="modal-close-btn"
                                onClick={() => setShowServiceDetail(false)}
                                title="Close detail panel"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="detail-metric">
                                <span className="metric-label">Status</span>
                                <span className={`metric-value status-${selectedService.status}`}>
                                    {selectedService.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="detail-metric">
                                <span className="metric-label">Latency (p99)</span>
                                <span className="metric-value">{selectedService.latency}ms</span>
                            </div>
                            <div className="detail-metric">
                                <span className="metric-label">Error Rate</span>
                                <span className="metric-value">{(selectedService.errorRate * 100).toFixed(2)}%</span>
                            </div>
                            <div className="detail-metric">
                                <span className="metric-label">Uptime</span>
                                <span className="metric-value">{selectedService.uptime}%</span>
                            </div>
                            <div className="detail-metric">
                                <span className="metric-label">SLO</span>
                                <span className="metric-value">{selectedService.slo}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDRApproval && (
                <div className="modal-overlay" onClick={() => setShowDRApproval(false)}>
                    <div className="approval-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="approval-header">
                            <h3>🚨 Disaster Recovery Failover Approval</h3>
                            <p className="approval-subtitle">This action requires 2-person authorization</p>
                        </div>
                        <div className="approval-content">
                            <div className="approval-warning">
                                <strong>Warning:</strong> You are about to initiate a complete failover to the disaster recovery environment. This is an irreversible action that may impact ongoing operations.
                            </div>
                            <div className="approval-checklist">
                                <div className="check-item">
                                    <input
                                        type="checkbox"
                                        id="check1"
                                        defaultChecked
                                        title="Acknowledge failover risk"
                                    />
                                    <label htmlFor="check1">I acknowledge the risks of failover</label>
                                </div>
                                <div className="check-item">
                                    <input
                                        type="checkbox"
                                        id="check2"
                                        defaultChecked
                                        title="Confirm dry run success"
                                    />
                                    <label htmlFor="check2">I confirm dry run tests passed</label>
                                </div>
                                <div className="check-item">
                                    <input type="checkbox" id="check3" title="Another admin approval needed" />
                                    <label htmlFor="check3">Waiting for second administrator approval</label>
                                </div>
                            </div>
                        </div>
                        <div className="approval-actions">
                            <button className="btn btn-secondary" onClick={() => setShowDRApproval(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleDRApproval}>
                                Authorize Failover
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminConsole
