import React, { useState, useEffect } from 'react'
import { Card, Badge, Modal, Collapse } from '@/components/ui'
import useUiStore from '@/store/useUiStore'
import '../../styles/threat-center.css'

interface ThreatCard {
    id: string
    title: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    mitre: string[]
    blastRadius: string
    affectedSystems: number
    description: string
    action: string
}

interface PlaybookStep {
    id: string
    step: number
    name: string
    status: 'pending' | 'in-progress' | 'completed'
    duration: number
}

interface MitreControl {
    id: string
    tactic: string
    technique: string
    count: number
}

const ThreatCenter: React.FC = () => {
    const { activeTab, setActiveTab } = useUiStore()
    const [selectedThreat, setSelectedThreat] = useState<ThreatCard | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [scannedThreats, setScannedThreats] = useState<Set<string>>(new Set())
    const [autoExecuting, setAutoExecuting] = useState(false)
    const [executedSteps, setExecutedSteps] = useState<Set<string>>(new Set())
    const [detectionParticles, setDetectionParticles] = useState<Array<{id: string, x: number, y: number}>>([])  
    const [heatmapDrill, setHeatmapDrill] = useState<string | null>(null)
    const [responseStatus, setResponseStatus] = useState<{[key: string]: 'ready' | 'executing' | 'completed' | 'failed'}>({})    
    const [playbooks, setPlaybooks] = useState<PlaybookStep[]>([
        { id: 'p1', step: 1, name: 'Isolate affected systems', status: 'completed', duration: 2 },
        { id: 'p2', step: 2, name: 'Enable enhanced logging', status: 'completed', duration: 1 },
        { id: 'p3', step: 3, name: 'Run forensic scan', status: 'in-progress', duration: 5 },
        { id: 'p4', step: 4, name: 'Notify security team', status: 'pending', duration: 1 },
        { id: 'p5', step: 5, name: 'Generate incident report', status: 'pending', duration: 3 },
    ])

    const threatCards: ThreatCard[] = [
        {
            id: 't1',
            title: 'Suspicious API Access Pattern',
            severity: 'critical',
            mitre: ['T1110', 'T1040'],
            blastRadius: 'VAULT_SERVICE',
            affectedSystems: 3,
            description: 'Multiple failed authentications followed by successful access from unusual IP',
            action: 'Block IP + Rotate credentials',
        },
        {
            id: 't2',
            title: 'Anomalous Data Exfiltration',
            severity: 'high',
            mitre: ['T1567', 'T1041'],
            blastRadius: 'STORAGE_LAYER',
            affectedSystems: 7,
            description: '45GB data download in 12 minutes from privileged account',
            action: 'Revoke access + Audit logs',
        },
        {
            id: 't3',
            title: 'Certificate Authority Compromise Detected',
            severity: 'critical',
            mitre: ['T1036', 'T1578'],
            blastRadius: 'TRUST_BOUNDARY',
            affectedSystems: 1,
            description: 'Unauthorized certificate issuance detected in audit logs',
            action: 'Revoke CA + Reissue all certs',
        },
    ]

    const baselineData = Array.from({ length: 30 }, (_, i) => ({
        day: i,
        normal: 50 + Math.sin(i / 5) * 20 + Math.random() * 10,
        actual: 50 + Math.sin(i / 5) * 20 + Math.random() * 30,
    }))

    const mitreHeatmap: MitreControl[] = [
        { id: 'm1', tactic: 'Initial Access', technique: 'Phishing', count: 12 },
        { id: 'm2', tactic: 'Initial Access', technique: 'Exploit', count: 5 },
        { id: 'm3', tactic: 'Execution', technique: 'Command Line', count: 8 },
        { id: 'm4', tactic: 'Persistence', technique: 'Account Creation', count: 3 },
        { id: 'm5', tactic: 'Privilege Escalation', technique: 'Privilege Abuse', count: 7 },
        { id: 'm6', tactic: 'Defense Evasion', technique: 'Obfuscation', count: 4 },
    ]

    const performThreatScan = async () => {
        setIsScanning(true)
        setScannedThreats(new Set())

        for (let i = 0; i < threatCards.length; i++) {
            const threat = threatCards[i]
            await new Promise(resolve => setTimeout(resolve, 400 + i * 150))
            
            setScannedThreats(prev => new Set([...prev, threat.id]))
            setResponseStatus(prev => ({...prev, [threat.id]: 'ready'}))
        }

        setIsScanning(false)
    }

    const autoExecutePlaybook = async () => {
        setAutoExecuting(true)
        setExecutedSteps(new Set())

        for (let i = 0; i < playbooks.length; i++) {
            const pb = playbooks[i]
            await new Promise(resolve => setTimeout(resolve, (pb.duration * 1000) / 2))
            
            setExecutedSteps(prev => new Set([...prev, pb.id]))
        }

        setAutoExecuting(false)
    }

    const initiateAutoResponse = async (threatId: string) => {
        setResponseStatus(prev => ({...prev, [threatId]: 'executing'}))
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
        setResponseStatus(prev => ({...prev, [threatId]: 'completed'}))
    }

    const generateDetectionParticles = () => {
        const particles = Array.from({length: 8}, (_, i) => ({
            id: `p-${i}-${Date.now()}`,
            x: Math.random() * 100,
            y: Math.random() * 100,
        }))
        setDetectionParticles(particles)
        setTimeout(() => setDetectionParticles([]), 1500)
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return '#F43F5E'
            case 'high':
                return '#F59E0B'
            case 'medium':
                return '#3B82F6'
            case 'low':
                return '#10B981'
            default:
                return '#64748B'
        }
    }

    const generateBaselinePoints = () => {
        const maxValue = Math.max(...baselineData.map((d) => d.normal))
        const height = 120
        const width = 240

        return baselineData
            .map((d, i) => {
                const x = (i / (baselineData.length - 1)) * width
                const y = height - (d.normal / maxValue) * height
                return `${x},${y}`
            })
            .join(' ')
    }

    const generateAnomalyPoints = () => {
        const maxValue = Math.max(...baselineData.map((d) => d.actual))
        const height = 120
        const width = 240

        return baselineData
            .map((d, i) => {
                const x = (i / (baselineData.length - 1)) * width
                const y = height - (d.actual / maxValue) * height
                return `${x},${y}`
            })
            .join(' ')
    }

    const getHeatmapColor = (count: number) => {
        if (count > 10) return '#F43F5E'
        if (count > 5) return '#F59E0B'
        if (count > 2) return '#3B82F6'
        return '#10B981'
    }

    return (
        <div className="threat-center">
            <div className="tc-header">
                <span className="tc-breadcrumb">Threat Center</span>
                <div className="tc-tabs">
                    <button
                        className={`tc-tab ${activeTab === 'threats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('threats')}
                    >
                        Threats
                    </button>
                    <button
                        className={`tc-tab ${activeTab === 'baseline' ? 'active' : ''}`}
                        onClick={() => setActiveTab('baseline')}
                    >
                        Baseline
                    </button>
                    <button
                        className={`tc-tab ${activeTab === 'mitre' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mitre')}
                    >
                        MITRE
                    </button>
                    <button
                        className={`tc-tab ${activeTab === 'playbooks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('playbooks')}
                    >
                        Playbooks
                    </button>
                </div>
            </div>

            {activeTab === 'threats' && (
                <div className="tc-threats-section">
                    <div className="tc-scan-header">
                        <h3>Active Threats</h3>
                        <button
                            className={`tc-scan-btn ${isScanning ? 'scanning' : ''} ${scannedThreats.size === threatCards.length && threatCards.length > 0 ? 'complete' : ''}`}
                            onClick={performThreatScan}
                            disabled={isScanning || threatCards.length === 0}
                        >
                            <span className="tc-scan-icon">
                                {isScanning ? '◉' : scannedThreats.size === threatCards.length && threatCards.length > 0 ? '✓' : '▶'}
                            </span>
                            <span className="tc-scan-text">
                                {isScanning
                                    ? `Scanning (${scannedThreats.size}/${threatCards.length})`
                                    : scannedThreats.size === threatCards.length && threatCards.length > 0
                                        ? 'Scan Complete'
                                        : 'Run Threat Scan'}
                            </span>
                            {isScanning && <span className="tc-scan-spinner" />}
                        </button>
                    </div>
                    <div className="tc-threats">
                        {threatCards.map((threat) => (
                            <div
                                key={threat.id}
                                className={`tc-threat-card ${threat.severity} ${scannedThreats.has(threat.id) ? 'scanned' : ''}`}
                                onClick={() => setSelectedThreat(threat)}
                                style={{ borderLeftColor: getSeverityColor(threat.severity), cursor: 'pointer' }}
                            >
                                {scannedThreats.has(threat.id) && (
                                    <div className="tc-threat-glow" />
                                )}
                                <div className="tc-threat-header">
                                    <div className="tc-threat-title">
                                        <h3>{threat.title}</h3>
                                        <span className="tc-threat-severity" style={{ background: getSeverityColor(threat.severity) }}>
                                            {threat.severity.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="tc-threat-meta">
                                        <span className="tc-affected">{threat.affectedSystems} systems</span>
                                    </div>
                                </div>

                            <div className="tc-threat-mitre">
                                {threat.mitre.map((m) => (
                                    <span key={m} className="tc-mitre-badge">
                                        {m}
                                    </span>
                                ))}
                            </div>

                            {responseStatus[threat.id] && (
                                <div className={`tc-response-badge tc-response-${responseStatus[threat.id]}`}>
                                    <span className="tc-response-icon">
                                        {responseStatus[threat.id] === 'executing' ? '⟳' : responseStatus[threat.id] === 'completed' ? '✓' : '◆'}
                                    </span>
                                    <span className="tc-response-text">
                                        {responseStatus[threat.id] === 'executing' ? 'Response Active' : responseStatus[threat.id] === 'completed' ? 'Response Complete' : 'Ready'}
                                    </span>
                                </div>
                            )}

                            <button
                                className="tc-auto-respond-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    initiateAutoResponse(threat.id)
                                }}
                                disabled={responseStatus[threat.id] === 'executing'}
                            >
                                Auto-Respond
                            </button>
                        </div>
                    ))}
                </div>
                </div>
            )}

            {activeTab === 'baseline' && (
                <div className="tc-baseline">
                    <div className="tc-baseline-header">
                        <h3>30-Day Behavioral Baseline</h3>
                        <p className="tc-baseline-subtitle">Normal behavior band vs actual activity</p>
                    </div>
                    <svg className="tc-baseline-chart" viewBox="0 0 240 140" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <linearGradient id="baseline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                                <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                            </linearGradient>
                            <linearGradient id="anomaly-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(244, 63, 94, 0.2)" />
                                <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
                            </linearGradient>
                        </defs>

                        <polyline points={generateBaselinePoints()} fill="url(#baseline-gradient)" stroke="#10B981" strokeWidth="1.5" />
                        <polyline points={generateAnomalyPoints()} fill="url(#anomaly-gradient)" stroke="#F43F5E" strokeWidth="1.5" />

                        <text x="5" y="15" className="tc-chart-label" fontSize="9" fill="var(--t2)">
                            Ops/s
                        </text>
                    </svg>
                </div>
            )}

            {activeTab === 'mitre' && (
                <div className="tc-mitre">
                    <div className="tc-mitre-header">
                        <h3>MITRE ATT&CK Heatmap</h3>
                    </div>
                    <div className="tc-mitre-grid">
                        {mitreHeatmap.map((item) => (
                            <div
                                key={item.id}
                                className="tc-mitre-cell"
                                style={{
                                    background: getHeatmapColor(item.count),
                                    opacity: 0.2 + (item.count / 15) * 0.8,
                                }}
                                title={`${item.tactic} - ${item.technique}: ${item.count} detections`}
                            >
                                <div className="tc-mitre-text">
                                    <p className="tc-mitre-tactic">{item.tactic}</p>
                                    <p className="tc-mitre-tech">{item.technique}</p>
                                    <p className="tc-mitre-count">{item.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'playbooks' && (
                <div className="tc-playbooks-section">
                    <div className="tc-playbook-header">
                        <h3>Incident Response Playbook</h3>
                        <button
                            className={`tc-playbook-btn ${autoExecuting ? 'executing' : ''} ${executedSteps.size === playbooks.length && playbooks.length > 0 ? 'complete' : ''}`}
                            onClick={autoExecutePlaybook}
                            disabled={autoExecuting || playbooks.length === 0}
                        >
                            <span className="tc-execute-icon">
                                {autoExecuting ? '⟳' : executedSteps.size === playbooks.length && playbooks.length > 0 ? '✓' : '▶'}
                            </span>
                            <span className="tc-execute-text">
                                {autoExecuting
                                    ? `Auto-executing (${executedSteps.size}/${playbooks.length})`
                                    : executedSteps.size === playbooks.length && playbooks.length > 0
                                        ? 'Playbook Complete'
                                        : '▶ Auto-execute'}
                            </span>
                            {autoExecuting && <span className="tc-execute-spinner" />}
                        </button>
                    </div>
                    <div className="tc-playbook-timeline">
                        {playbooks.map((pb, idx) => (
                            <div key={pb.id} className={`tc-playbook-item ${executedSteps.has(pb.id) ? 'executed' : ''}`}>
                                <div className={`tc-pb-step tc-pb-${pb.status} ${executedSteps.has(pb.id) ? 'highlight' : ''}`}>
                                    {pb.status === 'completed' || executedSteps.has(pb.id) ? '✓' : pb.status === 'in-progress' ? '◉' : '○'}
                                </div>
                                {idx < playbooks.length - 1 && <div className={`tc-pb-line tc-pb-${pb.status} ${executedSteps.has(pb.id) ? 'highlight' : ''}`} />}
                                <div className="tc-pb-content">
                                    <h4>{pb.name}</h4>
                                    <p className="tc-pb-meta">
                                        {pb.status === 'completed' || executedSteps.has(pb.id)
                                            ? '✓ Completed'
                                            : pb.status === 'in-progress'
                                                ? `⏱ ${pb.duration}m remaining`
                                                : `⊚ ${pb.duration}m estimated`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Threat Details Modal */}
            <Modal isOpen={!!selectedThreat} onClose={() => setSelectedThreat(null)} title={selectedThreat?.title || 'Threat Details'}>
                {selectedThreat && (
                    <div className="space-y-4">
                        <Collapse title="Overview" defaultOpen>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Severity:</span>
                                    <Badge severity={selectedThreat.severity === 'critical' ? 'critical' : selectedThreat.severity === 'high' ? 'high' : 'medium'}>
                                        {selectedThreat.severity.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Affected Systems:</span>
                                    <code>{selectedThreat.affectedSystems}</code>
                                </div>
                                <div><span className="font-semibold">Description:</span><p className="text-sm mt-1">{selectedThreat.description}</p></div>
                            </div>
                        </Collapse>
                        <Collapse title="MITRE ATT&CK">
                            <div className="flex flex-wrap gap-2">
                                {selectedThreat.mitre.map((m) => (
                                    <span key={m} className="px-2 py-1 bg-blue-900 text-blue-100 rounded text-sm">{m}</span>
                                ))}
                            </div>
                        </Collapse>
                        <Collapse title="Impact & Response">
                            <div className="space-y-3">
                                <div><span className="font-semibold">Blast Radius:</span><br /><code className="text-xs">{selectedThreat.blastRadius}</code></div>
                                <div className="flex gap-2 mt-4">
                                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">🔒 {selectedThreat.action}</button>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">📊 Analyze</button>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ThreatCenter
