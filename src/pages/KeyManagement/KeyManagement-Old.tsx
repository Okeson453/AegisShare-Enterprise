// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Toggle, Modal, Collapse, DataGrid } from '@/components/ui';
import useUiStore from '@/store/useUiStore';
import '../../styles/key-management.css';

interface KeyNode {
    id: string;
    name: string;
    type: 'root' | 'intermediate' | 'leaf';
    status: 'healthy' | 'expiring' | 'compromised';
    expiresAt: string;
    algorithm: string;
    keyLength: number;
    usage: string;
    children?: string[];
}

interface HSMTelemetry {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'warning' | 'standby';
    uptime: number;
    latency: number;
    utilizationPercent: number;
    operationsPerSecond: number;
    temperature: number;
    failoverReady: boolean;
}

interface TopologyNode {
    id: string;
    name: string;
    region: string;
    status: 'active' | 'standby' | 'offline';
    keys: number;
    failoverTime: number;
}

interface RotationEvent {
    id: string;
    keyId: string;
    keyName: string;
    scheduledStart: Date;
    scheduledEnd: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    eta?: number;
}

const keyHierarchy: KeyNode[] = [
    {
        id: 'kek-root',
        name: 'Root KEK',
        type: 'root',
        status: 'healthy',
        expiresAt: '2026-12-20',
        algorithm: 'RSA-4096',
        keyLength: 4096,
        usage: 'Key Encryption',
        children: ['kek-prod', 'kek-staging']
    },
    {
        id: 'kek-prod',
        name: 'Production KEK',
        type: 'intermediate',
        status: 'healthy',
        expiresAt: '2025-06-15',
        algorithm: 'RSA-2048',
        keyLength: 2048,
        usage: 'Prod DEK Wrapping',
        children: ['dek-vault', 'dek-share', 'dek-audit']
    },
    {
        id: 'kek-staging',
        name: 'Staging KEK',
        type: 'intermediate',
        status: 'healthy',
        expiresAt: '2025-08-20',
        algorithm: 'RSA-2048',
        keyLength: 2048,
        usage: 'Staging DEK Wrapping',
        children: []
    },
    {
        id: 'dek-vault',
        name: 'Vault DEK',
        type: 'leaf',
        status: 'healthy',
        expiresAt: '2024-06-20',
        algorithm: 'AES-256',
        keyLength: 256,
        usage: 'File Encryption',
        children: []
    },
    {
        id: 'dek-share',
        name: 'Share DEK',
        type: 'leaf',
        status: 'expiring',
        expiresAt: '2024-04-15',
        algorithm: 'AES-256',
        keyLength: 256,
        usage: 'Share Encryption',
        children: []
    },
    {
        id: 'dek-audit',
        name: 'Audit DEK',
        type: 'leaf',
        status: 'healthy',
        expiresAt: '2025-02-10',
        algorithm: 'AES-256',
        keyLength: 256,
        usage: 'Log Encryption',
        children: []
    }
];

const hsmData: HSMTelemetry[] = [
    {
        id: 'hsm-1',
        name: 'HSM-PROD-01',
        status: 'online',
        uptime: 99.98,
        latency: 2.3,
        utilizationPercent: 45,
        operationsPerSecond: 15420,
        temperature: 38,
        failoverReady: true
    },
    {
        id: 'hsm-2',
        name: 'HSM-PROD-02',
        status: 'online',
        uptime: 99.95,
        latency: 2.5,
        utilizationPercent: 48,
        operationsPerSecond: 16200,
        temperature: 41,
        failoverReady: true
    },
    {
        id: 'hsm-3',
        name: 'HSM-DR-01',
        status: 'standby',
        uptime: 98.50,
        latency: 125.8,
        utilizationPercent: 12,
        operationsPerSecond: 3200,
        temperature: 35,
        failoverReady: true
    }
];

