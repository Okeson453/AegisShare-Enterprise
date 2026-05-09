import React, { useState, useEffect } from 'react'
import { Badge, Modal, Collapse } from '@/components/ui'
import useUiStore from '@/store/useUiStore'
import '../../styles/admin-console.css'

type TableColumn<T> = {
    key: keyof T
    label: string
    width?: number
    flex?: number
    render?: (value: any, row: T) => React.ReactNode
}

interface ServiceNode {
    id: string
    name: string
    status: 'healthy' | 'degraded' | 'down'
    uptime: number
    latency: number
}

interface SLAMetric {
    id: string
    name: string
    burnRate: number
    errorBudget: number
}

interface SecurityDimension {
    name: string
    score: number
    weight: number
}

interface IncidentPhase {
    id: string
    phase: string
    startTime: Date
    endTime?: Date
    status: 'completed' | 'in-progress' | 'pending'
}

interface DataRegion {
    id: string
    name: string
    gdprCompliant: boolean
    dataResidency: string
}

interface DRStep {
    id: string
    step: number
    name: string
    completed: boolean
    estimatedTime: number
}

const AdminConsole: React.FC = () => {
    const { activeTab, setActiveTab } = useUiStore()
    const [selectedService, setSelectedService] = useState<ServiceNode | null>(null)
    const [drStep, setDrStep] = useState(0)
    const [showDRModal, setShowDRModal] = useState(false)
    const tabList = ['topology', 'sla', 'security', 'incidents', 'sovereignty', 'dr'] as const

    // Keyboard navigation for tabs
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showDRModal) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    const currentIdx = tabList.indexOf(activeTab as any)
                    const direction = e.key === 'ArrowRight' ? 1 : -1
                    const newIdx = (currentIdx + direction + tabList.length) % tabList.length
                    setActiveTab(tabList[newIdx])
                    e.preventDefault()
                }
            } else if (e.key === 'Escape') {
                setShowDRModal(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [activeTab, showDRModal, setActiveTab])

    const services: ServiceNode[] = [
        { id: 's1', name: 'API Gateway', status: 'healthy', uptime: 99.99, latency: 12 },
        { id: 's2', name: 'Auth Service', status: 'healthy', uptime: 99.95, latency: 45 },
        { id: 's3', name: 'Vault Service', status: 'degraded', uptime: 99.5, latency: 120 },
        { id: 's4', name: 'Key Manager', status: 'healthy', uptime: 99.98, latency: 67 },
        { id: 's5', name: 'Policy Engine', status: 'healthy', uptime: 99.97, latency: 89 },
    ]

    const slaMetrics: SLAMetric[] = [
        { id: 'sla1', name: 'API Availability', burnRate: 5, errorBudget: 95 },
        { id: 'sla2', name: 'Auth Latency', burnRate: 15, errorBudget: 85 },
        { id: 'sla3', name: 'Vault Operations', burnRate: 8, errorBudget: 92 },
        { id: 'sla4', name: 'Key Operations', burnRate: 3, errorBudget: 97 },
    ]

    const securityDimensions: SecurityDimension[] = [
        { name: 'Encryption', score: 95, weight: 25 },
        { name: 'Authentication', score: 98, weight: 25 },
        { name: 'Network Security', score: 92, weight: 20 },
        { name: 'Audit & Logging', score: 90, weight: 20 },
        { name: 'Access Control', score: 96, weight: 10 },
    ]

    const incidentPhases: IncidentPhase[] = [
        { id: 'p1', phase: 'Detection', startTime: new Date(Date.now() - 86400000), endTime: new Date(Date.now() - 82800000), status: 'completed' },
        { id: 'p2', phase: 'Containment', startTime: new Date(Date.now() - 82800000), endTime: new Date(Date.now() - 57600000), status: 'completed' },
        { id: 'p3', phase: 'Investigation', startTime: new Date(Date.now() - 57600000), endTime: new Date(Date.now() - 28800000), status: 'in-progress' },
        { id: 'p4', phase: 'Resolution', startTime: new Date(Date.now() - 28800000), status: 'pending' },
        { id: 'p5', phase: 'Post-Mortem', startTime: new Date(), status: 'pending' },
    ]

    const regions: DataRegion[] = [
        { id: 'r1', name: 'EU (Frankfurt)', gdprCompliant: true, dataResidency: 'EU' },
        { id: 'r2', name: 'US (N. Virginia)', gdprCompliant: false, dataResidency: 'US' },
        { id: 'r3', name: 'APAC (Singapore)', gdprCompliant: false, dataResidency: 'APAC' },
        { id: 'r4', name: 'CA (Toronto)', gdprCompliant: true, dataResidency: 'CA' },
    ]

    const drSteps: DRStep[] = [
        { id: 'd1', step: 1, name: 'Select Failover Region', completed: false, estimatedTime: 5 },
        { id: 'd2', step: 2, name: 'Verify Capacity', completed: false, estimatedTime: 10 },
        { id: 'd3', step: 3, name: 'Lock RTO/RPO', completed: false, estimatedTime: 5 },
        { id: 'd4', step: 4, name: 'Test Failover', completed: false, estimatedTime: 20 },
        { id: 'd5', step: 5, name: 'Get Approval', completed: false, estimatedTime: 15 },
        { id: 'd6', step: 6, name: 'Execute Failover', completed: false, estimatedTime: 30 },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return '#10B981'
            case 'degraded':
                return '#F59E0B'
            case 'down':
                return '#F43F5E'
            default:
                return '#8BA4C2'
        }
    }

    const overallSecurityScore = Math.round(
        securityDimensions.reduce((acc, d) => acc + d.score * d.weight, 0) / securityDimensions.reduce((acc, d) => acc + d.weight, 0)
    )

    return (
        <div className="admin-console" role="main" aria-label="Admin Console">
            <div className="ac-header">
                <h1 className="ac-breadcrumb" id="admin-console-title">Admin Console</h1>
                <div className="ac-tabs" role="tablist" aria-label="Admin Console Sections">
                    <button
                        className={`ac-tab ${activeTab === 'topology' ? 'active' : ''}`}
                        onClick={() => setActiveTab('topology')}
                        role="tab"
                        aria-selected={activeTab === 'topology'}
                        aria-controls="topology-section"
                        tabIndex={activeTab === 'topology' ? 0 : -1}
                    >
                        Topology
                    </button>
                    <button
                        className={`ac-tab ${activeTab === 'sla' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sla')}
                        role="tab"
                        aria-selected={activeTab === 'sla'}
                        aria-controls="sla-section"
                        tabIndex={activeTab === 'sla' ? 0 : -1}
                    >
                        SLA Metrics
                    </button>
                    <button
                        className={`ac-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                        role="tab"
                        aria-selected={activeTab === 'security'}
                        aria-controls="security-section"
                        tabIndex={activeTab === 'security' ? 0 : -1}
                    >
                        Security
                    </button>
                    <button
                        className={`ac-tab ${activeTab === 'incidents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('incidents')}
                        role="tab"
                        aria-selected={activeTab === 'incidents'}
                        aria-controls="incidents-section"
                        tabIndex={activeTab === 'incidents' ? 0 : -1}
                    >
                        Incidents
                    </button>
                    <button
                        className={`ac-tab ${activeTab === 'sovereignty' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sovereignty')}
                        role="tab"
                        aria-selected={activeTab === 'sovereignty'}
                        aria-controls="sovereignty-section"
                        tabIndex={activeTab === 'sovereignty' ? 0 : -1}
                    >
                        Data Sovereignty
                    </button>
                    <button
                        className={`ac-tab ${activeTab === 'dr' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dr')}
                        role="tab"
                        aria-selected={activeTab === 'dr'}
                        aria-controls="dr-section"
                        tabIndex={activeTab === 'dr' ? 0 : -1}
                    >
                        DR Control
                    </button>
                </div>
            </div>

            {activeTab === 'topology' && (
                <div className="ac-topology" id="topology-section" role="tabpanel" aria-labelledby="topology-tab">
                    <div className="ac-topo-header">
                        <h2 id="topology-tab">Service Topology</h2>
                        <p className="ac-topo-subtitle">Distributed system architecture with dependencies</p>
                    </div>

                    <svg className="ac-topology-graph" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Service topology diagram showing API Gateway, Auth Service, Vault Service, Key Manager, and Policy Engine connections">
                        <defs>
                            <marker id="arrowHealthy" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#10B981" />
                            </marker>
                            <marker id="arrowDegraded" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B" />
                            </marker>
                        </defs>

                        <line x1="100" y1="100" x2="300" y2="100" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowHealthy)" />
                        <line x1="100" y1="100" x2="200" y2="250" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#arrowDegraded)" />
                        <line x1="300" y1="100" x2="500" y2="80" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowHealthy)" />
                        <line x1="300" y1="100" x2="500" y2="150" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowHealthy)" />

                        <circle cx="100" cy="100" r="24" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="2" />
                        <text x="100" y="105" textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="700">
                            API
                        </text>

                        <circle cx="300" cy="100" r="24" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="2" />
                        <text x="300" y="105" textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="700">
                            Auth
                        </text>

                        <circle cx="200" cy="250" r="24" fill="#F59E0B" opacity="0.2" stroke="#F59E0B" strokeWidth="2" />
                        <text x="200" y="255" textAnchor="middle" fontSize="10" fill="#F59E0B" fontWeight="700">
                            Vault
                        </text>

                        <circle cx="500" cy="80" r="24" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="2" />
                        <text x="500" y="85" textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="700">
                            Keys
                        </text>

                        <circle cx="500" cy="150" r="24" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="2" />
                        <text x="500" y="155" textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="700">
                            Policy
                        </text>
                    </svg>

                    <div className="ac-service-list">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`ac-service-card ${service.status}`}
                                onClick={() => setSelectedService(selectedService?.id === service.id ? null : service)}
                            >
                                <div className="ac-service-header">
                                    <div className="ac-service-status" data-status={service.status} />
                                    <h4>{service.name}</h4>
                                    <span className="ac-service-label">{service.status}</span>
                                </div>
                                <div className="ac-service-metrics">
                                    <p>Uptime: <code>{service.uptime}%</code></p>
                                    <p>Latency: <code>{service.latency}ms</code></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'sla' && (
                <div id="sla-section" className="ac-sla" role="tabpanel" aria-labelledby="sla-tab">
                    <div className="ac-sla-header">
                        <h2 id="sla-tab">SLA Burn Rate Dashboard</h2>
                        <p className="ac-sla-subtitle">Error budget vs burn rate percentage</p>
                    </div>

                    <div className="ac-sla-grid">
                        {slaMetrics.map((metric) => {
                            let statusClass = 'healthy'
                            if (metric.burnRate > 10) statusClass = 'warning'
                            if (metric.burnRate > 20) statusClass = 'critical'

                            return (
                                <div key={metric.id} className="ac-sla-card">
                                    <h4>{metric.name}</h4>
                                    <div className="ac-sla-bar-container">
                                        <div className="ac-sla-bar-background" />
                                        <div className={`ac-sla-bar-burn ac-sla-${statusClass}`} style={{ '--width': `${metric.burnRate}%` } as React.CSSProperties} />
                                        <span className="ac-sla-burn-label">{metric.burnRate}%</span>
                                    </div>
                                    <div className="ac-sla-footer">
                                        <span className="ac-sla-budget">Budget: {metric.errorBudget}%</span>
                                        <span className={`ac-sla-status ${metric.burnRate > 15 ? 'warning' : 'healthy'}`}>
                                            {metric.burnRate > 15 ? '⚠ At Risk' : '✓ Healthy'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div id="security-section" className="ac-security" role="tabpanel" aria-labelledby="security-tab">
                    <div className="ac-security-header">
                        <h2 id="security-tab">Security Scorecard</h2>
                        <p className="ac-security-subtitle">Comprehensive security posture assessment</p>
                    </div>

                    <div className="ac-security-score">
                        <svg className="ac-score-gauge" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" role="presentation">
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#64748B" strokeWidth="8" />
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray={`${(overallSecurityScore / 100) * 251.3}, 251.3`} />
                            <text x="100" y="70" textAnchor="middle" fontSize="32" fontWeight="700" fill="#E8EEF6">
                                {overallSecurityScore}
                            </text>
                            <text x="100" y="95" textAnchor="middle" fontSize="12" fill="#8BA4C2">
                                / 100
                            </text>
                        </svg>
                    </div>

                    <div className="ac-security-dimensions">
                        {securityDimensions.map((dim) => {
                            let scoreClass = 'critical'
                            if (dim.score >= 90) scoreClass = 'excellent'
                            else if (dim.score >= 80) scoreClass = 'good'
                            return (
                                <div key={dim.name} className="ac-dimension-row">
                                    <div className="ac-dimension-header">
                                        <span className="ac-dimension-name">{dim.name}</span>
                                        <span className="ac-dimension-score">{dim.score}/100</span>
                                    </div>
                                    <div className="ac-dimension-bar">
                                        <div className={`ac-dimension-fill ac-score-${scoreClass}`} style={{ '--score': dim.score } as React.CSSProperties} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'incidents' && (
                <div id="incidents-section" className="ac-incidents" role="tabpanel" aria-labelledby="incidents-tab">
                    <div className="ac-incidents-header">
                        <h2 id="incidents-tab">Incident Response Timeline</h2>
                        <p className="ac-incidents-subtitle">Phase-based incident progression</p>
                    </div>

                    <div className="ac-incident-timeline">
                        {incidentPhases.map((phase, idx) => (
                            <div key={phase.id} className="ac-incident-item">
                                <div className={`ac-incident-phase ac-phase-${phase.status}`}>
                                    {phase.status === 'completed' ? '✓' : phase.status === 'in-progress' ? '◉' : '○'}
                                </div>
                                {idx < incidentPhases.length - 1 && <div className={`ac-incident-line ac-line-${phase.status}`} />}
                                <div className="ac-incident-content">
                                    <h4>{phase.phase}</h4>
                                    <p className="ac-phase-duration">
                                        {phase.endTime
                                            ? `${Math.floor((phase.endTime.getTime() - phase.startTime.getTime()) / (1000 * 60))}min`
                                            : `Started ${Math.floor((Date.now() - phase.startTime.getTime()) / (1000 * 60))}min ago`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'sovereignty' && (
                <div id="sovereignty-section" className="ac-sovereignty" role="tabpanel" aria-labelledby="sovereignty-tab">
                    <div className="ac-sovereignty-header">
                        <h2 id="sovereignty-tab">Data Sovereignty Map</h2>
                        <p className="ac-sovereignty-subtitle">GDPR compliance and data residency status</p>
                    </div>

                    <svg className="ac-world-map" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid meet" role="presentation">
                        <g id="map">
                            <rect x="0" y="0" width="960" height="600" fill="#0F172A" />

                            <rect x="150" y="100" width="150" height="120" fill="#10B981" opacity="0.3" stroke="#10B981" strokeWidth="2" />
                            <text x="225" y="160" textAnchor="middle" fontSize="12" fill="#10B981" fontWeight="700">
                                EU
                            </text>
                            <text x="225" y="180" textAnchor="middle" fontSize="10" fill="#10B981">
                                GDPR ✓
                            </text>

                            <rect x="400" y="150" width="140" height="110" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" strokeWidth="2" />
                            <text x="470" y="205" textAnchor="middle" fontSize="12" fill="#3B82F6" fontWeight="700">
                                US
                            </text>
                            <text x="470" y="225" textAnchor="middle" fontSize="10" fill="#3B82F6">
                                Regional
                            </text>

                            <rect x="650" y="200" width="120" height="100" fill="#F59E0B" opacity="0.3" stroke="#F59E0B" strokeWidth="2" />
                            <text x="710" y="250" textAnchor="middle" fontSize="12" fill="#F59E0B" fontWeight="700">
                                APAC
                            </text>
                            <text x="710" y="270" textAnchor="middle" fontSize="10" fill="#F59E0B">
                                At Risk
                            </text>
                        </g>
                    </svg>

                    <div className="ac-regions-list">
                        {regions.map((region) => (
                            <div key={region.id} className="ac-region-card">
                                <div className="ac-region-header">
                                    <h4>{region.name}</h4>
                                    <span className={`ac-region-status ${region.gdprCompliant ? 'compliant' : 'not-compliant'}`}>
                                        {region.gdprCompliant ? '✓ GDPR Compliant' : '⚠ GDPR Exempt'}
                                    </span>
                                </div>
                                <p className="ac-region-residency">Data Residency: <code>{region.dataResidency}</code></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'dr' && (
                <div id="dr-section" className="ac-dr" role="tabpanel" aria-labelledby="dr-tab">
                    <div className="ac-dr-header">
                        <h2 id="dr-tab">Disaster Recovery Control</h2>
                        <button className="ac-dr-initiate" onClick={() => { setShowDRModal(true); setDrStep(0); }}>
                            🚨 Initiate Failover
                        </button>
                    </div>

                    <div className="ac-dr-info">
                        <div className="ac-dr-stat">
                            <span className="ac-dr-stat-label">Current RTO</span>
                            <span className="ac-dr-stat-value">4 hours</span>
                        </div>
                        <div className="ac-dr-stat">
                            <span className="ac-dr-stat-label">Current RPO</span>
                            <span className="ac-dr-stat-value">15 minutes</span>
                        </div>
                        <div className="ac-dr-stat">
                            <span className="ac-dr-stat-label">Last DR Test</span>
                            <span className="ac-dr-stat-value">2 days ago</span>
                        </div>
                        <div className="ac-dr-stat">
                            <span className="ac-dr-stat-label">Status</span>
                            <span className="ac-dr-stat-value ac-dr-healthy">✓ Healthy</span>
                        </div>
                    </div>

                    <div className="ac-dr-regions">
                        <h4>Available Failover Regions</h4>
                        <div className="ac-dr-region-list">
                            {regions.map((region) => (
                                <div key={region.id} className="ac-dr-region-card">
                                    <div className="ac-dr-region-name">{region.name}</div>
                                    <div className="ac-dr-region-capacity">Capacity: 95%</div>
                                    <div className="ac-dr-region-latency">Latency: 45ms</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showDRModal && (
                <div className="ac-modal-overlay" onClick={() => setShowDRModal(false)} role="presentation" aria-hidden={!showDRModal}>
                    <div className="ac-modal" role="dialog" aria-modal="true" aria-labelledby="dr-modal-title" onClick={(e) => e.stopPropagation()}>
                        <div className="ac-modal-header">
                            <h2 id="dr-modal-title">Disaster Recovery Failover</h2>
                            <button className="ac-modal-close" onClick={() => setShowDRModal(false)} aria-label="Close disaster recovery dialog">
                                ✕
                            </button>
                        </div>

                        <div className="ac-dr-progress" role="progressbar" aria-valuenow={drStep} aria-valuemin={0} aria-valuemax={5} aria-label={`Disaster recovery step ${drStep + 1} of 6: ${drSteps[drStep]?.name || 'In Progress'}`}>
                            {drSteps.map((step, i) => (
                                <div key={step.id} className={`ac-dr-progress-step ${i < drStep ? 'done' : i === drStep ? 'current' : ''}`} aria-current={i === drStep ? 'step' : undefined}>
                                    {i < drStep ? '✓' : i + 1}
                                </div>
                            ))}
                        </div>

                        <div className="ac-dr-modal-content">
                            {drStep === 0 && (
                                <div className="ac-dr-step">
                                    <h3>Select Failover Region</h3>
                                    <div className="ac-region-options">
                                        {regions.map((region) => (
                                            <button key={region.id} className="ac-region-option">
                                                {region.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {drStep === 1 && (
                                <div className="ac-dr-step">
                                    <h3>Verify Capacity</h3>
                                    <div className="ac-capacity-check">
                                        <p>✓ CPU: 85% available</p>
                                        <p>✓ Memory: 90% available</p>
                                        <p>✓ Storage: 70% available</p>
                                        <p>✓ Network: 60% available</p>
                                    </div>
                                </div>
                            )}

                            {drStep === 2 && (
                                <div className="ac-dr-step">
                                    <h3>Lock RTO/RPO</h3>
                                    <div className="ac-rto-rpo-settings">
                                        <div className="ac-setting">
                                            <label>Recovery Time Objective (RTO)</label>
                                            <input type="text" defaultValue="4 hours" disabled />
                                        </div>
                                        <div className="ac-setting">
                                            <label>Recovery Point Objective (RPO)</label>
                                            <input type="text" defaultValue="15 minutes" disabled />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {drStep === 3 && (
                                <div className="ac-dr-step">
                                    <h3>Test Failover</h3>
                                    <p className="ac-dr-step-text">Running failover test on target region...</p>
                                    <div className="ac-test-progress">
                                        <div className="ac-test-bar ac-test-progress-60" />
                                    </div>
                                    <p className="ac-test-time">2 of 5 minutes completed</p>
                                </div>
                            )}

                            {drStep === 4 && (
                                <div className="ac-dr-step">
                                    <h3>Get Approval</h3>
                                    <div className="ac-approval-box">
                                        <p className="ac-approval-text">Send failover request to management team?</p>
                                        <p className="ac-approval-details">Estimated execution time: 35 minutes</p>
                                        <label>
                                            <input type="checkbox" /> I understand the implications of this failover
                                        </label>
                                    </div>
                                </div>
                            )}

                            {drStep === 5 && (
                                <div className="ac-dr-step">
                                    <h3>Execute Failover</h3>
                                    <p className="ac-dr-step-text">Starting production failover to US-BACKUP region...</p>
                                    <div className="ac-failover-steps">
                                        <p>✓ Drain primary region</p>
                                        <p>✓ Promote secondary database</p>
                                        <p>⏳ Update DNS records</p>
                                        <p>○ Verify data integrity</p>
                                        <p>○ Notify stakeholders</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="ac-dr-modal-actions">
                            {drStep > 0 && (
                                <button className="ac-dr-btn secondary" onClick={() => setDrStep(drStep - 1)}>
                                    Back
                                </button>
                            )}
                            {drStep < 5 && (
                                <button className="ac-dr-btn primary" onClick={() => setDrStep(drStep + 1)}>
                                    Next
                                </button>
                            )}
                            {drStep === 5 && (
                                <button className="ac-dr-btn execute" onClick={() => setShowDRModal(false)}>
                                    Execute Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Service Details Modal */}
            <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={selectedService?.name || 'Service Details'}>
                {selectedService && (
                    <div className="space-y-4">
                        <Collapse title="Service Status" defaultOpen>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="font-semibold">Status:</span><Badge severity={selectedService.status === 'healthy' ? 'success' : selectedService.status === 'degraded' ? 'warning' : 'critical'}>{selectedService.status.toUpperCase()}</Badge></div>
                                <div className="flex justify-between"><span className="font-semibold">Uptime:</span><code>{selectedService.uptime}%</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Latency:</span><code>{selectedService.latency}ms</code></div>
                            </div>
                        </Collapse>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default AdminConsole
