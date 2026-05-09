import React, { useState, useMemo, useCallback } from 'react'

interface KeyNode {
    id: string
    name: string
    type: 'master' | 'derive' | 'operational'
    status: 'active' | 'pending' | 'rotated'
    level: 1 | 2 | 3
    algorithm: string
    rotationDate?: string
}

interface RotationSchedule {
    keyId: string
    keyName: string
    scheduledDate: string
    status: 'completed' | 'pending' | 'failed'
    progress: number
}

interface HSMDevice {
    id: string
    name: string
    type: 'primary' | 'replica' | 'offline'
    slotCount: number
    health: 'healthy' | 'warning' | 'critical'
    keysStored: number
}

interface KeyManagementProps {
    keyTree?: KeyNode[]
    rotationSchedule?: RotationSchedule[]
    hsmDevices?: HSMDevice[]
}

const KeyManagement: React.FC<KeyManagementProps> = ({
    keyTree = [],
    rotationSchedule = [],
    hsmDevices = [],
}) => {
    const [selectedKey, setSelectedKey] = useState<string | null>(null)
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
    const [rotatingKeys, setRotatingKeys] = useState<Set<string>>(new Set())
    const [hsmSyncStatus, setHsmSyncStatus] = useState<{[key: string]: 'synced' | 'syncing' | 'failed'}>({})  
    const [keyMetrics, setKeyMetrics] = useState<{[key: string]: {rotationAge: number, strength: number, compliance: number}}>({})  
    const [highlightedPath, setHighlightedPath] = useState<Set<string>>(new Set())
    const [hsmHealthMetrics, setHsmHealthMetrics] = useState<{[key: string]: {latency: number, uptime: number, syncStatus: string}}>({})  
    const [rotationInProgress, setRotationInProgress] = useState(false)
    const [syncAllInProgress, setSyncAllInProgress] = useState(false)

    const toggleNode = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes)
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId)
        } else {
            newExpanded.add(nodeId)
        }
        setExpandedNodes(newExpanded)
    }

    const initiateKeyRotation = async (keyId: string) => {
        setRotatingKeys(prev => new Set([...prev, keyId]))
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))
        setRotatingKeys(prev => {
            const newSet = new Set(prev)
            newSet.delete(keyId)
            return newSet
        })
    }

    const rotateAllKeys = async () => {
        setRotationInProgress(true)
        const keysToRotate = rotationSchedule.filter(s => s.status === 'pending')
        
        for (const schedule of keysToRotate) {
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500))
            setRotatingKeys(prev => new Set([...prev, schedule.keyId]))
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))
            setRotatingKeys(prev => {
                const newSet = new Set(prev)
                newSet.delete(schedule.keyId)
                return newSet
            })
        }
        
        setRotationInProgress(false)
    }

    const syncAllHSMs = async () => {
        setSyncAllInProgress(true)
        const hsmIds = hsmDevices.map(d => d.id)
        
        for (const hsmId of hsmIds) {
            setHsmSyncStatus(prev => ({...prev, [hsmId]: 'syncing'}))
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
            setHsmSyncStatus(prev => ({...prev, [hsmId]: 'synced'}))
        }
        
        setSyncAllInProgress(false)
    }

    const highlightDerivationPath = (keyId: string) => {
        const path = new Set<string>()
        let currentKey = keyTree.find(k => k.id === keyId)
        
        while (currentKey) {
            path.add(currentKey.id)
            const parent = keyTree.find(k => currentKey!.name.includes(k.name) && k.level < currentKey!.level)
            currentKey = parent
        }
        
        setHighlightedPath(path)
    }

    const treeByLevel = useMemo(() => {
        return {
            level1: keyTree.filter((k) => k.level === 1),
            level2: keyTree.filter((k) => k.level === 2),
            level3: keyTree.filter((k) => k.level === 3),
        }
    }, [keyTree])

    const getKeyColor = (status: string) => {
        switch(status) {
            case 'active': return '#10B981'
            case 'pending': return '#FFC107'
            case 'rotated': return '#3B82F6'
            default: return '#64748B'
        }
    }

    return (
        <div className="key-management">
            {/* Key Tree Hierarchy */}
            <div className="km-tree-panel">
                <div className="km-tree-title">Key Hierarchy</div>

                {treeByLevel.level1.map((key) => (
                    <div key={key.id}>
                        <div
                            className={`km-tree-node level-1 ${selectedKey === key.id ? 'ring-2 ring-cy' : ''
                                }`}
                            onClick={() => {
                                setSelectedKey(key.id)
                                toggleNode(key.id)
                            }}
                        >
                            <div className="km-tree-node-label">{key.name}</div>
                            <div className="km-tree-node-meta">
                                <span
                                    className={`km-tree-status-indicator ${key.status}`}
                                    title={key.status}
                                />
                                <span>{key.algorithm}</span>
                                <span>{key.type}</span>
                            </div>
                        </div>

                        {expandedNodes.has(key.id) &&
                            treeByLevel.level2
                                .filter((k2) => k2.name.includes(key.name))
                                .map((level2Key) => (
                                    <div
                                        key={level2Key.id}
                                        className={`km-tree-node level-2 ${selectedKey === level2Key.id ? 'ring-2 ring-cy' : ''
                                            }`}
                                        onClick={() =>
                                            setSelectedKey(level2Key.id)
                                        }
                                    >
                                        <div className="km-tree-node-label">{level2Key.name}</div>
                                        <div className="km-tree-node-meta">
                                            <span
                                                className={`km-tree-status-indicator ${level2Key.status}`}
                                            />
                                            <span>{level2Key.algorithm}</span>
                                        </div>
                                    </div>
                                ))}
                    </div>
                ))}
            </div>

            {/* Rotation Gantt Calendar */}
            <div className="km-gantt-panel">
                <div className="km-gantt-header">
                    <div className="km-gantt-title">
                        <span>Rotation Schedule</span>
                        <span style={{ fontSize: '10px', color: 'var(--t2)' }}>
                            {rotationSchedule.length} scheduled
                        </span>
                    </div>
                    <button
                        className={`km-rotate-all-btn ${rotationInProgress ? 'rotating' : ''}`}
                        onClick={rotateAllKeys}
                        disabled={rotationInProgress || rotationSchedule.filter(s => s.status === 'pending').length === 0}
                    >
                        <span className="km-rotate-icon">
                            {rotationInProgress ? '⟳' : '↻'}
                        </span>
                        <span className="km-rotate-text">
                            {rotationInProgress
                                ? `Rotating (${rotatingKeys.size}/${rotationSchedule.filter(s => s.status === 'pending').length})`
                                : 'Rotate All'}
                        </span>
                        {rotationInProgress && <span className="km-rotate-spinner" />}
                    </button>
                </div>

                <div className="km-gantt-container">
                    {rotationSchedule.map((schedule) => (
                        <div key={schedule.keyId} className={`km-gantt-row ${rotatingKeys.has(schedule.keyId) ? 'rotating' : ''}`}>
                            <div className="km-gantt-label">{schedule.keyName}</div>
                            <div className="km-gantt-timeline">
                                {Array.from({ length: 12 }).map((_, monthIdx) => {
                                    const isScheduledMonth =
                                        new Date(schedule.scheduledDate).getMonth() === monthIdx
                                    return (
                                        <div
                                            key={monthIdx}
                                            className={`km-gantt-bar ${schedule.status} ${isScheduledMonth ? 'opacity-100' : 'opacity-20'
                                                } ${rotatingKeys.has(schedule.keyId) ? 'rotating' : ''}`}
                                            title={`${schedule.status}: ${schedule.progress}%`}
                                        >
                                            {isScheduledMonth && `${schedule.progress}%`}
                                        </div>
                                    )
                                })}
                            </div>
                            {rotatingKeys.has(schedule.keyId) && (
                                <button
                                    className="km-rotate-individual-btn rotating"
                                    disabled={true}
                                    title="Key rotation in progress"
                                >
                                    <span className="km-rotate-individual-spinner" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* HSM Topology Diagram */}
            <div className="km-hsm-panel">
                <div className="km-hsm-header">
                    <div className="km-hsm-title">HSM Topology</div>
                    <button
                        className={`km-hsm-sync-btn ${syncAllInProgress ? 'syncing' : ''}`}
                        onClick={syncAllHSMs}
                        disabled={syncAllInProgress || hsmDevices.length === 0}
                    >
                        <span className="km-sync-icon">
                            {syncAllInProgress ? '⟳' : '✈'}
                        </span>
                        <span className="km-sync-text">
                            {syncAllInProgress
                                ? `Syncing (${Object.values(hsmSyncStatus).filter(s => s === 'synced').length}/${hsmDevices.length})`
                                : 'Sync All'}
                        </span>
                        {syncAllInProgress && <span className="km-sync-spinner" />}
                    </button>
                </div>

                {hsmDevices.map((device) => (
                    <div
                        key={device.id}
                        className={`km-hsm-device ${device.type} ${hsmSyncStatus[device.id] ? `hsm-${hsmSyncStatus[device.id]}` : ''}`}
                        title={`${device.name} - ${device.health}`}
                    >
                        <div className="km-hsm-icon">
                            {device.type === 'primary' ? '🔐' : device.type === 'replica' ? '↔️' : '❌'}
                        </div>
                        <div className="km-hsm-name">{device.name}</div>
                        <div className="km-hsm-slotcount">{device.slotCount} slots</div>
                        <div className="km-hsm-slotcount text-9px text-t3">
                            {device.keysStored} keys
                        </div>
                        <div className="km-hsm-health">
                            <span className={`km-hsm-health-dot ${device.health} ${hsmSyncStatus[device.id] === 'syncing' ? 'syncing' : ''}`} />
                            <span>{device.health}</span>
                        </div>
                        {hsmSyncStatus[device.id] && (
                            <div className={`km-hsm-sync-badge km-sync-${hsmSyncStatus[device.id]}`}>
                                {hsmSyncStatus[device.id] === 'syncing' ? '⟳ Syncing' : hsmSyncStatus[device.id] === 'synced' ? '✓ Synced' : '✕ Failed'}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default KeyManagement