const topologyNodes: TopologyNode[] = [
    {
        id: 'topo-us-east',
        name: 'US-East (Primary)',
        region: 'us-east-1',
        status: 'active',
        keys: 3,
        failoverTime: 0
    },
    {
        id: 'topo-us-west',
        name: 'US-West (Secondary)',
        region: 'us-west-2',
        status: 'active',
        keys: 3,
        failoverTime: 2
    },
    {
        id: 'topo-eu',
        name: 'EU (DR)',
        region: 'eu-west-1',
        status: 'standby',
        keys: 3,
        failoverTime: 15
    }
];

const rotationSchedule: RotationEvent[] = [
    {
        id: 'rot-1',
        keyId: 'kek-prod',
        keyName: 'Production KEK',
        scheduledStart: new Date('2024-02-01T02:00:00Z'),
        scheduledEnd: new Date('2024-02-01T04:00:00Z'),
        status: 'completed'
    },
    {
        id: 'rot-2',
        keyId: 'dek-share',
        keyName: 'Share DEK',
        scheduledStart: new Date('2024-02-05T02:00:00Z'),
        scheduledEnd: new Date('2024-02-05T03:00:00Z'),
        status: 'in-progress',
        eta: 30
    },
    {
        id: 'rot-3',
        keyId: 'dek-vault',
        keyName: 'Vault DEK',
        scheduledStart: new Date('2024-02-10T02:00:00Z'),
        scheduledEnd: new Date('2024-02-10T03:00:00Z'),
        status: 'pending'
    },
    {
        id: 'rot-4',
        keyId: 'dek-audit',
        keyName: 'Audit DEK',
        scheduledStart: new Date('2024-02-15T02:00:00Z'),
        scheduledEnd: new Date('2024-02-15T03:00:00Z'),
        status: 'pending'
    },
    {
        id: 'rot-5',
        keyId: 'kek-staging',
        keyName: 'Staging KEK',
        scheduledStart: new Date('2024-03-01T02:00:00Z'),
        scheduledEnd: new Date('2024-03-01T04:00:00Z'),
        status: 'pending'
    }
];

