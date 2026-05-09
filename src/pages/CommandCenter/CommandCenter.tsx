import React, { useState, useEffect } from 'react'
import { CountUp, DataGrid, Modal, Select, Badge } from '@/components/ui'
import useUiStore from '@/store/useUiStore'
import '../../styles/command-center.css'

type TableColumn<T> = {
    key: keyof T
    label: string
    width?: number
    flex?: number
    render?: (value: any, row: T) => React.ReactNode
}

interface KPICard {
    id: string
    icon: string
    label: string
    value: number
    unit?: string
    delta: number
    sparklineData: number[]
    color: string
}

interface LiveEvent {
    id: string
    timestamp: Date
    type: 'ACCESS' | 'ENCRYPT' | 'AUTH' | 'POLICY'
    message: string
    severity: 'info' | 'warning' | 'critical'
    payload?: Record<string, unknown>
}

interface IntegrationService {
    id: string
    name: string
    status: 'ok' | 'warning' | 'error'
    latency: number
    latencyCategory: 'low' | 'medium' | 'high'
}

const CommandCenter: React.FC = () => {
    const [defconLevel, setDefconLevel] = useState(3)
    const [timeString, setTimeString] = useState('')
    const [eventFilter, setEventFilter] = useState('ALL')
    const [liveStreamPaused, setLiveStreamPaused] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null)
    const [opsChartRange, setOpsChartRange] = useState('24H')
    const [animatePackets, setAnimatePackets] = useState(false)
    const [bufferedEvents, setBufferedEvents] = useState(0)
    const [selectedService, setSelectedService] = useState<IntegrationService | null>(null)
    const [hoveredOpsPoint, setHoveredOpsPoint] = useState<{ x: number; y: number; ops: number; errors: number } | null>(null)
    const [autoReplayEnabled, setAutoReplayEnabled] = useState(true)

    const kpiCards: KPICard[] = [
        {
            id: 'encrypted-files',
            icon: '🔐',
            label: 'Encrypted Files',
            value: 2847,
            delta: 12,
            sparklineData: [200, 250, 220, 280, 290, 310, 340],
            color: '#22D3EE',
        },
        {
            id: 'dek-rotations',
            icon: '🔄',
            label: 'DEK Rotations',
            value: 341,
            delta: 8,
            sparklineData: [50, 60, 55, 75, 80, 85, 90],
            color: '#A78BFA',
        },
        {
            id: 'zero-trust-checks',
            icon: '✓',
            label: 'Zero-Trust Checks',
            value: 15842,
            delta: 3,
            sparklineData: [1200, 1400, 1300, 1500, 1600, 1700, 1800],
            color: '#10B981',
        },
        {
            id: 'auth-failures',
            icon: '⚠',
            label: 'Auth Failures',
            value: 12,
            delta: -2,
            sparklineData: [15, 18, 12, 10, 8, 6, 4],
            color: '#F59E0B',
        },
    ]

    const mockLiveEvents: LiveEvent[] = [
        {
            id: 'e1',
            timestamp: new Date(Date.now() - 2000),
            type: 'ACCESS',
            message: 'j.davis → report-q3.pdf accessed',
            severity: 'info',
            payload: { user: 'j.davis', file: 'report-q3.pdf', action: 'VIEW' },
        },
        {
            id: 'e2',
            timestamp: new Date(Date.now() - 5000),
            type: 'ENCRYPT',
            message: 'new DEK generated and rotated',
            severity: 'info',
            payload: { keyId: 'dek-8f2a3c', algo: 'AES-256-GCM' },
        },
        {
            id: 'e3',
            timestamp: new Date(Date.now() - 8000),
            type: 'AUTH',
            message: 'MFA challenge passed for m.chen',
            severity: 'info',
            payload: { user: 'm.chen', method: 'TOTP' },
        },
        {
            id: 'e4',
            timestamp: new Date(Date.now() - 15000),
            type: 'POLICY',
            message: 'rule 007 evaluated: DENY access',
            severity: 'warning',
            payload: { rule: '007', result: 'DENY', reason: 'privilege_insufficient' },
        },
    ]

    const integrationServices: IntegrationService[] = [
        { id: 'kafka', name: 'Kafka', status: 'ok', latency: 2, latencyCategory: 'low' },
        { id: 'clickh', name: 'ClickH', status: 'ok', latency: 5, latencyCategory: 'low' },
        { id: 'opa', name: 'OPA', status: 'ok', latency: 1, latencyCategory: 'low' },
        { id: 'siem', name: 'SIEM', status: 'warning', latency: 45, latencyCategory: 'medium' },
        { id: 'okta', name: 'Okta', status: 'ok', latency: 10, latencyCategory: 'low' },
        { id: 'vault', name: 'Vault', status: 'ok', latency: 3, latencyCategory: 'low' },
    ]

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const utcTime = now.toLocaleTimeString('en-US', { timeZone: 'UTC' })
            const istTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })
            setTimeString(`UTC ${utcTime} | IST ${istTime}`)
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        setAnimatePackets(true)
        const timer = setTimeout(() => setAnimatePackets(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    // Auto-replay swimlane every 6 seconds
    useEffect(() => {
        if (!autoReplayEnabled) return
        const autoPlayInterval = setInterval(() => {
            setAnimatePackets(true)
            setTimeout(() => setAnimatePackets(false), 1000)
        }, 6000)
        return () => clearInterval(autoPlayInterval)
    }, [autoReplayEnabled])

    // Simulate buffered events
    useEffect(() => {
        if (liveStreamPaused) {
            const bufferInterval = setInterval(() => {
                setBufferedEvents(prev => prev + Math.floor(Math.random() * 3) + 1)
            }, 2000)
            return () => clearInterval(bufferInterval)
        } else {
            setBufferedEvents(0)
        }
    }, [liveStreamPaused])

    const generateSparklinePoints = (data: number[]) => {
        const maxValue = Math.max(...data)
        const minValue = Math.min(...data)
        const range = maxValue - minValue || 1
        const height = 24
        const width = 120

        return data
            .map((val, i) => {
                const x = (i / (data.length - 1)) * width
                const y = height - ((val - minValue) / range) * height
                return `${x},${y}`
            })
            .join(' ')
    }

    const filteredEvents = mockLiveEvents.filter((e) =>
        eventFilter === 'ALL' ? true : e.type === eventFilter
    )

    const eventTypeOptions = [
        { value: 'ALL', label: 'All Events' },
        { value: 'ACCESS', label: 'Access' },
        { value: 'ENCRYPT', label: 'Encryption' },
        { value: 'AUTH', label: 'Authentication' },
        { value: 'POLICY', label: 'Policy' },
    ]

    const eventColumns: TableColumn<LiveEvent>[] = [
        { key: 'timestamp', label: 'Time', width: 100, render: (val) => (val as Date).toLocaleTimeString() },
        { key: 'type', label: 'Type', width: 90 },
        { key: 'message', label: 'Message', flex: 1 },
        {
            key: 'severity', label: 'Severity', width: 100, render: (val) => {
                const severity = val === 'critical' ? 'critical' : val === 'warning' ? 'warning' : 'success'
                return <Badge severity={severity}>{val}</Badge>
            }
        },
    ]

    const opsChartOpsPoints = '0,40 15,30 30,35 45,20 60,15 75,25 90,10 100,8'
    const opsChartErrorsPoints = '0,5 15,8 30,6 45,12 60,15 75,10 90,8 100,6'

    // S2.1: DEFCON ambient radial gradient
    const defconGradientColor = {
        1: 'rgb(16, 185, 129)', // green
        2: 'rgb(34, 211, 238)', // cyan
        3: 'rgb(245, 158, 11)', // amber
        4: 'rgb(244, 63, 94)', // red - more intense
        5: 'rgb(244, 63, 94)', // red - max intensity
    }[defconLevel] || 'rgb(34, 211, 238)'

    return (
        <div 
            className="bg-s1 min-h-screen overflow-y-auto"
            style={{
                padding: 'clamp(12px, 5vw, 24px)',
                backgroundImage: `radial-gradient(circle 400px at 50% 0%, ${defconGradientColor}15, transparent 100%)`,
                transition: 'background-image 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >
            <div className="mb-4 md:mb-6">
                <div className="cc-header-label">
                    <span className="cc-breadcrumb">Command Center</span>
                </div>
                <div className="cc-header-controls">
                    <div className="cc-defcon">
                        <span className="cc-defcon-label">DEFCON</span>
                        <div className="cc-defcon-blocks">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    className={`cc-defcon-block ${level <= defconLevel ? 'active' : ''
                                        }`}
                                    onClick={() => setDefconLevel(level)}
                                    style={{
                                        backgroundColor:
                                            level <= defconLevel
                                                ? level <= 2
                                                    ? '#10B981'
                                                    : level === 3
                                                        ? '#F59E0B'
                                                        : '#F43F5E'
                                                : 'transparent',
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="cc-clock">
                        <span className="cc-clock-text">{timeString}</span>
                    </div>
                    <div className="cc-incident-pill">
                        <span className="cc-incident-dot" />
                        3 Active Incidents
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {kpiCards.map((card) => (
                    <div 
                        key={card.id} 
                        className="p-4 md:p-5 bg-s1 border border-bd rounded-lg md:rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer"
                        style={{ borderTopColor: card.color, borderTopWidth: '3px' }}
                    >
                        <div className="mb-2">
                            <span className="text-2xl md:text-3xl">{card.icon}</span>
                        </div>
                        <div className="text-lg md:text-2xl font-semibold mb-1" style={{ color: card.color }}>
                            <CountUp
                                value={card.value}
                                duration={1200}
                                className="inline"
                            />
                            {card.unit && <span className="text-sm ml-1">{card.unit}</span>}
                        </div>
                        <div className="text-xs md:text-sm text-t2 mb-2 font-medium">{card.label}</div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-xs md:text-sm font-semibold" style={{ color: card.delta >= 0 ? '#10B981' : '#F43F5E' }}>
                                {card.delta >= 0 ? '▲' : '▼'} {Math.abs(card.delta)}%
                            </div>
                        </div>

                        <svg className="w-full h-8 md:h-10" viewBox="0 0 120 24" preserveAspectRatio="none">
                            <defs>
                                <linearGradient
                                    id={`sparkline-gradient-${card.id}`}
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stopColor={card.color} stopOpacity="0.3" />
                                    <stop offset="100%" stopColor={card.color} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <polyline
                                points={generateSparklinePoints(card.sparklineData)}
                                fill={`url(#sparkline-gradient-${card.id})`}
                                stroke={card.color}
                                strokeWidth="1.5"
                            />
                        </svg>
                    </div>
                ))}
            </div>

            <div className="cc-content">
                <div className="cc-swimlane">
                    <div className="cc-swimlane-header">
                        <h3 className="cc-swimlane-title">ZK ENCRYPTION FLOW</h3>
                        <div className="flex items-center gap-2">
                            <button className="cc-replay-btn" onClick={() => setAnimatePackets(true)}>
                                ↻ Replay
                            </button>
                            <button
                                className={`cc-auto-replay-btn ${autoReplayEnabled ? 'active' : ''}`}
                                onClick={() => setAutoReplayEnabled(!autoReplayEnabled)}
                                title="Auto-replay every 6s"
                            >
                                🔄
                            </button>
                        </div>
                    </div>
                    <svg className="cc-swimlane-diagram" preserveAspectRatio="xMidYMid meet">
                        {/* Swimlane columns */}
                        {['CLIENT', 'PEP', 'PDP', 'HSM', 'VAULT'].map((lane, i) => (
                            <g key={lane}>
                                <text
                                    x={(i + 0.5) * 100}
                                    y="25"
                                    className="cc-swimlane-label"
                                    textAnchor="middle"
                                >
                                    {lane}
                                </text>
                                <line
                                    x1={(i + 0.5) * 100}
                                    y1="35"
                                    x2={(i + 0.5) * 100}
                                    y2="150"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="1"
                                    strokeDasharray="4"
                                />
                            </g>
                        ))}

                        {/* Packet animations */}
                        {animatePackets && (
                            <>
                                <circle
                                    cx="50"
                                    cy="60"
                                    r="4"
                                    fill="#22D3EE"
                                    className="cc-packet"
                                />
                                <circle
                                    cx="150"
                                    cy="80"
                                    r="4"
                                    fill="#A78BFA"
                                    className="cc-packet"
                                    style={{ animationDelay: '0.2s' }}
                                />
                                <circle
                                    cx="250"
                                    cy="100"
                                    r="4"
                                    fill="#F59E0B"
                                    className="cc-packet"
                                    style={{ animationDelay: '0.4s' }}
                                />
                                <circle
                                    cx="350"
                                    cy="120"
                                    r="4"
                                    fill="#10B981"
                                    className="cc-packet"
                                    style={{ animationDelay: '0.6s' }}
                                />
                            </>
                        )}

                        {/* Arrow labels with latency */}
                        <g>
                            <text x="75" y="55" className="cc-swimlane-label" textAnchor="middle" fontSize="10">
                                encrypt
                            </text>
                            <text x="75" y="70" className="cc-swimlane-latency" textAnchor="middle" fontSize="8" fill="#22D3EE">
                                2.1ms
                            </text>
                        </g>
                        <g>
                            <text x="175" y="75" className="cc-swimlane-label" textAnchor="middle" fontSize="10">
                                policy?
                            </text>
                            <text x="175" y="90" className="cc-swimlane-latency" textAnchor="middle" fontSize="8" fill="#A78BFA">
                                1.8ms
                            </text>
                        </g>
                        <g>
                            <text x="275" y="95" className="cc-swimlane-label" textAnchor="middle" fontSize="10">
                                sign?
                            </text>
                            <text x="275" y="110" className="cc-swimlane-latency" textAnchor="middle" fontSize="8" fill="#F59E0B">
                                3.4ms
                            </text>
                        </g>
                        <g>
                            <text x="375" y="115" className="cc-swimlane-label" textAnchor="middle" fontSize="10">
                                DEK wrap
                            </text>
                            <text x="375" y="130" className="cc-swimlane-latency" textAnchor="middle" fontSize="8" fill="#10B981">
                                1.2ms
                            </text>
                        </g>
                    </svg>
                </div>

                <div className="cc-main-grid">
                    <div className="cc-live-feed">
                        <div className="cc-live-header">
                            <span className="cc-live-title">
                                LIVE EVENT FEED
                                {bufferedEvents > 0 && (
                                    <span className="cc-buffered-badge" title="Buffered events">
                                        {bufferedEvents} buffered
                                    </span>
                                )}
                            </span>
                            <div className="flex items-center gap-2">
                                <Select
                                    options={eventTypeOptions}
                                    value={eventFilter}
                                    onChange={(val) => setEventFilter(val as string)}
                                    size="sm"
                                />
                                <button
                                    className="cc-pause-btn"
                                    onClick={() => setLiveStreamPaused(!liveStreamPaused)}
                                    title={liveStreamPaused ? 'Resume' : 'Pause'}
                                >
                                    {liveStreamPaused ? '▶' : '⏸'}
                                </button>
                            </div>
                        </div>
                        <DataGrid<LiveEvent>
                            rows={filteredEvents}
                            columns={eventColumns}
                            containerHeight={300}
                            rowHeight={40}
                            striped
                            onRowClick={(event) => setSelectedEvent(event)}
                        />
                    </div>

                    <div className="cc-ops-chart">
                        <div className="cc-ops-header">
                            <span className="cc-ops-title">OPERATIONS CHART</span>
                            <div className="cc-ops-tabs">
                                {['1H', '6H', '24H', '7D'].map((range) => (
                                    <button
                                        key={range}
                                        className={`cc-ops-tab ${opsChartRange === range ? 'active' : ''}`}
                                        onClick={() => setOpsChartRange(range)}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="cc-ops-container" onMouseLeave={() => setHoveredOpsPoint(null)}>
                            <svg className="cc-ops-svg" preserveAspectRatio="xMidYMid meet">
                                <defs>
                                    <linearGradient
                                        id="ops-gradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Y-axis */}
                                <line x1="40" y1="10" x2="40" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                                {/* X-axis */}
                                <line x1="40" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                                {/* Ops line + area */}
                                <polyline points={opsChartOpsPoints} fill="url(#ops-gradient)" stroke="#22D3EE" strokeWidth="1.5" />

                                {/* Errors dashed line */}
                                <polyline
                                    points={opsChartErrorsPoints}
                                    fill="none"
                                    stroke="#F43F5E"
                                    strokeWidth="1"
                                    strokeDasharray="3,2"
                                />

                                {/* Hover crosshair */}
                                {hoveredOpsPoint && (
                                    <>
                                        <line x1={hoveredOpsPoint.x} y1="10" x2={hoveredOpsPoint.x} y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
                                        <line x1="40" y1={hoveredOpsPoint.y} x2="100" y2={hoveredOpsPoint.y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
                                        <circle cx={hoveredOpsPoint.x} cy={hoveredOpsPoint.y} r="3" fill="#22D3EE" />
                                    </>
                                )}

                                {/* Invisible hitbox for hover */}
                                <rect
                                    x="40"
                                    y="10"
                                    width="60"
                                    height="70"
                                    fill="transparent"
                                    onMouseMove={(e) => {
                                        const svg = e.currentTarget.ownerSVGElement
                                        if (!svg) return
                                        const rect = svg.getBoundingClientRect()
                                        const x = e.clientX - rect.left
                                        const y = e.clientY - rect.top
                                        // Map position to data
                                        const dataX = ((x - 40) / 60) * 100
                                        const opsValue = 40 - (y - 10) * 0.4
                                        const errValue = 5 + (y - 10) * 0.1
                                        setHoveredOpsPoint({
                                            x,
                                            y,
                                            ops: Math.max(0, Math.round(opsValue)),
                                            errors: Math.max(0, Math.round(errValue))
                                        })
                                    }}
                                    style={{ cursor: 'crosshair' }}
                                />

                                {/* Y-axis label */}
                                <text x="10" y="20" className="cc-chart-label" fontSize="9">
                                    Ops/s
                                </text>

                                {/* Y-axis label (right) */}
                                <text x="95" y="20" className="cc-chart-label" fontSize="9" textAnchor="end">
                                    Error%
                                </text>
                            </svg>
                            {hoveredOpsPoint && (
                                <div className="cc-ops-tooltip" style={{ left: hoveredOpsPoint.x, top: hoveredOpsPoint.y }}>
                                    <div className="text-xs font-mono">
                                        <div className="text-cyan-400">Ops: {hoveredOpsPoint.ops}/s</div>
                                        <div className="text-red-400">Error: {hoveredOpsPoint.errors}%</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="cc-health-rail">
                <span className="cc-health-title">INTEGRATION HEALTH</span>
                <div className="cc-health-tiles">
                    {integrationServices.map((service) => (
                        <div
                            key={service.id}
                            className={`cc-health-tile cc-health-${service.status}`}
                            onClick={() => setSelectedService(service)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="cc-health-name">{service.name}</div>
                            <span
                                className="cc-health-dot"
                                style={{
                                    background:
                                        service.status === 'ok'
                                            ? '#10B981'
                                            : service.status === 'warning'
                                                ? '#F59E0B'
                                                : '#F43F5E',
                                }}
                            />
                            <div className="cc-health-latency">{service.latency} ms</div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={!!selectedEvent}
                title="Event Details"
                size="lg"
                onClose={() => setSelectedEvent(null)}
            >
                {selectedEvent && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-mono text-t3">Timestamp</h4>
                                <p className="text-sm text-t1">{selectedEvent.timestamp.toISOString()}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-mono text-t3">Type</h4>
                                <p className="text-sm text-t1">{selectedEvent.type}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-mono text-t3">Message</h4>
                            <p className="text-sm text-t1">{selectedEvent.message}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-mono text-t3">Severity</h4>
                            <Badge severity={selectedEvent.severity === 'critical' ? 'critical' : selectedEvent.severity === 'warning' ? 'warning' : 'success'}>
                                {selectedEvent.severity}
                            </Badge>
                        </div>
                        {selectedEvent.payload && (
                            <div>
                                <h4 className="text-sm font-mono text-t3">Payload</h4>
                                <pre className="bg-s1 p-3 rounded text-xs text-t1 overflow-auto max-h-40">
                                    {JSON.stringify(selectedEvent.payload, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Integration Health Detail Modal */}
            <Modal
                isOpen={!!selectedService}
                title={selectedService?.name + ' — 24h Latency'}
                size="lg"
                onClose={() => setSelectedService(null)}
            >
                {selectedService && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-s1 p-3 rounded">
                                <div className="text-xs text-t3 font-mono">Current</div>
                                <div className="text-lg font-semibold" style={{
                                    color: selectedService.status === 'ok' ? '#10B981' : selectedService.status === 'warning' ? '#F59E0B' : '#F43F5E'
                                }}>
                                    {selectedService.latency}ms
                                </div>
                            </div>
                            <div className="bg-s1 p-3 rounded">
                                <div className="text-xs text-t3 font-mono">Avg</div>
                                <div className="text-lg font-semibold text-cyan-400">
                                    {Math.round(selectedService.latency * 1.1)}ms
                                </div>
                            </div>
                            <div className="bg-s1 p-3 rounded">
                                <div className="text-xs text-t3 font-mono">P95</div>
                                <div className="text-lg font-semibold text-amber-400">
                                    {Math.round(selectedService.latency * 1.8)}ms
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-mono text-t3 mb-2">Latency Histogram (24h)</h4>
                            <svg className="w-full h-32" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet">
                                <defs>
                                    <linearGradient id="histogram-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Bars representing latency distribution */}
                                {[8, 12, 15, 22, 28, 32, 28, 18, 12, 5].map((height, i) => (
                                    <rect key={i} x={8 + i * 18} y={60 - height} width="14" height={height} fill="#22D3EE" opacity="0.7" />
                                ))}
                                {/* Baseline */}
                                <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                <text x="5" y="75" className="cc-chart-label" fontSize="8">0ms</text>
                                <text x="185" y="75" className="cc-chart-label" fontSize="8" textAnchor="end">50ms</text>
                            </svg>
                        </div>

                        <div className="bg-s1 p-3 rounded">
                            <div className="text-xs text-t3 font-mono mb-2">Status</div>
                            <Badge severity={selectedService.status === 'ok' ? 'success' : selectedService.status === 'warning' ? 'warning' : 'critical'}>
                                {selectedService.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default CommandCenter
