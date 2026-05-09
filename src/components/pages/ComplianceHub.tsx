import React, { useState } from 'react'

interface Control {
    id: string
    name: string
    description: string
    status: 'pass' | 'fail' | 'warn'
    severity: 'low' | 'high'
}

interface ComplianceFramework {
    name: string
    score: number
    status: 'compliant' | 'warning' | 'critical'
}

interface ComplianceHubProps {
    frameworks?: ComplianceFramework[]
    controls?: Control[]
}

const ComplianceHub: React.FC<ComplianceHubProps> = ({
    frameworks = [
        { name: 'SOC 2', score: 92, status: 'compliant' },
        { name: 'ISO 27001', score: 87, status: 'warning' },
        { name: 'GDPR', score: 95, status: 'compliant' },
        { name: 'HIPAA', score: 78, status: 'warning' },
    ],
    controls = [
        { id: '1', name: 'Access Control', description: 'User access policies', status: 'pass', severity: 'high' },
        { id: '2', name: 'Encryption', description: 'Data encryption at rest and transit', status: 'pass', severity: 'high' },
        { id: '3', name: 'Audit Logging', description: 'Event logging and monitoring', status: 'fail', severity: 'high' },
        { id: '4', name: 'Backups', description: 'Regular data backups', status: 'warn', severity: 'low' },
    ],
}) => {
    const [selectedControl, setSelectedControl] = useState<string | null>(null)

    const renderArc = (score: number, size: number = 120) => {
        const radius = size / 2 - 8
        const circumference = 2 * Math.PI * radius
        const offset = circumference * (1 - score / 100)
        const angle = (score / 100) * 360 - 90

        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--bd)"
                    strokeWidth="4"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={
                        score >= 90
                            ? 'var(--em)'
                            : score >= 70
                                ? 'var(--cy)'
                                : score >= 50
                                    ? 'var(--am)'
                                    : 'var(--rd)'
                    }
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center' }}
                />
            </svg>
        )
    }

    return (
        <div className="compliance-hub">
            {/* Compliance Arcs */}
            <div className="ch-compliance-arcs">
                {frameworks.map((fw) => (
                    <div key={fw.name} className="ch-arc-container">
                        <div className="ch-arc-title">{fw.name}</div>
                        <div className="ch-arc-svg">{renderArc(fw.score)}</div>
                        <div className="ch-arc-score">{fw.score}%</div>
                        <div className={`ch-arc-status ${fw.status}`}>
                            {fw.status === 'compliant' ? '✓' : fw.status === 'warning' ? '⚠' : '✕'}{' '}
                            {fw.status.charAt(0).toUpperCase() + fw.status.slice(1)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Control Drill-Down */}
            <div className="ch-drill-down">
                <div className="ch-drill-header">Control Assessment</div>
                <div className="ch-control-list">
                    {controls.map((control) => (
                        <div
                            key={control.id}
                            className="ch-control-item"
                            onClick={() =>
                                setSelectedControl(
                                    selectedControl === control.id ? null : control.id
                                )
                            }
                        >
                            <div
                                className={`ch-control-status-icon ${control.status}`}
                            >
                                {control.status === 'pass' && '✓'}
                                {control.status === 'fail' && '✕'}
                                {control.status === 'warn' && '⚠'}
                            </div>
                            <div className="ch-control-info">
                                <div className="ch-control-name">{control.name}</div>
                                <div className="ch-control-desc">{control.description}</div>
                            </div>
                            <div
                                className={`ch-control-severity ${control.severity}`}
                            >
                                {control.severity.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Compliance Bento Row */}
            <div className="ch-compliance-row">
                <div>Compliance Metrics</div>
                <div className="ch-compliance-card">
                    <div className="ch-compliance-card-title">Total Controls</div>
                    <div className="ch-compliance-card-value">{controls.length}</div>
                    <div className="ch-compliance-card-trend">100% Assessed</div>
                </div>
                <div className="ch-compliance-card">
                    <div className="ch-compliance-card-title">Passing</div>
                    <div className="ch-compliance-card-value">
                        {controls.filter((c) => c.status === 'pass').length}
                    </div>
                    <div className="ch-compliance-card-trend up">
                        ↑ {Math.round((controls.filter((c) => c.status === 'pass').length / controls.length) * 100)}%
                    </div>
                </div>
                <div className="ch-compliance-card">
                    <div className="ch-compliance-card-title">Failing</div>
                    <div className="ch-compliance-card-value">
                        {controls.filter((c) => c.status === 'fail').length}
                    </div>
                    <div className="ch-compliance-card-trend down">
                        ↓ {Math.round((controls.filter((c) => c.status === 'fail').length / controls.length) * 100)}%
                    </div>
                </div>
                <div className="ch-compliance-card">
                    <div className="ch-compliance-card-title">Avg Score</div>
                    <div className="ch-compliance-card-value">
                        {Math.round(
                            frameworks.reduce((sum, fw) => sum + fw.score, 0) / frameworks.length
                        )}%
                    </div>
                    <div className="ch-compliance-card-trend">
                        {Math.round(frameworks.reduce((sum, fw) => sum + fw.score, 0) / frameworks.length) >= 90
                            ? '✓ Excellent'
                            : '⚠ Monitor'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComplianceHub
