import React, { useState, useEffect } from 'react'
import { Card, Button, Badge, DataGrid, Modal, Select, Collapse } from '@/components/ui'
import useUiStore from '@/store/useUiStore'
import AuditLedger from '@/components/pages/AuditLedger'
import '../../styles/audit-ledger.css'

interface MerkleNode {
    id: string
    hash: string
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

const generateHash = (input: string): string => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 16; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
};

const initialBlocks: AuditBlock[] = [
    {
        id: 'blk-0',
        index: 0,
        timestamp: '2024-01-20T08:00:00Z',
        action: 'GENESIS',
        actor: 'system',
        resource: 'chain-init',
        hash: '00000000000000000000000000000000',
        previousHash: '',
        verified: true
    },
    {
        id: 'blk-1',
        index: 1,
        timestamp: '2024-01-20T08:15:00Z',
        action: 'FILE_UPLOAD',
        actor: 'admin@aegis.io',
        resource: 'financial_2024.pdf',
        hash: generateHash('blk1-data'),
        previousHash: '00000000000000000000000000000000',
        verified: true
    },
    {
        id: 'blk-2',
        index: 2,
        timestamp: '2024-01-20T08:30:00Z',
        action: 'SHARE_GRANT',
        actor: 'admin@aegis.io',
        resource: 'financial_2024.pdf',
        hash: generateHash('blk2-data'),
        previousHash: generateHash('blk1-data'),
        verified: true
    },
    {
        id: 'blk-3',
        index: 3,
        timestamp: '2024-01-20T08:45:00Z',
        action: 'KEY_ROTATION',
        actor: 'security-service',
        resource: 'dek-vault-001',
        hash: generateHash('blk3-data'),
        previousHash: generateHash('blk2-data'),
        verified: false
    },
    {
        id: 'blk-4',
        index: 4,
        timestamp: '2024-01-20T09:00:00Z',
        action: 'COMPLIANCE_CHECK',
        actor: 'audit-bot',
        resource: 'soc2-controls',
        hash: generateHash('blk4-data'),
        previousHash: generateHash('blk3-data'),
        verified: false
    }
];

const auditEvents: AuditEvent[] = [
    {
        id: 'evt-1',
        timestamp: new Date('2024-01-20T08:00:00Z'),
        type: 'create',
        actor: 'system',
        resource: 'chain-init',
        details: 'Merkle chain initialized',
        severity: 'info'
    },
    {
        id: 'evt-2',
        timestamp: new Date('2024-01-20T08:15:00Z'),
        type: 'create',
        actor: 'admin@aegis.io',
        resource: 'financial_2024.pdf',
        details: 'Document uploaded to secure vault',
        severity: 'info'
    },
    {
        id: 'evt-3',
        timestamp: new Date('2024-01-20T08:30:00Z'),
        type: 'share',
        actor: 'admin@aegis.io',
        resource: 'financial_2024.pdf',
        details: 'Shared with finance-team (3 users)',
        severity: 'warning'
    },
    {
        id: 'evt-4',
        timestamp: new Date('2024-01-20T08:45:00Z'),
        type: 'update',
        actor: 'security-service',
        resource: 'dek-vault-001',
        details: 'DEK rotated due to schedule',
        severity: 'info'
    },
    {
        id: 'evt-5',
        timestamp: new Date('2024-01-20T09:00:00Z'),
        type: 'verify',
        actor: 'audit-bot',
        resource: 'soc2-controls',
        details: 'Compliance verification completed',
        severity: 'info'
    },
    {
        id: 'evt-6',
        timestamp: new Date('2024-01-20T09:15:00Z'),
        type: 'read',
        actor: 'analyst@aegis.io',
        resource: 'financial_2024.pdf',
        details: 'Document accessed for review',
        severity: 'warning'
    },
    {
        id: 'evt-7',
        timestamp: new Date('2024-01-20T09:30:00Z'),
        type: 'delete',
        actor: 'admin@aegis.io',
        resource: 'temp_backup.zip',
        details: 'Temporary file permanently deleted (WORM: immutable log retained)',
        severity: 'critical'
    }
];

const siemConnections: SIEMConnection[] = [
    {
        id: 'siem-1',
        name: 'Splunk Enterprise',
        protocol: 'https',
        endpoint: 'splunk.company.com',
        port: 8089,
        status: 'connected',
        lastSync: '2024-01-20T09:28:00Z'
    },
    {
        id: 'siem-2',
        name: 'ELK Stack',
        protocol: 'tcp',
        endpoint: 'elasticsearch.internal',
        port: 9200,
        status: 'disconnected',
        lastSync: '2024-01-20T08:15:00Z'
    }
];

