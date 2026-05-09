import React, { useState, useMemo, useEffect, useCallback } from 'react'

interface MerkleNode {
    id: string
    hash: string
    parentHash?: string
    status: 'verified' | 'pending' | 'rejected'
    timestamp: string
    children?: string[]
}

interface AuditEntry {
    id: string
    action: string
    actor: string
    resource: string
    status: 'success' | 'pending' | 'warning' | 'failed'
    timestamp: string
    type: 'access' | 'system'
    details?: string
}

interface AuditLedgerProps {
    merkleChain?: MerkleNode[]
    auditEntries?: AuditEntry[]
    onExport?: (format: string) => void
}

const AuditLedger: React.FC<AuditLedgerProps> = ({
    merkleChain = [],
    auditEntries = [],
    onExport,
}) => {
    const [activeTab, setActiveTab] = useState<'events' | 'timeline' | 'export'>('events')
    const [exportFormat, setExportFormat] = useState('json')
    const [selectedNode, setSelectedNode] = useState<string | null>(null)
    const [animatingNodeId, setAnimatingNodeId] = useState<string | null>(null)
    const [timelineZoom, setTimelineZoom] = useState<'1h' | '6h' | '24h' | '7d'>('24h')
    const [isTampered, setIsTampered] = useState(false)
    const [connectionLatency, setConnectionLatency] = useState<number | null>(null)
    const [verifyingChain, setVerifyingChain] = useState(false)
    const [verifiedNodes, setVerifiedNodes] = useState<Set<string>>(new Set())
    const [testingConnection, setTestingConnection] = useState(false)
    const [exportOptions, setExportOptions] = useState({
        includeHashes: true,
        includeMerkleTree: true,
        includeTimestamps: true,
    })

    const verifiedCount = useMemo(
        () => merkleChain.filter((n) => n.status === 'verified').length,
        [merkleChain]
    )

    const chainIntegrity = useMemo(() => {
        if (merkleChain.length === 0) return 100
        return (verifiedCount / merkleChain.length) * 100
    }, [merkleChain, verifiedCount])

    // Simulate merkle chain verification animation on mount
    useEffect(() => {
        if (merkleChain.length === 0) return

        merkleChain.forEach((node, idx) => {
            setTimeout(() => {
                setAnimatingNodeId(node.id)
                setTimeout(() => setAnimatingNodeId(null), 600)
            }, idx * 150)
        })
    }, [merkleChain])

    // Detect tampering (any failed nodes)
    useEffect(() => {
        const hasTamperedNode = merkleChain.some((n) => n.status === 'rejected')
        setIsTampered(hasTamperedNode)
    }, [merkleChain])

    const handleExport = async () => {
        // Simulate test connection latency
        setConnectionLatency(null)
        const startTime = performance.now()

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))

        const latency = Math.round(performance.now() - startTime)
        setConnectionLatency(latency)

        onExport?.(exportFormat)
    }

    const performChainVerification = async () => {
        setVerifyingChain(true)
        setVerifiedNodes(new Set())

        for (let i = 0; i < merkleChain.length; i++) {
            const node = merkleChain[i]
            await new Promise(resolve => setTimeout(resolve, 300 + i * 100))
            
            setVerifiedNodes(prev => new Set([...prev, node.id]))
            setAnimatingNodeId(node.id)

            setTimeout(() => setAnimatingNodeId(null), 600)
        }

        setVerifyingChain(false)
    }

    const testBlockchainConnection = async () => {
        setTestingConnection(true)
        setConnectionLatency(null)

        const startTime = performance.now()
        
        try {
            // Simulate connection test
            await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500))
            const latency = Math.round(performance.now() - startTime)
            setConnectionLatency(latency)
        } finally {
            setTestingConnection(false)
        }
    }

    const detectionCheck = useCallback(() => {
        const hasIntegrity = merkleChain.every((node, idx, arr) => {
            if (idx === 0) return true
            return node.parentHash === arr[idx - 1].hash
        })
        setIsTampered(!hasIntegrity)
    }, [merkleChain])

    useEffect(() => {
        detectionCheck()
    }, [detectionCheck])

    const getTimelineItemsForZoom = (zoom: string): AuditEntry[] => {
        const now = new Date()
        const msPerZoom = {
            '1h': 3600000,
            '6h': 21600000,
            '24h': 86400000,
            '7d': 604800000,
        }
        
        return (auditEntries || []).filter(entry => {
            const entryTime = new Date(entry.timestamp).getTime()
            const timeDiff = now.getTime() - entryTime
            return timeDiff <= msPerZoom[zoom as keyof typeof msPerZoom]
        })
    }

    const zoomOptions = [
        { value: '1h' as const, label: '1H' },
        { value: '6h' as const, label: '6H' },
        { value: '24h' as const, label: '24H' },
        { value: '7d' as const, label: '7D' },
    ]

    const timelineEntries = auditEntries.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const accessEntries = timelineEntries.filter((e) => e.type === 'access')
    const systemEntries = timelineEntries.filter((e) => e.type === 'system')

    return (
        <div className={`audit-ledger ${isTampered ? 'tampered' : ''}`}>
            {isTampered && (
                <div className="al-tamper-banner">
                    <div className="al-tamper-icon">⚠️</div>
                    <div className="al-tamper-content">
                        <div className="al-tamper-title">CHAIN INTEGRITY ALERT</div>
                        <div className="al-tamper-desc">Potential tampering detected. Review chain immediately.</div>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="al-tabs">
                <button
                    className={`al-tab ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                >
                    Event Log
                </button>
                <button
                    className={`al-tab ${activeTab === 'timeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    Timeline View
                </button>
                <button
                    className={`al-tab ${activeTab === 'export' ? 'active' : ''}`}
                    onClick={() => setActiveTab('export')}
                >
                    Export
                </button>
            </div>

            {/* Merkle Chain Visualization (Always Visible) */}
            <div className="al-merkle-section">
                <div className="al-merkle-header">
                    <h3>Merkle Chain Verification</h3>
                    <div className="al-merkle-stats">
                        <span className="al-stat">
                            <strong>{verifiedCount}</strong> Verified
                        </span>
                        <span className="al-stat">
                            <strong>{chainIntegrity.toFixed(0)}%</strong> Integrity
                        </span>
                    </div>
                </div>
                <div className="al-merkle-chain">
                    {merkleChain.map((node, idx) => (
                        <React.Fragment key={node.id}>
                            <div
                                className={`al-merkle-node ${node.status} ${animatingNodeId === node.id ? 'animating' : ''
                                    } ${selectedNode === node.id ? 'selected' : ''}`}
                                onClick={() => setSelectedNode(node.id)}
                                title={node.hash}
                            >
                                <div className="al-merkle-num">#{idx + 1}</div>
                                <div className="al-merkle-hash" title={node.hash}>
                                    {node.hash.substring(0, 16)}...
                                </div>
                                <div
                                    className={`al-merkle-status ${node.status}`}
                                    title={node.timestamp}
                                >
                                    {node.status === 'verified' && '✓'}
                                    {node.status === 'pending' && '⧗'}
                                    {node.status === 'rejected' && '✕'}
                                </div>
                            </div>
                            {idx < merkleChain.length - 1 && (
                                <div className={`al-merkle-connector ${node.status}`}>
                                    <div className="al-connector-arrow">→</div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Event Log Tab */}
            {activeTab === 'events' && (
                <div className="al-content-pane">
                    <div className="al-events-header">
                        <h3>Event Log</h3>
                        <input type="text" placeholder="Search events..." className="al-search-input" />
                    </div>
                    <div className="al-event-list">
                        {auditEntries.length === 0 ? (
                            <div className="al-empty-state">No events recorded</div>
                        ) : (
                            auditEntries.map((entry) => (
                                <div key={entry.id} className={`al-event-row ${entry.status}`}>
                                    <div className="al-event-avatar">
                                        <div className={`al-event-dot ${entry.status}`} />
                                    </div>
                                    <div className="al-event-content">
                                        <div className="al-event-header-row">
                                            <span className="al-event-action">{entry.action}</span>
                                            <span className={`al-event-type ${entry.type}`}>
                                                {entry.type.toUpperCase()}
                                            </span>
                                            <span className="al-event-time">{entry.timestamp}</span>
                                        </div>
                                        <div className="al-event-details">
                                            <span className="al-event-actor">{entry.actor}</span>
                                            <span className="al-separator">→</span>
                                            <span className="al-event-resource">{entry.resource}</span>
                                        </div>
                                        {entry.details && (
                                            <div className="al-event-payload">
                                                <pre>{JSON.stringify(JSON.parse(entry.details), null, 2)}</pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Timeline View Tab */}
            {activeTab === 'timeline' && (
                <div className="al-content-pane">
                    <div className="al-timeline-header">
                        <h3>Temporal Timeline</h3>
                        <div className="al-zoom-controls">
                            {zoomOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    className={`al-zoom-btn ${timelineZoom === opt.value ? 'active' : ''}`}
                                    onClick={() => setTimelineZoom(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="al-timeline-viz">
                        <div className="al-timeline-axis">
                            {/* Access events above axis */}
                            <div className="al-timeline-track al-track-above">
                                <div className="al-track-label">Access Events</div>
                                <svg className="al-timeline-dots" viewBox="0 0 1000 40" preserveAspectRatio="none">
                                    <line x1="0" y1="20" x2="1000" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                    {accessEntries.map((entry, idx) => (
                                        <circle
                                            key={entry.id}
                                            cx={50 + (idx * 950) / Math.max(accessEntries.length - 1, 1)}
                                            cy="20"
                                            r="3"
                                            fill="var(--cy)"
                                            opacity="0.8"
                                        />
                                    ))}
                                </svg>
                            </div>

                            {/* System events below axis */}
                            <div className="al-timeline-track al-track-below">
                                <div className="al-track-label">System Events</div>
                                <svg className="al-timeline-dots" viewBox="0 0 1000 40" preserveAspectRatio="none">
                                    <line x1="0" y1="20" x2="1000" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                    {systemEntries.map((entry, idx) => (
                                        <circle
                                            key={entry.id}
                                            cx={50 + (idx * 950) / Math.max(systemEntries.length - 1, 1)}
                                            cy="20"
                                            r="3"
                                            fill={entry.status === 'failed' ? 'var(--rd)' : 'var(--em)'}
                                            opacity="0.8"
                                        />
                                    ))}
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SIEM Export Tab */}
            {activeTab === 'export' && (
                <div className="al-content-pane">
                    <div className="al-export-header">
                        <h3>Export to SIEM</h3>
                        <p className="al-export-desc">
                            Generate encrypted archive with complete audit trail, merkle proofs, and digital signatures
                        </p>
                    </div>

                    <div className="al-export-card">
                        <div className="al-export-section">
                            <label className="al-export-label">Export Format</label>
                            <div className="al-format-grid">
                                {[
                                    { value: 'json', label: 'JSON', desc: 'Raw JSON events' },
                                    { value: 'cef', label: 'CEF', desc: 'Common Event Format' },
                                    { value: 'syslog', label: 'Syslog', desc: 'RFC 3164' },
                                    { value: 'splunk', label: 'Splunk', desc: 'Splunk HEC format' },
                                ].map((fmt) => (
                                    <button
                                        key={fmt.value}
                                        className={`al-format-option ${exportFormat === fmt.value ? 'active' : ''}`}
                                        onClick={() => setExportFormat(fmt.value)}
                                    >
                                        <div className="al-format-title">{fmt.label}</div>
                                        <div className="al-format-desc">{fmt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="al-export-section">
                            <label className="al-export-label">Options</label>
                            <div className="al-options-list">
                                <label className="al-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.includeHashes}
                                        onChange={(e) =>
                                            setExportOptions({
                                                ...exportOptions,
                                                includeHashes: e.target.checked,
                                            })
                                        }
                                    />
                                    <span className="al-checkbox-label">Include Merkle Hashes</span>
                                </label>
                                <label className="al-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.includeMerkleTree}
                                        onChange={(e) =>
                                            setExportOptions({
                                                ...exportOptions,
                                                includeMerkleTree: e.target.checked,
                                            })
                                        }
                                    />
                                    <span className="al-checkbox-label">Include Chain Tree</span>
                                </label>
                                <label className="al-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.includeTimestamps}
                                        onChange={(e) =>
                                            setExportOptions({
                                                ...exportOptions,
                                                includeTimestamps: e.target.checked,
                                            })
                                        }
                                    />
                                    <span className="al-checkbox-label">Include Timestamps</span>
                                </label>
                            </div>
                        </div>

                        {connectionLatency !== null && (
                            <div className={`al-connection-feedback ${connectionLatency < 100 ? 'success' : 'warning'}`}>
                                <span className="al-feedback-icon">
                                    {connectionLatency < 100 ? '✓' : '⚠'}
                                </span>
                                <span className="al-feedback-text">
                                    Connection latency: {connectionLatency}ms
                                </span>
                            </div>
                        )}

                        <div className="al-export-actions">
                            <button className="al-btn al-btn-secondary" onClick={() => setConnectionLatency(null)}>
                                Test Connection
                            </button>
                            <button className="al-btn al-btn-primary" onClick={handleExport}>
                                Export {exportFormat.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chain Integrity Summary */}
            <div className="al-integrity-footer">
                <div className="al-integrity-item">
                    <div className="al-integrity-label">Chain Status</div>
                    <div className={`al-integrity-badge ${isTampered ? 'alert' : 'safe'}`}>
                        {isTampered ? 'COMPROMISED' : 'VERIFIED'}
                    </div>
                </div>
                <div className="al-integrity-item">
                    <div className="al-integrity-label">Total Blocks</div>
                    <div className="al-integrity-value">{merkleChain.length}</div>
                </div>
                <div className="al-integrity-item">
                    <div className="al-integrity-label">Events</div>
                    <div className="al-integrity-value">{auditEntries.length}</div>
                </div>
                <div className="al-integrity-item">
                    <div className="al-integrity-label">Integrity</div>
                    <div className={`al-integrity-percent ${chainIntegrity > 95 ? 'perfect' : chainIntegrity > 80 ? 'good' : 'warning'}`}>
                        {chainIntegrity.toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* SIEM Export Panel */}
            <div className="al-siem-panel">
                <div className="al-siem-title">SIEM Export</div>

                <div className="al-siem-format-selector">
                    {['json', 'csv', 'syslog', 'cef'].map((fmt) => (
                        <button
                            key={fmt}
                            className={`al-siem-format-btn ${exportFormat === fmt ? 'active' : ''}`}
                            onClick={() => setExportFormat(fmt)}
                        >
                            {fmt.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="al-siem-export-options">
                    <label className="al-siem-checkbox">
                        <input
                            type="checkbox"
                            checked={exportOptions.includeHashes}
                            onChange={(e) =>
                                setExportOptions({
                                    ...exportOptions,
                                    includeHashes: e.target.checked,
                                })
                            }
                        />
                        Include Merkle Hashes
                    </label>
                    <label className="al-siem-checkbox">
                        <input
                            type="checkbox"
                            checked={exportOptions.includeMerkleTree}
                            onChange={(e) =>
                                setExportOptions({
                                    ...exportOptions,
                                    includeMerkleTree: e.target.checked,
                                })
                            }
                        />
                        Include Chain Tree
                    </label>
                    <label className="al-siem-checkbox">
                        <input
                            type="checkbox"
                            checked={exportOptions.includeTimestamps}
                            onChange={(e) =>
                                setExportOptions({
                                    ...exportOptions,
                                    includeTimestamps: e.target.checked,
                                })
                            }
                        />
                        Include Timestamps
                    </label>
                </div>

                <button className="al-siem-export-btn" onClick={handleExport}>
                    Export {exportFormat.toUpperCase()}
                </button>
            </div>

            {/* Run Verify Button with Sequential Glow */}
            <div className="al-verify-section">
                <button
                    className={`al-verify-btn ${verifyingChain ? 'verifying' : ''} ${verifiedNodes.size === merkleChain.length && merkleChain.length > 0 ? 'complete' : ''}`}
                    onClick={performChainVerification}
                    disabled={verifyingChain || merkleChain.length === 0}
                >
                    <span className="al-verify-icon">
                        {verifyingChain ? '⊙' : verifiedNodes.size === merkleChain.length && merkleChain.length > 0 ? '✓' : '▶'}
                    </span>
                    <span className="al-verify-text">
                        {verifyingChain
                            ? `Verifying Chain (${verifiedNodes.size}/${merkleChain.length})`
                            : verifiedNodes.size === merkleChain.length && merkleChain.length > 0
                                ? 'Chain Verified'
                                : 'Run Verification'}
                    </span>
                    {verifyingChain && <span className="al-verify-spinner" />}
                </button>

                <button
                    className={`al-connection-test-btn ${testingConnection ? 'testing' : ''}`}
                    onClick={testBlockchainConnection}
                    disabled={testingConnection}
                >
                    <span className="al-connection-icon">
                        {testingConnection ? '⟳' : connectionLatency && connectionLatency < 100 ? '◆' : '◇'}
                    </span>
                    <span className="al-connection-text">
                        {testingConnection
                            ? 'Testing...'
                            : connectionLatency
                                ? `${connectionLatency}ms`
                                : 'Test Connection'}
                    </span>
                </button>

                {connectionLatency && (
                    <div className={`al-latency-badge ${connectionLatency < 100 ? 'excellent' : connectionLatency < 500 ? 'good' : 'warning'}`}>
                        {connectionLatency < 100 ? '✓ Excellent' : connectionLatency < 500 ? '◐ Good' : '⚠ Slow'}
                    </div>
                )}
            </div>

            {/* Chain Integrity Indicators */}
            <div className="al-chain-integrity">
                <div className="al-integrity-stat">
                    <div className="al-integrity-label">Chain Integrity</div>
                    <div className="al-integrity-value">{chainIntegrity.toFixed(0)}%</div>
                    <div className={`al-integrity-status ${chainIntegrity > 95 ? 'verified' : 'warning'}`}>
                        {chainIntegrity > 95 ? 'Verified' : 'At Risk'}
                    </div>
                </div>

                <div className="al-integrity-stat">
                    <div className="al-integrity-label">Total Blocks</div>
                    <div className="al-integrity-value">{merkleChain.length}</div>
                    <div className="al-integrity-status verified">Active</div>
                </div>

                <div className="al-integrity-stat">
                    <div className="al-integrity-label">Verified</div>
                    <div className="al-integrity-value">{verifiedCount}</div>
                    <div className="al-integrity-status verified">Safe</div>
                </div>

                <div className="al-integrity-stat">
                    <div className="al-integrity-label">Last Check</div>
                    <div className="al-integrity-value text-12px">
                        {auditEntries[0]?.timestamp || 'N/A'}
                    </div>
                    <div className="al-integrity-status verified">Now</div>
                </div>
            </div>
        </div>
    )
}

export default AuditLedger
