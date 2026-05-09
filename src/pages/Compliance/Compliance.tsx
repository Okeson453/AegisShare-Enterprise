import React, { useState, useEffect } from 'react'
import useUiStore from '@/store/useUiStore'
import '../../styles/compliance-hub.css'

interface CertificationCard {
    id: string
    name: string
    score: number
    daysToExpiry: number
    lastAudit: Date
    passedControls: number
    monitorControls: number
    controlDots: Array<{ id: string; status: 'pass' | 'warning' | 'fail' }>
}

interface Control {
    id: string
    name: string
    status: 'pass' | 'review' | 'fail'
    lastTested: Date
    tester: string
    framework: string
    gap?: string
    remediation?: string
}

interface ControlOwner {
    name: string
    controls: number
}

interface ReportHistory {
    id: string
    date: Date
    framework: string
    score: number
    signed: boolean
    signedBy?: string
    wormBacked: boolean
}

const ComplianceHub: React.FC = () => {
    const [overallScore, setOverallScore] = useState(92)
    const [cardExpanded, setCardExpanded] = useState<string | null>(null)
    const [expandedFramework, setExpandedFramework] = useState('NIST')
    const [animateArc, setAnimateArc] = useState(false)
    const [controlOwnerFilter, setControlOwnerFilter] = useState<string | null>(null)
    const [expandedControl, setExpandedControl] = useState<string | null>(null)
    const [gapPanelControl, setGapPanelControl] = useState<string | null>(null)

    const certifications: CertificationCard[] = [
        {
            id: 'soc2',
            name: 'SOC 2 Type II',
            score: 92,
            daysToExpiry: 47,
            lastAudit: new Date('2025-01-15'),
            passedControls: 89,
            monitorControls: 2,
            controlDots: [
                { id: 'cc1', status: 'pass' },
                { id: 'cc2', status: 'pass' },
                { id: 'cc6', status: 'pass' },
                { id: 'cc7', status: 'pass' },
            ],
        },
        {
            id: 'iso27',
            name: 'ISO 27001',
            score: 88,
            daysToExpiry: 92,
            lastAudit: new Date('2025-01-20'),
            passedControls: 124,
            monitorControls: 3,
            controlDots: [
                { id: 'a1', status: 'pass' },
                { id: 'a2', status: 'pass' },
                { id: 'a5', status: 'warning' },
            ],
        },
        {
            id: 'gdpr',
            name: 'GDPR Compliant',
            score: 95,
            daysToExpiry: 240,
            lastAudit: new Date('2025-02-01'),
            passedControls: 28,
            monitorControls: 0,
            controlDots: [
                { id: 'g1', status: 'pass' },
                { id: 'g2', status: 'pass' },
            ],
        },
        {
            id: 'hipaa',
            name: 'HIPAA',
            score: 90,
            daysToExpiry: 156,
            lastAudit: new Date('2025-01-25'),
            passedControls: 83,
            monitorControls: 1,
            controlDots: [
                { id: 'h1', status: 'pass' },
                { id: 'h2', status: 'pass' },
            ],
        },
        {
            id: 'pci',
            name: 'PCI-DSS v3.2.1',
            score: 87,
            daysToExpiry: 73,
            lastAudit: new Date('2025-01-10'),
            passedControls: 170,
            monitorControls: 2,
            controlDots: [
                { id: 'p1', status: 'pass' },
                { id: 'p2', status: 'warning' },
            ],
        },
    ]

    const frameworks = {
        NIST: [
            { id: 'cc1.1', name: 'Identity Management', status: 'pass' as const, lastTested: new Date('2025-01-15'), tester: 'm.chen', framework: 'NIST' },
            { id: 'cc2.1', name: 'Logical Access Controls', status: 'pass' as const, lastTested: new Date('2025-01-15'), tester: 'm.chen', framework: 'NIST' },
            {
                id: 'cc6.4',
                name: 'Encryption at Rest',
                status: 'review' as const,
                lastTested: new Date('2024-12-12'),
                tester: 'j.davis',
                framework: 'NIST',
                gap: 'Database encryption not enabled for historical data backups (pre-2023)',
                remediation: 'Enable TDE on all database instances and re-encrypt archived backups using AWS KMS. ETA: 2025-02-28. Owner: j.davis',
            },
            { id: 'cc7.1', name: 'System Operations', status: 'pass' as const, lastTested: new Date('2025-01-15'), tester: 'm.chen', framework: 'NIST' },
        ],
        ISO: [
            { id: 'a5.1', name: 'Access Control Policy', status: 'pass' as const, lastTested: new Date('2025-01-20'), tester: 'r.patel', framework: 'ISO' },
            { id: 'a5.2', name: 'User Registration', status: 'pass' as const, lastTested: new Date('2025-01-20'), tester: 'r.patel', framework: 'ISO' },
            {
                id: 'a9.1',
                name: 'Business Continuity',
                status: 'review' as const,
                lastTested: new Date('2024-12-05'),
                tester: 'j.davis',
                framework: 'ISO',
                gap: 'DR failover RTO exceeds documented 4-hour objective; current time is 5.5 hours',
                remediation: 'Upgrade standby infrastructure and optimize failover playbook. Target: 2.5 hr RTO. Priority: HIGH',
            },
        ],
        GDPR: [
            { id: 'g1.1', name: 'Data Processing Agreement', status: 'pass' as const, lastTested: new Date('2025-02-01'), tester: 'm.chen', framework: 'GDPR' },
            { id: 'g1.2', name: 'Privacy by Design', status: 'pass' as const, lastTested: new Date('2025-02-01'), tester: 'm.chen', framework: 'GDPR' },
        ],
        PCI: [
            { id: 'p1.1', name: 'Firewall Configuration', status: 'pass' as const, lastTested: new Date('2025-01-10'), tester: 'r.patel', framework: 'PCI' },
            { id: 'p3.2', name: 'Data Encryption', status: 'pass' as const, lastTested: new Date('2025-01-10'), tester: 'r.patel', framework: 'PCI' },
        ],
    }

    const controlOwners: ControlOwner[] = [
        { name: 'm.chen', controls: 14 },
        { name: 'j.davis', controls: 8 },
        { name: 'r.patel', controls: 6 },
    ]

    const reportHistory: ReportHistory[] = [
        { id: 'r1', date: new Date('2025-02-10'), framework: 'SOC 2', score: 92, signed: true, signedBy: 'audit@external.com', wormBacked: true },
        { id: 'r2', date: new Date('2025-01-15'), framework: 'ISO 27001', score: 88, signed: true, signedBy: 'audit@external.com', wormBacked: true },
        { id: 'r3', date: new Date('2024-12-20'), framework: 'GDPR', score: 95, signed: true, signedBy: 'dpo@company.com', wormBacked: true },
    ]

    const scoreTrendData = [75, 82, 88, 85, 89, 92]

    useEffect(() => {
        setAnimateArc(true)
    }, [])

    const getUrgencyColor = (days: number) => {
        if (days < 30) return '#F43F5E'
        if (days < 60) return '#F59E0B'
        return '#10B981'
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pass':
                return '#10B981'
            case 'warning':
            case 'review':
                return '#F59E0B'
            case 'fail':
                return '#F43F5E'
            default:
                return '#64748B'
        }
    }

    const generateScoreTrendPoints = () => {
        const maxValue = Math.max(...scoreTrendData)
        const minValue = Math.min(...scoreTrendData)
        const range = maxValue - minValue || 1
        const height = 40
        const width = 140

        return scoreTrendData
            .map((val, i) => {
                const x = (i / (scoreTrendData.length - 1)) * width
                const y = height - ((val - minValue) / range) * height
                return `${x},${y}`
            })
            .join(' ')
    }

    const filteredControls = frameworks[expandedFramework as keyof typeof frameworks]?.filter(
        (c) => !controlOwnerFilter || c.tester === controlOwnerFilter
    ) || []

    return (
        <div className="compliance-hub">
            <div className="ch-header">
                <div className="ch-header-label">
                    <span className="ch-breadcrumb">Compliance Hub</span>
                    <span className="ch-score-badge" style={{ color: overallScore >= 90 ? '#10B981' : overallScore >= 70 ? '#F59E0B' : '#F43F5E' }}>
                        {overallScore}/100
                    </span>
                </div>
                <div className="ch-header-actions">
                    <button className="ch-action-btn">📊 Run Scan</button>
                    <button className="ch-action-btn">⬇ Export</button>
                </div>
            </div>

            <div className="ch-cert-grid">
                {certifications.map((cert, idx) => (
                    <div
                        key={cert.id}
                        className="ch-cert-card-enhanced"
                        style={{
                            borderLeftColor: getUrgencyColor(cert.daysToExpiry),
                            animationDelay: `${idx * 150}ms`,
                        }}
                        onClick={() => setCardExpanded(cardExpanded === cert.id ? null : cert.id)}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm md:text-base font-semibold">{cert.name}</span>
                            <span className="text-xs font-bold px-2 py-1 bg-green-900/30 text-green-400 rounded">✓ VALID</span>
                        </div>

                        <div className="mb-3">
                            <div className="flex items-center justify-between text-xs md:text-sm mb-1">
                                <span className="text-t2">Score</span>
                                <span className="font-semibold">{cert.score}/100</span>
                            </div>
                            <div className="w-full h-2 bg-s3 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all" 
                                    style={{ width: `${cert.score}%` }} 
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <span className="text-xs text-t2">Expiry:</span>
                            <div className="flex items-center justify-between">
                                <span
                                    className="text-sm md:text-base font-semibold"
                                    style={{ color: getUrgencyColor(cert.daysToExpiry) }}
                                >
                                    {cert.daysToExpiry} days
                                </span>
                                {cert.daysToExpiry < 60 && <span className="text-xs px-2 py-1 bg-amber-900/30 text-amber-400 rounded">Renew soon</span>}
                            </div>
                        </div>

                        <div className="text-xs text-t3 space-y-1 mb-3">
                            <div>Last: {cert.lastAudit.toLocaleDateString()}</div>
                            <div>{cert.passedControls} pass / {cert.monitorControls} monitor</div>
                        </div>

                        <div className="flex gap-1">
                            {cert.controlDots.map((dot) => (
                                <span
                                    key={dot.id}
                                    className="ch-control-dot"
                                    style={{ background: getStatusColor(dot.status) }}
                                    title={dot.id}
                                />
                            ))}
                        </div>

                        <div className="ch-cert-actions">
                            <button className="ch-cert-btn">📄 Evidence</button>
                            <button className="ch-cert-btn">⬇ PDF</button>
                        </div>

                        {cardExpanded === cert.id && (
                            <div className="ch-cert-drawer">
                                <div className="ch-drawer-content">
                                    <p>Evidence & Artifacts</p>
                                    <ul>
                                        <li>📎 scan-report-2025-01.pdf</li>
                                        <li>📎 controls-mapping.xlsx</li>
                                        <li>📎 audit-logs-excerpt.csv</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="ch-arc-gauge">
                <div className="ch-gauge-container">
                    <svg className="ch-gauge-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22D3EE" />
                                <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                        </defs>

                        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />

                        <circle
                            cx="100"
                            cy="100"
                            r="70"
                            fill="none"
                            stroke="url(#gauge-gradient)"
                            strokeWidth="8"
                            strokeDasharray={`${animateArc ? (overallScore / 100) * 440 : 0} 440`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            style={{
                                transform: 'rotate(-90deg)',
                                transformOrigin: '100px 100px',
                                transition: 'stroke-dasharray 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        />

                        <text x="100" y="85" textAnchor="middle" className="ch-gauge-score" fontSize="36" fontWeight="700">
                            {overallScore}
                        </text>
                        <text x="100" y="110" textAnchor="middle" className="ch-gauge-label" fontSize="12">
                            / 100
                        </text>
                        <text x="100" y="130" textAnchor="middle" className="ch-gauge-delta" fontSize="10">
                            ▲3 vs last
                        </text>
                    </svg>
                </div>
            </div>

            <div className="ch-control-table">
                <div className="ch-table-header">
                    <div className="ch-table-tabs">
                        {Object.keys(frameworks).map((fw) => (
                            <button
                                key={fw}
                                className={`ch-table-tab ${expandedFramework === fw ? 'active' : ''}`}
                                onClick={() => setExpandedFramework(fw)}
                            >
                                {fw}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ch-table-body">
                    {filteredControls.map((control) => (
                        <React.Fragment key={control.id}>
                            <div className={`ch-control-row ch-control-${control.status}`}>
                                <span
                                    className="ch-control-status-dot"
                                    style={{ background: getStatusColor(control.status) }}
                                />
                                <span className="ch-control-id">{control.id}</span>
                                <span className="ch-control-name">{control.name}</span>
                                <span className="ch-control-tested">{control.lastTested.toLocaleDateString()}</span>
                                <span className="ch-control-tester">{control.tester}</span>
                                <span className="ch-control-badge">
                                    {control.status === 'pass' ? '✓ PASS' : control.status === 'review' ? '⚠ REVIEW' : '✗ FAIL'}
                                </span>
                                {control.status === 'review' && (
                                    <button
                                        className="ch-view-gap-btn"
                                        onClick={() => setGapPanelControl(gapPanelControl === control.id ? null : control.id)}
                                    >
                                        View Gap
                                    </button>
                                )}
                            </div>

                            {gapPanelControl === control.id && control.gap && (
                                <div className="ch-gap-panel">
                                    <div className="ch-gap-content">
                                        <div className="ch-gaps-section">
                                            <h5 className="ch-gaps-title">⚠ Gap Identified</h5>
                                            <div className="ch-gap-item ch-gap-amber-left">
                                                <span className="ch-gap-icon">▸</span>
                                                <span className="ch-gap-text">{control.gap}</span>
                                            </div>
                                        </div>

                                        {control.remediation && (
                                            <div className="ch-remediation-panel">
                                                <h5 className="ch-remediation-title">📋 Remediation Plan</h5>
                                                <p className="ch-remediation-text">{control.remediation}</p>
                                                <div className="ch-remediation-actions">
                                                    <button className="ch-remediation-btn">📅 Schedule</button>
                                                    <button className="ch-remediation-btn">👥 Assign</button>
                                                    <button className="ch-remediation-btn">📎 Evidence</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="ch-bento-row">
                <div className="ch-bento-card">
                    <h4 className="ch-bento-title">SCORE TREND 6M</h4>
                    <svg className="ch-trend-svg" viewBox="0 0 140 50" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <linearGradient id="trend-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <polyline
                            points={generateScoreTrendPoints()}
                            fill="url(#trend-gradient)"
                            stroke="#22D3EE"
                            strokeWidth="1.5"
                        />
                    </svg>
                </div>

                <div className="ch-bento-card">
                    <h4 className="ch-bento-title">CONTROL OWNERS</h4>
                    <div className="ch-owners-list">
                        {controlOwners.map((owner) => (
                            <div
                                key={owner.name}
                                className={`ch-owner-item ${controlOwnerFilter === owner.name ? 'active' : ''}`}
                                onClick={() =>
                                    setControlOwnerFilter(
                                        controlOwnerFilter === owner.name ? null : owner.name
                                    )
                                }
                            >
                                <span className="ch-owner-name">{owner.name}</span>
                                <span className="ch-owner-count">{owner.controls}</span>
                            </div>
                        ))}
                        <button className="ch-assign-btn">+ Assign</button>
                    </div>
                </div>

                <div className="ch-bento-card">
                    <h4 className="ch-bento-title">RISK HEATMAP</h4>
                    <div className="ch-heatmap">
                        {['Encryption', 'Authentication', 'Network'].map((category) => (
                            <div key={category} className="ch-heatmap-row">
                                <span className="ch-heatmap-label">{category}</span>
                                <span className="ch-heatmap-cell high">■</span>
                                <span className="ch-heatmap-cell medium">■</span>
                                <span className="ch-heatmap-cell low">□</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="ch-report-history">
                <div className="ch-report-header">
                    <h3 className="ch-report-title">REPORT HISTORY</h3>
                    <p className="ch-report-subtitle">Signed & WORM-backed audit trail</p>
                </div>

                <div className="ch-report-grid">
                    {reportHistory.map((report, idx) => (
                        <div
                            key={report.id}
                            className="ch-report-tile"
                            style={{ animationDelay: `${idx * 80}ms` }}
                        >
                            <div className="ch-report-header-info">
                                <span className="ch-report-framework">{report.framework}</span>
                                <span className="ch-report-date">{report.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            <div className="ch-report-score">
                                <span className="ch-report-score-value">{report.score}</span>
                                <span className="ch-report-score-label">/100</span>
                            </div>

                            <div className="ch-report-meta">
                                {report.signed && (
                                    <div className="ch-report-badge ch-badge-signed">
                                        🔐 Signed by {report.signedBy}
                                    </div>
                                )}
                                {report.wormBacked && (
                                    <div className="ch-report-badge ch-badge-worm">
                                        📔 WORM-backed
                                    </div>
                                )}
                            </div>

                            <button className="ch-report-action-btn">⬇ PDF</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ComplianceHub