function KeyManagementComponent() {
    const { activeTab, setActiveTab } = useUiStore();
    const [expandedKeyId, setExpandedKeyId] = useState<string | null>('kek-root');
    const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(topologyNodes[0]);
    const [rotations, setRotations] = useState<RotationEvent[]>(rotationSchedule);
    const [selectedKey, setSelectedKey] = useState<KeyNode | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotations(prev => prev.map(rot => {
                if (rot.status === 'in-progress' && rot.eta && rot.eta > 0) {
                    return { ...rot, eta: rot.eta - 1 };
                }
                return rot;
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const renderKeyTree = (parentId: string | null, depth: number = 0): JSX.Element[] => {
        const children = parentId
            ? keyHierarchy.filter(k => k.children?.includes(parentId))[0]?.children || []
            : [keyHierarchy[0].id];

        return children.map(keyId => {
            const node = keyHierarchy.find(k => k.id === keyId);
            if (!node) return null;

            const hasChildren = node.children && node.children.length > 0;
            const isExpanded = expandedKeyId === node.id;

            return (
                <div key={node.id} className={`km-tree-item km-depth-${depth}`}>
                    <div
                        className={`km-tree-node ${node.status}`}
                        onClick={() => {
                            setExpandedKeyId(isExpanded ? null : node.id);
                            setSelectedKey(node);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {hasChildren && <span className="km-expand-icon">{isExpanded ? '▼' : '▶'}</span>}
                        {!hasChildren && <span className="km-expand-icon-empty">•</span>}
                        <span className="km-node-icon">🔑</span>
                        <span className="km-node-name">{node.name}</span>
                        <span className={`km-status-dot km-status-${node.status}`}></span>
                    </div>

                    {isExpanded && (
                        <div className="km-node-details">
                            <div className="km-detail-row">
                                <label>Type</label>
                                <code>{node.type.toUpperCase()}</code>
                            </div>
                            <div className="km-detail-row">
                                <label>Algorithm</label>
                                <code>{node.algorithm}</code>
                            </div>
                            <div className="km-detail-row">
                                <label>Key Length</label>
                                <code>{node.keyLength} bits</code>
                            </div>
                            <div className="km-detail-row">
                                <label>Usage</label>
                                <code>{node.usage}</code>
                            </div>
                            <div className="km-detail-row">
                                <label>Expires</label>
                                <code>{new Date(node.expiresAt).toLocaleDateString()}</code>
                            </div>
                        </div>
                    )}

                    {hasChildren && isExpanded && (
                        <div className="km-tree-children">
                            {renderKeyTree(node.id, depth + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="key-management">
            <div className="km-header">
                <h1 className="km-breadcrumb">Key Management</h1>
                <div className="km-tabs">
                    <button
                        className={`km-tab ${activeTab === 'hierarchy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hierarchy')}
                    >
                        Hierarchy
                    </button>
                    <button
                        className={`km-tab ${activeTab === 'hsm' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hsm')}
                    >
                        HSM
                    </button>
                    <button
                        className={`km-tab ${activeTab === 'topology' ? 'active' : ''}`}
                        onClick={() => setActiveTab('topology')}
                    >
                        Topology
                    </button>
                    <button
                        className={`km-tab ${activeTab === 'rotation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rotation')}
                    >
                        Rotation
                    </button>
                </div>
            </div>

            {activeTab === 'hierarchy' && (
                <div className="km-section">
                    <div className="km-section-header">
                        <h3>Key Hierarchy Tree</h3>
                        <span className="km-stat">{keyHierarchy.length} keys</span>
                    </div>
                    <div className="km-tree">
                        {renderKeyTree(null)}
                    </div>
                </div>
            )}

            {activeTab === 'hsm' && (
                <div className="km-section">
                    <div className="km-section-header">
                        <h3>HSM Telemetry</h3>
                        <span className="km-stat">{hsmData.filter(h => h.status === 'online').length} online</span>
                    </div>
                    <div className="km-hsm-grid">
                        {hsmData.map(hsm => (
                            <div key={hsm.id} className={`km-hsm-card km-hsm-${hsm.status}`}>
                                <div className="km-hsm-header">
                                    <h4>{hsm.name}</h4>
                                    <span className={`km-status-badge km-status-${hsm.status}`}>{hsm.status}</span>
                                </div>
                                <div className="km-hsm-metrics">
                                    <div className="km-metric">
                                        <label>Uptime</label>
                                        <div className="km-metric-value">{hsm.uptime.toFixed(2)}%</div>
                                    </div>
                                    <div className="km-metric">
                                        <label>Latency</label>
                                        <div className="km-metric-value">{hsm.latency.toFixed(1)}ms</div>
                                    </div>
                                    <div className="km-metric">
                                        <label>Utilization</label>
                                        <div className="km-metric-bar">
                                            <div
                                                className="km-metric-fill"
                                                style={{ width: `${hsm.utilizationPercent}%` }}
                                            ></div>
                                        </div>
                                        <div className="km-metric-pct">{hsm.utilizationPercent}%</div>
                                    </div>
                                    <div className="km-metric">
                                        <label>Ops/sec</label>
                                        <div className="km-metric-value">{(hsm.operationsPerSecond / 1000).toFixed(1)}K</div>
                                    </div>
                                    <div className="km-metric">
                                        <label>Temperature</label>
                                        <div className="km-metric-value">{hsm.temperature}°C</div>
                                    </div>
                                </div>
                                <div className="km-hsm-footer">
                                    {hsm.failoverReady && <span className="km-failover-badge">✓ Failover Ready</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'topology' && (
                <div className="km-section">
                    <div className="km-section-header">
                        <h3>Key Topology</h3>
                        <span className="km-stat">{topologyNodes.filter(n => n.status === 'active').length} active regions</span>
                    </div>
                    <div className="km-topology-grid">
                        <div className="km-topology-diagram">
                            {topologyNodes.map((node, idx) => (
                                <div key={node.id} className={`km-topo-node km-topo-${node.status}`}>
                                    <div className="km-topo-region">{node.region}</div>
                                    <div className="km-topo-name">{node.name}</div>
                                    <div className="km-topo-keys">{node.keys} keys</div>
                                    {idx > 0 && (
                                        <div className="km-failover-info">
                                            <span className="km-failover-time">{node.failoverTime}s failover</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {selectedNode && (
                            <div className="km-topology-details">
                                <h5>Region Details</h5>
                                <div className="km-detail-row">
                                    <label>Region</label>
                                    <code>{selectedNode.region}</code>
                                </div>
                                <div className="km-detail-row">
                                    <label>Status</label>
                                    <span className={`km-status-badge km-status-${selectedNode.status}`}>
                                        {selectedNode.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="km-detail-row">
                                    <label>Keys Stored</label>
                                    <code>{selectedNode.keys}</code>
                                </div>
                                <div className="km-detail-row">
                                    <label>Failover Time</label>
                                    <code>{selectedNode.failoverTime === 0 ? 'Primary' : `${selectedNode.failoverTime}s`}</code>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'rotation' && (
                <div className="km-section">
                    <div className="km-section-header">
                        <h3>Key Rotation Schedule (Gantt)</h3>
                        <span className="km-stat">{rotations.length} rotation events</span>
                    </div>
                    <div className="km-gantt">
                        <div className="km-gantt-timeline">
                            {Array.from({ length: 30 }).map((_, i) => {
                                const date = new Date('2024-02-01');
                                date.setDate(date.getDate() + i);
                                return (
                                    <div
                                        key={i}
                                        className="km-gantt-day"
                                        title={date.toLocaleDateString()}
                                    >
                                        {i % 5 === 0 ? date.getDate() : ''}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="km-gantt-bars">
                            {rotations.map(rot => {
                                const startDate = new Date('2024-02-01');
                                const rotStart = rot.scheduledStart.getDate() - 1;
                                const rotDays = Math.ceil(
                                    (rot.scheduledEnd.getTime() - rot.scheduledStart.getTime()) / (1000 * 60 * 60 * 24)
                                );

                                return (
                                    <div key={rot.id} className="km-gantt-row">
                                        <div className="km-gantt-label">
                                            <span className="km-gantt-key">{rot.keyName}</span>
                                            <span className={`km-gantt-status km-gantt-${rot.status}`}>
                                                {rot.status}
                                                {rot.eta && rot.status === 'in-progress' && ` (${rot.eta}s)`}
                                            </span>
                                        </div>
                                        <div className="km-gantt-bar-container">
                                            <div
                                                className={`km-gantt-bar km-gantt-${rot.status}`}
                                                style={{
                                                    marginLeft: `${rotStart * 33}px`,
                                                    width: `${Math.max(rotDays * 33, 20)}px`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Key Details Modal */}
            <Modal isOpen={!!selectedKey} onClose={() => setSelectedKey(null)} title={selectedKey?.name || 'Key Details'}>
                {selectedKey && (
                    <div className="space-y-4">
                        <Collapse title="Key Information" defaultOpen>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="font-semibold">ID:</span><code className="text-xs">{selectedKey.id}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Type:</span><code>{selectedKey.type.toUpperCase()}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Status:</span><Badge severity={selectedKey.status === 'healthy' ? 'success' : selectedKey.status === 'expiring' ? 'warning' : 'critical'}>{selectedKey.status}</Badge></div>
                            </div>
                        </Collapse>
                        <Collapse title="Cryptographic Details">
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="font-semibold">Algorithm:</span><code>{selectedKey.algorithm}</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Key Length:</span><code>{selectedKey.keyLength} bits</code></div>
                                <div className="flex justify-between"><span className="font-semibold">Usage:</span><code>{selectedKey.usage}</code></div>
                            </div>
                        </Collapse>
                        <Collapse title="Lifecycle">
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="font-semibold">Expires:</span><code>{selectedKey.expiresAt}</code></div>
                                {selectedKey.children && selectedKey.children.length > 0 && (
                                    <div><span className="font-semibold">Child Keys:</span><br /><code className="text-xs">{selectedKey.children.join(', ')}</code></div>
                                )}
                            </div>
                        </Collapse>
                    </div>
                )}
            </Modal>
        </div>
    );
}

const HsmStatus: React.FC = () => {
    const { hsmClusters, loading } = useKeys()

    if (loading) {
        return (
            <Card>
                <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border border-t-em border-bd mx-auto mb-2" />
                    <p className="text-sm text-t2">Loading HSM status...</p>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            {hsmClusters?.map((cluster) => (
                <Card key={cluster.id}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${cluster.status === 'OPERATIONAL' ? 'bg-em' :
                                    cluster.status === 'DEGRADED' ? 'bg-ye' : 'bg-rd'
                                    }`} />
                                <h4 className="font-semibold text-t0">{cluster.name}</h4>
                                <span className="ml-auto text-xs font-mono text-t3">{cluster.region}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                    <p className="text-t3">Status</p>
                                    <p className="text-t0 font-semibold mt-1">{cluster.status}</p>
                                </div>
                                <div>
                                    <p className="text-t3">Keys</p>
                                    <p className="text-cy font-mono font-semibold mt-1">{cluster.keyCount} / {cluster.capacity}</p>
                                </div>
                                <div>
                                    <p className="text-t3">Type</p>
                                    <p className="text-t0 font-semibold mt-1">{cluster.type}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

const RotationSchedule: React.FC = () => {
    const { rotationSchedule, loading, triggerRotation } = useKeys()
    const [triggeringId, setTriggeringId] = React.useState<string | null>(null)

    const handleRotate = async (keyId: string) => {
        setTriggeringId(keyId)
        try {
            await triggerRotation(keyId)
        } finally {
            setTriggeringId(null)
        }
    }

    if (loading) {
        return (
            <Card>
                <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border border-t-em border-bd mx-auto mb-2" />
                    <p className="text-sm text-t2">Loading rotation schedule...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">Rotation Schedule</h3>
            {!rotationSchedule || rotationSchedule.length === 0 ? (
                <p className="text-sm text-t2">No rotations scheduled</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-bd bg-s2">
                                <th className="text-left py-2 px-2 text-t2">Key ID</th>
                                <th className="text-left py-2 px-2 text-t2">Type</th>
                                <th className="text-left py-2 px-2 text-t2">Scheduled Date</th>
                                <th className="text-left py-2 px-2 text-t2">Status</th>
                                <th className="text-right py-2 px-2 text-t2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rotationSchedule.map((entry) => (
                                <tr key={entry.keyId} className="border-b border-bd hover:bg-s1">
                                    <td className="py-2 px-2 font-mono text-cy">{entry.keyId}</td>
                                    <td className="py-2 px-2 font-mono">{entry.keyType}</td>
                                    <td className="py-2 px-2">{new Date(entry.scheduledDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${entry.status === 'PENDING' ? 'bg-ye/20 text-ye' :
                                            entry.status === 'IN_PROGRESS' ? 'bg-cy/20 text-cy' :
                                                'bg-em/20 text-em'
                                            }`}>
                                            {entry.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRotate(entry.keyId)}
                                            disabled={triggeringId === entry.keyId || entry.status !== 'PENDING'}
                                            className="text-sm"
                                        >
                                            {triggeringId === entry.keyId ? '⟳' : '▶'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    )
}

const KeyManagement: React.FC = () => {
    const { activeTab, setActiveTab } = useUiStore()

    return (
        <div>
            <h1 className="text-3xl font-bold text-t0 mb-6">Key Management</h1>
            <Tabs
                items={[
                    { id: 'hierarchy', label: 'Key Hierarchy' },
                    { id: 'hsm', label: 'HSM Status' },
                    { id: 'rotation', label: 'Rotation Schedule' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <div className="mt-6 space-y-4">
                {activeTab === 'hierarchy' && <KeyHierarchy />}
                {activeTab === 'hsm' && <HsmStatus />}
                {activeTab === 'rotation' && <RotationSchedule />}
            </div>
        </div>
    )
}

export default KeyManagement