function AuditLedger() {
    const { activeTab, setActiveTab } = useUiStore()
    const [blocks, setBlocks] = useState<AuditBlock[]>(initialBlocks);
    const [selectedBlock, setSelectedBlock] = useState<AuditBlock | null>(null);
    const [timelineZoom, setTimelineZoom] = useState(1);
    const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'syslog'>('json');
    const [siemConnections, setSiemConnections] = useState<SIEMConnection[]>([]);
    const [testingConnection, setTestingConnection] = useState<string | null>(null);

    const blockColumns: TableColumn<AuditBlock>[] = [
        { key: 'index', label: 'Index', width: 70 },
        { key: 'timestamp', label: 'Timestamp', width: 160, render: (val) => new Date(val).toLocaleTimeString() },
        { key: 'action', label: 'Action', width: 120 },
        { key: 'actor', label: 'Actor', width: 140 },
        { key: 'resource', label: 'Resource', flex: 1 },
        {
            key: 'verified', label: 'Verified', width: 90, render: (val) => (
                <Badge severity={val ? 'success' : 'warning'}>{val ? '✓' : 'Pending'}</Badge>
            )
        },
    ]

    const handleVerifyBlock = (blockId: string) => {
        setBlocks(blocks.map(b => {
            if (b.id === blockId) {
                return { ...b, isVerifying: true };
            }
            return b;
        }));

        setTimeout(() => {
            setBlocks(blocks.map(b => {
                if (b.id === blockId) {
                    return { ...b, verified: true, isVerifying: false };
                }
                return b;
            }));
        }, 1500);
    };

    const handleTestConnection = (connectionId: string) => {
        setTestingConnection(connectionId);
        setTimeout(() => {
            setSiemConnections(siemConnections.map(conn => {
                if (conn.id === connectionId) {
                    return { ...conn, status: 'connected', lastSync: new Date().toISOString() };
                }
                return conn;
            }));
            setTestingConnection(null);
        }, 2000);
    };

    const handleExport = () => {
        let content = '';
        let filename = '';

        if (exportFormat === 'json') {
            content = JSON.stringify(blocks, null, 2);
            filename = 'audit-chain.json';
        } else if (exportFormat === 'csv') {
            const headers = ['Index', 'Timestamp', 'Action', 'Actor', 'Resource', 'Hash', 'Verified'];
            const rows = blocks.map(b => [
                b.index,
                b.timestamp,
                b.action,
                b.actor,
                b.resource,
                b.hash,
                b.verified ? 'Yes' : 'No'
            ]);
            content = [headers, ...rows].map(row => row.join(',')).join('\n');
            filename = 'audit-chain.csv';
        } else if (exportFormat === 'syslog') {
            content = blocks.map(b =>
                `<INFO> AegisShare[audit]: [${b.timestamp}] Action=${b.action} Actor=${b.actor} Resource=${b.resource} Hash=${b.hash}`
            ).join('\n');
            filename = 'audit-chain.log';
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="audit-ledger">
            <div className="al-header">
                <h1 className="al-breadcrumb">Audit Ledger</h1>
                <div className="al-tabs">
                    <button
                        className={`al-tab ${activeTab === 'chain' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chain')}
                    >
                        Chain
                    </button>
                    <button
                        className={`al-tab ${activeTab === 'timeline' ? 'active' : ''}`}
                        onClick={() => setActiveTab('timeline')}
                    >
                        Timeline
                    </button>
                    <button
                        className={`al-tab ${activeTab === 'export' ? 'active' : ''}`}
                        onClick={() => setActiveTab('export')}
                    >
                        Export
                    </button>
                </div>
            </div>

            {activeTab === 'chain' && (
                <div className="al-chain">
                    <div className="al-section">
                        <div className="al-section-header">
                            <h3>Merkle Chain Verification</h3>
                            <span className="al-stat">{blocks.filter(b => b.verified).length} / {blocks.length} verified</span>
                        </div>

                        <div className="al-chain-strip">
                            {blocks.map((block, idx) => (
                                <div key={block.id} className="al-chain-item">
                                    <div
                                        className={`al-block ${block.verified ? 'verified' : 'unverified'} ${block.isVerifying ? 'verifying' : ''}`}
                                        onClick={() => setSelectedBlock(block)}
                                    >
                                        <div className="al-block-index">#{block.index}</div>
                                        <div className="al-block-action">{block.action.substring(0, 8)}</div>
                                        <div className="al-block-status">
                                            {block.verified && <span className="al-badge-verified">✓</span>}
                                            {!block.verified && !block.isVerifying && <span className="al-badge-unverified">⧖</span>}
                                            {block.isVerifying && <span className="al-badge-verifying">○</span>}
                                        </div>
                                    </div>

                                    {idx < blocks.length - 1 && (
                                        <div className={`al-chain-link ${blocks[idx + 1].verified ? 'verified' : 'unverified'}`}></div>
                                    )}

                                    {/* Block clicked - show modal instead */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'timeline' && (
                <div className="al-timeline">
                    <div className="al-section">
                        <div className="al-section-header">
                            <h3>Event Timeline</h3>
                            <div className="al-zoom-control">
                                <label>Zoom</label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.25"
                                    value={timelineZoom}
                                    onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
                                    className="al-zoom-slider"
                                />
                                <span className="al-zoom-value">{(timelineZoom * 100).toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="al-timeline-container" style={{ '--zoom': timelineZoom } as React.CSSProperties}>
                            <div className="al-timeline-axis">
                                <div className="al-timeline-ruler">
                                    {Array.from({ length: 7 }).map((_, i) => {
                                        const date = new Date('2024-01-20T08:00:00Z');
                                        date.setHours(date.getHours() + i * 1);
                                        return (
                                            <div key={i} className="al-ruler-mark">
                                                <div className="al-mark-line"></div>
                                                <div className="al-mark-label">{date.getHours().toString().padStart(2, '0')}:00</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="al-timeline-events">
                                <svg width="100%" height="100%" className="al-timeline-svg">
                                    <line x1="0" y1="50%" x2="100%" y2="50%" className="al-timeline-baseline" />
                                    {auditEvents.map((evt, idx) => {
                                        const hours = evt.timestamp.getHours();
                                        const baseWidth = 1200;
                                        const xPos = (hours * baseWidth) / 24 + 150;
                                        return (
                                            <g key={evt.id}>
                                                <circle cx={xPos} cy="50%" r="6" className={`al-event-dot al-event-${evt.severity}`} />
                                            </g>
                                        );
                                    })}
                                </svg>

                                <div className="al-events-list">
                                    {auditEvents.map((evt, idx) => (
                                        <div key={evt.id} className={`al-event-row al-event-${evt.severity}`}>
                                            <div className="al-event-time">
                                                {evt.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="al-event-type">
                                                <span className="al-event-badge">{evt.type.toUpperCase()}</span>
                                            </div>
                                            <div className="al-event-actor">
                                                <code>{evt.actor}</code>
                                            </div>
                                            <div className="al-event-details">{evt.details}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'export' && (
                <div className="al-export">
                    <div className="al-section">
                        <div className="al-section-header">
                            <h3>Export & SIEM Integration</h3>
                        </div>

                        <div className="al-export-grid">
                            <div className="al-export-panel">
                                <h5>Export Format</h5>
                                <div className="al-format-options">
                                    {(['json', 'csv', 'syslog'] as const).map((fmt) => (
                                        <label key={fmt} className="al-radio-label">
                                            <input
                                                type="radio"
                                                name="format"
                                                value={fmt}
                                                checked={exportFormat === fmt}
                                                onChange={(e) => setExportFormat(e.target.value as typeof fmt)}
                                            />
                                            <span>
                                                {fmt.toUpperCase()}
                                                <br />
                                                <small>
                                                    {fmt === 'json' && 'Structured JSON format'}
                                                    {fmt === 'csv' && 'Comma-separated values'}
                                                    {fmt === 'syslog' && 'RFC 3164 syslog format'}
                                                </small>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <button onClick={handleExport} className="al-btn al-btn-primary al-btn-lg">
                                    Download Export
                                </button>
                            </div>

                            <div className="al-siem-panel">
                                <h5>SIEM Connections</h5>
                                <div className="al-siem-list">
                                    {siemConnections.map((conn) => (
                                        <div key={conn.id} className="al-siem-card">
                                            <div className="al-siem-header">
                                                <div className="al-siem-info">
                                                    <h6>{conn.name}</h6>
                                                    <span className={`al-status-badge al-status-${conn.status}`}>
                                                        {conn.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="al-siem-details">
                                                <div className="al-detail-line">
                                                    <label>Protocol</label>
                                                    <code>{conn.protocol.toUpperCase()}</code>
                                                </div>
                                                <div className="al-detail-line">
                                                    <label>Endpoint</label>
                                                    <code>{conn.endpoint}:{conn.port}</code>
                                                </div>
                                                <div className="al-detail-line">
                                                    <label>Last Sync</label>
                                                    <code>{new Date(conn.lastSync).toLocaleString()}</code>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleTestConnection(conn.id)}
                                                disabled={testingConnection === conn.id}
                                                className="al-btn al-btn-sm"
                                            >
                                                {testingConnection === conn.id ? 'Testing...' : 'Test Connection'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Block Details Modal */}
            <Modal isOpen={!!selectedBlock} onClose={() => setSelectedBlock(null)} title="Block Details">
                {selectedBlock && (
                    <div className="space-y-4">
                        <Collapse title="Block Information" defaultOpen>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="font-semibold">Index:</span><code>#{selectedBlock.index}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Action:</span><code>{selectedBlock.action}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Timestamp:</span><code>{selectedBlock.timestamp}</code></div>
                            </div>
                        </Collapse>
                        <Collapse title="Identity & Resources">
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="font-semibold">Actor:</span><code>{selectedBlock.actor}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Resource:</span><code>{selectedBlock.resource}</code></div>
                            </div>
                        </Collapse>
                        <Collapse title="Cryptographic Proof">
                            <div className="space-y-2">
                                <div><span className="font-semibold">Block Hash:</span><br /><code className="text-xs break-all">{selectedBlock.hash}</code></div>
                                <div><span className="font-semibold">Previous Hash:</span><br /><code className="text-xs break-all">{selectedBlock.previousHash || 'GENESIS'}</code></div>
                            </div>
                        </Collapse>
                        <div className="flex gap-2 mt-4">
                            {!selectedBlock.verified && !selectedBlock.isVerifying && (
                                <button onClick={() => handleVerifyBlock(selectedBlock.id)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Verify Block
                                </button>
                            )}
                            {selectedBlock.isVerifying && <span className="text-yellow-600">Verifying...</span>}
                            {selectedBlock.verified && <span className="text-green-600 font-semibold">✓ Verified</span>}
                        </div>
                    </div>
                )}
            </Modal>        </div>
    );
}

const EventLog: React.FC = () => {
    // Mock data - replace with actual hook if available
    const events: any[] = [];
    const loading = false;

    if (loading) {
        return (
            <Card>
                <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border border-t-em border-bd mx-auto mb-2" />
                    <p className="text-sm text-t2">Loading audit events...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">Event Log ({events?.length || 0} total)</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-bd bg-s2">
                            <th className="text-left py-2 px-2 text-t2">Timestamp</th>
                            <th className="text-left py-2 px-2 text-t2">Type</th>
                            <th className="text-left py-2 px-2 text-t2">Actor</th>
                            <th className="text-left py-2 px-2 text-t2">Risk</th>
                            <th className="text-left py-2 px-2 text-t2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events?.map((event: AuditEvent) => (
                            <tr key={event.seq} className="border-b border-bd hover:bg-s1">
                                <td className="py-2 px-2 text-t3 font-mono">{new Date(event.timestamp).toLocaleString()}</td>
                                <td className="py-2 px-2 font-mono text-cy">{event.eventType}</td>
                                <td className="py-2 px-2 text-t0">{event.user || 'System'}</td>
                                <td className="py-2 px-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${event.risk === 'high' ? 'bg-rd/20 text-rd' :
                                        event.risk === 'medium' ? 'bg-or/20 text-or' :
                                            'bg-em/20 text-em'
                                        }`}>
                                        {String(event.risk)?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-2 px-2">
                                    <span className={event.verified ? 'text-em' : 'text-t3'}>
                                        {event.verified ? '✓' : '○'} VERIFIED
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const SignedReports: React.FC = () => {
    const [format, setFormat] = React.useState<'pdf' | 'csv'>('pdf')
    const [period, setPeriod] = React.useState('30')

    const handleExport = async () => {
        // This would call auditService.exportReport({ period, format })
        console.log(`Exporting ${period} day report as ${format}`)
    }

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">Export Reports</h3>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-t3 mb-1 block">Period</label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            aria-label="Report Period"
                            className="w-full px-2 py-1.5 bg-s2 border border-bd rounded text-xs text-t0"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-t3 mb-1 block">Format</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value as 'pdf' | 'csv')}
                            aria-label="Export Format"
                            className="w-full px-2 py-1.5 bg-s2 border border-bd rounded text-xs text-t0"
                        >
                            <option value="pdf">PDF</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                </div>
                <Button onClick={handleExport} className="w-full">
                    ↓ Export Report
                </Button>
            </div>
        </Card>
    )
}

const AuditChain: React.FC = () => {
    const { activeTab, setActiveTab } = useUiStore()

    // Simple Tab switcher instead of using Tabs component
    return (
        <div>
            <h1 className="text-3xl font-bold text-t0 mb-6">Audit Chain & Compliance</h1>
            <div className="flex gap-2 mb-6 border-b border-s2">
                {[
                    { id: 'merkle', label: 'Merkle Chain' },
                    { id: 'log', label: 'Event Log' },
                    { id: 'reports', label: 'Signed Reports' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 border-b-2 ${activeTab === tab.id ? 'border-cy text-cy' : 'border-transparent text-t2'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-6 space-y-4">
                {activeTab === 'merkle' && <div className="p-4 bg-s1 rounded"><p className="text-t2">Merkle Chain View (Coming Soon)</p></div>}
                {activeTab === 'log' && <EventLog />}
                {activeTab === 'reports' && <div className="p-4 bg-s1 rounded"><p className="text-t2">Signed Reports (Coming Soon)</p></div>}
            </div>
        </div>
    )
}

export default AuditChain
