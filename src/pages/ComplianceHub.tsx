import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Card, DataGrid, Modal, Collapse, Badge } from '@/components/ui'
import { useAudit, useThreatIntel } from '@/hooks'
import type { AuditEvent } from '@/types'
import '../../styles/compliance-hub.css'

type TableColumn<T> = {
    key: keyof T
    label: string
    width?: number
    flex?: number
    render?: (value: any, row: T) => React.ReactNode
}

interface ComplianceCertification {
    id: string
    name: string
    status: 'compliant' | 'reviewing' | 'expired'
    score: number
    expiryDate: string
    daysUntilExpiry: number
}

interface ComplianceControl {
    id: string
    name: string
    status: 'pass' | 'review' | 'fail'
    testedDate: string
    tester: string
    gaps?: string[]
    remediation?: string
}

interface TrendDataPoint {
    month: string
    score: number
}

const ComplianceHub: React.FC = () => {
    const { events = [] } = useAudit()
    const { alerts = [] } = useThreatIntel()
    const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
    const [expandedCert, setExpandedCert] = useState<string | null>(null)
    const [expandedControl, setExpandedControl] = useState<string | null>(null)
    const [showEvidenceDrawer, setShowEvidenceDrawer] = useState<string | null>(null)

    // S4.2: Arc gauge animation
    const arcProgressRef = useRef<SVGCircleElement | null>(null)
    const [gaugeFill, setGaugeFill] = useState(0)

    // Certification data with expiry
    const certifications: ComplianceCertification[] = [
        { id: 'pci', name: 'PCI-DSS 3.2.1', status: 'compliant', score: 94, expiryDate: '2026-06-15', daysUntilExpiry: 66 },
        { id: 'soc2', name: 'SOC 2 Type II', status: 'compliant', score: 97, expiryDate: '2026-08-20', daysUntilExpiry: 132 },
        { id: 'iso27', name: 'ISO 27001:2022', status: 'compliant', score: 91, expiryDate: '2026-05-10', daysUntilExpiry: 30 },
        { id: 'hipaa', name: 'HIPAA BAA', status: 'reviewing', score: 88, expiryDate: '2026-03-01', daysUntilExpiry: -40 },
        { id: 'gdpr', name: 'GDPR RoPA', status: 'compliant', score: 95, expiryDate: '2026-12-31', daysUntilExpiry: 295 },
    ]

    // Compliance controls with gaps
    const controls: ComplianceControl[] = [
        { id: 'AC-1', name: 'Access Control Policy', status: 'pass', testedDate: '2026-04-01', tester: 'Sarah Chen' },
        {
            id: 'SC-4', name: 'Encryption Implementation', status: 'review', testedDate: '2026-03-15', tester: 'Mike Johnson',
            gaps: ['DEK rotation interval exceeds 30 days', 'HSM failover testing incomplete'],
            remediation: 'Update rotation policy to 7-day cycle, complete failover DR test by 2026-04-30'
        },
        { id: 'AU-2', name: 'Audit Event Gen & Log', status: 'pass', testedDate: '2026-04-01', tester: 'Alice Wong' },
        {
            id: 'SI-4', name: 'System Monitoring', status: 'review', testedDate: '2026-03-20', tester: 'James Park',
            gaps: ['SIEM retention < 90 days'],
            remediation: 'Extend archive to 180 days, implement Splunk forwarding'
        },
        { id: 'CA-7', name: 'Continuous Monitoring', status: 'pass', testedDate: '2026-04-01', tester: 'Elena Rodriguez' },
    ]

    // Trend data (6 months)
    const trendData: TrendDataPoint[] = [
        { month: 'Oct', score: 82 },
        { month: 'Nov', score: 85 },
        { month: 'Dec', score: 87 },
        { month: 'Jan', score: 89 },
        { month: 'Feb', score: 91 },
        { month: 'Mar', score: 94 },
    ]

    // Risk heatmap data
    const heatmapData = [
        { control: 'AC', risk: 'low', percentage: 95 },
        { control: 'AU', risk: 'low', percentage: 92 },
        { control: 'CA', risk: 'medium', percentage: 78 },
        { control: 'CM', risk: 'medium', percentage: 82 },
        { control: 'CP', risk: 'low', percentage: 88 },
        { control: 'SC', risk: 'high', percentage: 65 },
    ]

    const complianceMetrics = useMemo(() => {
        const totalEvents = events.length
        const verifiedEvents = events.filter((e: AuditEvent) => e.verified).length
        const criticalEventsLast24h = events.filter((e: AuditEvent) => {
            const eventTime = new Date(e.timestamp).getTime()
            const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
            return e.risk === 'high' && eventTime > oneDayAgo
        }).length
        const complianceScore = totalEvents > 0 ? Math.round((verifiedEvents / totalEvents) * 100) : 100
        const riskScore = Math.min(100, alerts.length * 5)
        const overallScore = Math.round((complianceScore * 0.7 + (100 - riskScore) * 0.3))
        // Deterministic score change based on overall score, not random
        const scoreChange = overallScore > 90 ? 3 : overallScore > 80 ? 1 : -1

        return {
            complianceScore,
            riskScore,
            overallScore,
            scoreChange,
            totalEvents,
            verifiedEvents,
            criticalEventsLast24h,
        }
    }, [events, alerts])

    // S4.2: Animate arc gauge fill
    useEffect(() => {
        const targetFill = complianceMetrics.overallScore
        const animationDuration = 1500
        const startTime = Date.now()
        let rafId: number

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / animationDuration, 1)
            setGaugeFill(Math.floor(targetFill * progress))

            if (progress < 1) {
                rafId = requestAnimationFrame(animate)
            }
        }
        rafId = requestAnimationFrame(animate)

        // Cleanup: cancel rAF if component unmounts during animation
        return () => cancelAnimationFrame(rafId)
    }, [complianceMetrics.overallScore])

    // S4.1: Get expiry color based on days until expiry
    const getExpiryColor = (days: number): string => {
        if (days < 0) return 'var(--rd)' // Expired
        if (days < 30) return 'var(--am)' // Amber: < 30 days
        if (days < 90) return 'var(--cy)' // Cyan: 30-90 days
        return 'var(--em)' // Emerald: > 90 days
    }

    // S4.1: Get expiry badge color
    const getExpiryBadgeBackground = (days: number): string => {
        if (days < 0) return 'rgba(244, 63, 94, 0.15)' // Expired
        if (days < 30) return 'rgba(245, 158, 11, 0.15)' // Amber
        if (days < 90) return 'rgba(34, 211, 238, 0.15)' // Cyan
        return 'rgba(16, 185, 129, 0.15)' // Emerald
    }

    // S4.1: Get cert status color
    const getCertStatusColor = (status: string): string => {
        switch (status) {
            case 'compliant': return 'var(--em)'
            case 'reviewing': return 'var(--am)'
            case 'expired': return 'var(--rd)'
            default: return 'var(--t1)'
        }
    }

    // S4.2: Get ring color based on score
    const getRingColor = (score: number): string => {
        if (score > 90) return '#10B981' // Emerald
        if (score >= 70) return '#F59E0B' // Amber
        return '#F43F5E' // Red
    }

    // S4.1: Generate arc gauge SVG (S4.1)
    const generateArcGauge = (score: number, size: number = 200): React.ReactNode => {
        const radius = size / 2 - 20
        const circumference = 2 * Math.PI * radius
        const fillPercentage = score / 100
        const strokeDashoffset = circumference * (1 - fillPercentage)

        return (
            <svg width={size} height={size} className="ch-gauge-svg">
                {/* Background ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                />
                {/* Animated arc gauge */}
                <circle
                    ref={arcProgressRef}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#arcGradient-${score})`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: 'rotate(-90deg)',
                        transformOrigin: `${size / 2}px ${size / 2}px`,
                    }}
                />
                {/* Gradient definition */}
                <defs>
                    <linearGradient id={`arcGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={getRingColor(score)} />
                        <stop offset="100%" stopColor={getRingColor(score)} stopOpacity="0.6" />
                    </linearGradient>
                </defs>
                {/* Center text */}
                <text
                    x={size / 2}
                    y={size / 2 - 10}
                    textAnchor="middle"
                    className="ch-gauge-score"
                    fontSize="48"
                >
                    {gaugeFill}
                </text>
                <text
                    x={size / 2}
                    y={size / 2 + 20}
                    textAnchor="middle"
                    className="ch-gauge-label"
                    fontSize="12"
                >
                    Overall Score
                </text>
                {/* Delta arrow */}
                <text
                    x={size / 2 + 40}
                    y={size / 2 - 35}
                    textAnchor="middle"
                    className="ch-gauge-delta"
                    fontSize="16"
                    fontWeight="700"
                >
                    {complianceMetrics.scoreChange > 0 ? '↑' : complianceMetrics.scoreChange < 0 ? '↓' : '→'}
                    {Math.abs(complianceMetrics.scoreChange)}
                </text>
            </svg>
        )
    }

    // S4.4: Trend line chart SVG
    const generateTrendChart = (): React.ReactNode => {
        const width = 240
        const height = 80
        const padding = 10
        const pointSpacing = (width - padding * 2) / (trendData.length - 1)
        const minScore = Math.min(...trendData.map(d => d.score))
        const maxScore = Math.max(...trendData.map(d => d.score))
        const scoreRange = maxScore - minScore || 1

        const points = trendData.map((data, index) => {
            const x = padding + index * pointSpacing
            const y = height - padding - ((data.score - minScore) / scoreRange) * (height - padding * 2)
            return { x, y, score: data.score }
        })

        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

        return (
            <svg width={width} height={height} className="ch-trend-svg">
                {/* Grid lines */}
                {[0, 0.5, 1].map((frac, i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={padding + frac * (height - padding * 2)}
                        x2={width - padding}
                        y2={padding + frac * (height - padding * 2)}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="0.5"
                    />
                ))}

                {/* Area fill */}
                <defs>
                    <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
                        <stop offset="100%" stopColor="rgba(34, 211, 238, 0.05)" />
                    </linearGradient>
                </defs>
                <path
                    d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
                    fill="url(#trendGradient)"
                />

                {/* Line */}
                <path
                    d={pathD}
                    stroke="#22D3EE"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Points */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="2.5"
                        fill="#22D3EE"
                    />
                ))}
            </svg>
        )
    }

    const eventColumns: TableColumn<AuditEvent>[] = [
        { key: 'timestamp', label: 'Time', width: 120, render: (val) => new Date(val).toLocaleTimeString() },
        { key: 'actor', label: 'Actor', width: 100 },
        { key: 'action', label: 'Action', flex: 1 },
        {
            key: 'risk', label: 'Risk', width: 100, render: (val) => {
                const severity = val === 'high' ? 'critical' : val === 'medium' ? 'high' : 'info'
                return <Badge severity={severity}>{val}</Badge>
            }
        },
        {
            key: 'verified', label: 'Verified', width: 90, render: (val) => (
                <Badge severity={val ? 'success' : 'warning'}>{val ? 'Yes' : 'No'}</Badge>
            )
        },
    ]

    return (
        <div className="compliance-hub ch-page-offset">
            {/* Unified header with breadcrumb and score badge */}
            <div className="ch-header">
                <div className="ch-header-label">
                    📋 Compliance Hub
                </div>
                <div className="ch-score-badge">Score: {complianceMetrics.overallScore} / 100</div>
            </div>

            {/* Hero row: Gauge + Stats inline */}
            <div className="ch-hero-row">
                {/* Arc gauge */}
                <div className="ch-hero-gauge">
                    <div className="ch-gauge-container">
                        {generateArcGauge(complianceMetrics.overallScore)}
                    </div>
                </div>

                {/* Stats chips (6 quick metrics) */}
                <div className="ch-hero-stats">
                    <div className="ch-stat-chip">
                        <div className="ch-stat-label">Total Events</div>
                        <div className="ch-stat-value">{complianceMetrics.totalEvents}</div>
                    </div>
                    <div className="ch-stat-chip">
                        <div className="ch-stat-label">Verified</div>
                        <div className="ch-stat-value">{complianceMetrics.verifiedEvents}</div>
                    </div>
                    <div className="ch-stat-chip">
                        <div className="ch-stat-label">Critical (24h)</div>
                        <div className="ch-stat-value">{complianceMetrics.criticalEventsLast24h}</div>
                    </div>
                    <div className="ch-stat-chip">
                        <div className="ch-stat-label">Compliance</div>
                        <div className="ch-stat-value">{complianceMetrics.complianceScore}%</div>
                    </div>
                    <div className="ch-stat-chip">
                        <div className="ch-stat-label">Risk Score</div>
                        <div className="ch-stat-value">{complianceMetrics.riskScore}%</div>
                    </div>
                    <div className="ch-stat-chip">
                        <div className="ch-stat-label">Trend</div>
                        <div className="ch-stat-value">{complianceMetrics.scoreChange > 0 ? '↑' : complianceMetrics.scoreChange < 0 ? '↓' : '→'} {Math.abs(complianceMetrics.scoreChange)}</div>
                    </div>
                </div>
            </div>

            {/* S4.1: Certification Cards with Staggered Animation */}
            <div className="ch-cert-cards">
                {certifications.map((cert, index) => (
                    <div
                        key={cert.id}
                        className="ch-cert-card"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <div className="ch-cert-header">
                            <div className="ch-cert-name">{cert.name}</div>
                            <div
                                className="ch-cert-status"
                                style={{ backgroundColor: getExpiryBadgeBackground(cert.daysUntilExpiry), color: getCertStatusColor(cert.status) }}
                            >
                                {cert.status === 'expired' ? 'EXPIRED' : cert.status === 'reviewing' ? 'REVIEWING' : 'COMPLIANT'}
                            </div>
                        </div>

                        <div className="ch-cert-score">
                            <span className="ch-score-label">Score</span>
                            <div className="ch-score-bar">
                                <div className="ch-score-fill" style={{ width: `${cert.score}%` }} />
                            </div>
                            <span className="ch-score-value">{cert.score}%</span>
                        </div>

                        {/* S4.1: Expiry countdown with urgency color shift */}
                        <div
                            className="ch-cert-expiry"
                            style={{ color: getExpiryColor(cert.daysUntilExpiry) }}
                        >
                            <span className="ch-expiry-label">Expires</span>
                            <span className="ch-expiry-days">{cert.daysUntilExpiry > 0 ? cert.daysUntilExpiry : 'EXPIRED'} days</span>
                            {cert.daysUntilExpiry < 30 && cert.daysUntilExpiry >= 0 && (
                                <span className="ch-expiry-warning">ACTION REQUIRED</span>
                            )}
                        </div>

                        <div className="ch-cert-meta">
                            <div className="ch-meta-item">Expiry: {new Date(cert.expiryDate).toLocaleDateString()}</div>
                        </div>

                        {/* S4.1: Control dots visualization */}
                        <div className="ch-cert-dots">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="ch-control-dot"
                                    style={{
                                        backgroundColor:
                                            i < 3 ? 'var(--em)' : i < 4 ? 'var(--am)' : 'var(--rd)',
                                    }}
                                    title={i < 3 ? 'Pass' : i < 4 ? 'Review' : 'Fail'}
                                />
                            ))}
                        </div>

                        <div className="ch-cert-actions">
                            <button
                                className="ch-cert-btn"
                                onClick={() => setExpandedCert(expandedCert === cert.id ? null : cert.id)}
                            >
                                {expandedCert === cert.id ? 'Hide Evidence ↑' : 'View Evidence ↓'}
                            </button>
                        </div>

                        {/* S4.1: Evidence drawer expansion */}
                        {expandedCert === cert.id && (
                            <div className="ch-cert-drawer">
                                <div className="ch-drawer-content">
                                    <p>Evidence Artifacts (9 Files)</p>
                                    <ul>
                                        <li>✓ Policy documentation (2025-Q4)</li>
                                        <li>✓ Audit test results (2026-03-20)</li>
                                        <li>✓ Risk assessment (2026-02-15)</li>
                                        <li>✓ Remediation plan (Active)</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* S4.3: Control Table with Drill-down and Gap Remediation */}
            <div className="ch-control-table">
                <div className="ch-table-header">
                    <h3 className="ch-section-title">Control Assessment</h3>
                    <div className="ch-table-tabs">
                        <button className="ch-table-tab active">All Controls</button>
                        <button className="ch-table-tab">Passing</button>
                        <button className="ch-table-tab">Under Review</button>
                    </div>
                </div>

                <div className="ch-table-body">
                    {controls.map((control) => (
                        <div key={control.id}>
                            <div
                                className={`ch-control-row ${control.status === 'pass' ? 'ch-control-pass' : 'ch-control-review'}`}
                                onClick={() => setExpandedControl(expandedControl === control.id ? null : control.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* S4.1: Control status dot */}
                                <div
                                    className="ch-control-status-dot"
                                    style={{
                                        backgroundColor:
                                            control.status === 'pass'
                                                ? '#10B981'
                                                : control.status === 'review'
                                                    ? '#F59E0B'
                                                    : '#F43F5E',
                                    }}
                                />
                                <div className="ch-control-id">{control.id}</div>
                                <div className="ch-control-name">{control.name}</div>
                                <div className="ch-control-tested">{new Date(control.testedDate).toLocaleDateString()}</div>
                                <div className="ch-control-tester">{control.tester}</div>
                                <div className="ch-control-badge">{control.status === 'pass' ? 'PASS' : 'REVIEW'}</div>
                                {control.gaps && (
                                    <button className="ch-view-gap-btn" onClick={(e) => e.stopPropagation()}>
                                        {control.gaps.length} Gaps
                                    </button>
                                )}
                            </div>

                            {/* S4.3: Collapsible control drill-down with gaps and remediation */}
                            {expandedControl === control.id && control.gaps && (
                                <div className="ch-control-drillddown">
                                    <div className="ch-drillddown-content">
                                        <div className="ch-gaps-section">
                                            <h4 className="ch-gaps-title">Identified Gaps</h4>
                                            {control.gaps.map((gap, i) => (
                                                <div key={i} className="ch-gap-item ch-gap-amber-left">
                                                    <span className="ch-gap-icon">⚠️</span>
                                                    <span className="ch-gap-text">{gap}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* S4.3: Gap remediation guidance panels */}
                                        {control.remediation && (
                                            <div className="ch-remediation-panel">
                                                <h4 className="ch-remediation-title">Remediation Guidance</h4>
                                                <div className="ch-remediation-text">{control.remediation}</div>
                                                <div className="ch-remediation-actions">
                                                    <button className="ch-remediation-btn">Create Issue</button>
                                                    <button className="ch-remediation-btn">Assign Owner</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* S4.4: Bento Row with Score Trend / Control Owners / Risk Heatmap */}
            <div className="ch-bento-row">
                {/* Score Trend 6M */}
                <div className="ch-bento-card">
                    <div className="ch-bento-title">Score Trend (6M)</div>
                    {generateTrendChart()}
                </div>

                {/* Control Owners */}
                <div className="ch-bento-card">
                    <div className="ch-bento-title">Control Owners</div>
                    <div className="ch-owners-list">
                        <div className="ch-owner-item">
                            <span className="ch-owner-name">Sarah Chen</span>
                            <span className="ch-owner-count">12 controls</span>
                        </div>
                        <div className="ch-owner-item">
                            <span className="ch-owner-name">Mike Johnson</span>
                            <span className="ch-owner-count">8 controls</span>
                        </div>
                        <div className="ch-owner-item">
                            <span className="ch-owner-name">Alice Wong</span>
                            <span className="ch-owner-count">9 controls</span>
                        </div>
                        <button className="ch-assign-btn">+ Assign New Owner</button>
                    </div>
                </div>

                {/* Risk Heatmap */}
                <div className="ch-bento-card">
                    <div className="ch-bento-title">Risk Heatmap</div>
                    <div className="ch-heatmap">
                        {heatmapData.map((data) => (
                            <div key={data.control} className="ch-heatmap-row">
                                <div className="ch-heatmap-label">{data.control}</div>
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`ch-heatmap-cell ${data.risk === 'high'
                                            ? 'high'
                                            : data.risk === 'medium'
                                                ? 'medium'
                                                : 'low'
                                            }`}
                                    >
                                        {data.percentage - i * 10}%
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Compliance Events */}
            <div className="ch-events-section">
                <h3 className="ch-section-title">Compliance Events</h3>
                <DataGrid<AuditEvent>
                    rows={events}
                    columns={eventColumns}
                    containerHeight={400}
                    striped
                    onRowClick={(event) => setSelectedEvent(event)}
                />
            </div>

            {/* Compliance Frameworks */}
            <div className="ch-frameworks-section">
                <h3 className="ch-section-title">Compliance Frameworks</h3>
                <Collapse title="PCI-DSS" defaultOpen>
                    <div className="ch-collapse-content">
                        <p>Status: <Badge severity="success">Compliant</Badge></p>
                        <p>Last Audit: 2025-04-01</p>
                        <p>Controls Verified: {events.filter((e: AuditEvent) => e.verified).length} / {events.length}</p>
                    </div>
                </Collapse>
                <Collapse title="HIPAA">
                    <div className="ch-collapse-content">
                        <p>Status: <Badge severity="warning">Under Review</Badge></p>
                        <p>Last Audit: 2025-03-15</p>
                    </div>
                </Collapse>
                <Collapse title="SOC2">
                    <div className="ch-collapse-content">
                        <p>Status: <Badge severity="success">Compliant</Badge></p>
                        <p>Last Audit: 2025-03-01</p>
                    </div>
                </Collapse>
            </div>

            {/* Event Details Modal */}
            <Modal
                isOpen={!!selectedEvent}
                title="Event Details"
                size="md"
                onClose={() => setSelectedEvent(null)}
            >
                {selectedEvent && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-mono text-t3">Time</h4>
                                <p className="text-sm text-t1">{new Date(selectedEvent.timestamp).toISOString()}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-mono text-t3">Actor</h4>
                                <p className="text-sm text-t1">{selectedEvent.actor}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-mono text-t3">Action</h4>
                            <p className="text-sm text-t1">{selectedEvent.action}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-mono text-t3">Risk Level</h4>
                                <Badge severity={selectedEvent.risk === 'high' ? 'critical' : selectedEvent.risk === 'medium' ? 'high' : 'info'}>
                                    {selectedEvent.risk}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="text-sm font-mono text-t3">Verified</h4>
                                <Badge severity={selectedEvent.verified ? 'success' : 'warning'}>
                                    {selectedEvent.verified ? 'Yes' : 'No'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ComplianceHub
