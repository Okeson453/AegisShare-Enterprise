import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../styles/topbar.css'

interface Notification {
    id: number
    type: 'critical' | 'warning' | 'info'
    title: string
    time: string
    action: string
    link?: string
}

interface ztCheck {
    name: string
    status: 'pass' | 'fail'
    detail: string
}

interface TopbarProps {
    onMenuClick?: () => void
    sidebarOpen?: boolean
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, sidebarOpen = false }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [commandOpen, setCommandOpen] = useState(false)
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [hsmPopoverOpen, setHsmPopoverOpen] = useState(false)
    const [ztPopoverOpen, setZtPopoverOpen] = useState(false)
    const [incidentModalOpen, setIncidentModalOpen] = useState(false)
    const [commandSearch, setCommandSearch] = useState('')
    const [hsmLatency, setHsmLatency] = useState(2)
    const [systemTime, setSystemTime] = useState(new Date())
    const [zerotrust, setZerotrust] = useState(true)
    const [environment, setEnvironment] = useState<'PROD' | 'STAGING' | 'DEV'>('PROD')
    const [incidentCount, setIncidentCount] = useState(1)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const commandRef = useRef<HTMLDivElement>(null)
    const notificationRef = useRef<HTMLDivElement>(null)
    const hsmRef = useRef<HTMLDivElement>(null)
    const ztRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setInterval(() => setSystemTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Simulate dynamic latency between 1-20 ms
    useEffect(() => {
        const timer = setInterval(() => setHsmLatency(Math.floor(Math.random() * 20) + 1), 3000)
        return () => clearInterval(timer)
    }, [])

    // Close popovers on escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setHsmPopoverOpen(false)
                setZtPopoverOpen(false)
                setCommandOpen(false)
                setNotificationOpen(false)
                setOpenDropdown(null)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ⌘K / Ctrl+K - Open command palette
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setCommandOpen(!commandOpen)
            }

            // Tab navigation in command palette
            if (commandOpen && e.key === 'Tab') {
                e.preventDefault()
                // Tab would cycle through results
            }

            // Keyboard shortcuts for navigation: ⌘1-⌘9
            if ((e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
                e.preventDefault()
                const shortcuts: { [key: string]: string } = {
                    '1': '/command',
                    '2': '/vault',
                    '3': '/compliance',
                    '4': '/policy',
                    '5': '/audit',
                    '6': '/threat',
                    '7': '/keys',
                    '8': '/access',
                    '9': '/config',
                }
                if (shortcuts[e.key]) {
                    navigate(shortcuts[e.key])
                    setCommandOpen(false)
                }
            }

            // Go-to shortcuts: g+letter (S11.1 - Tab navigation)
            if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !commandOpen) {
                const handleNextKey = (nextE: KeyboardEvent) => {
                    const gotos: { [key: string]: string } = {
                        'c': '/command',
                        'v': '/vault',
                        'k': '/keys',
                        't': '/threat',
                        'a': '/audit',
                    }
                    if (gotos[nextE.key.toLowerCase()]) {
                        navigate(gotos[nextE.key.toLowerCase()])
                    }
                    window.removeEventListener('keydown', handleNextKey)
                }
                window.addEventListener('keydown', handleNextKey)
                setTimeout(() => window.removeEventListener('keydown', handleNextKey), 2000)
            }

            // ? - Show keyboard shortcuts
            if (e.key === '?' && !commandOpen) {
                e.preventDefault()
                // TODO: Show keyboard shortcuts modal
                console.log('Show keyboard shortcuts')
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [commandOpen, navigate])

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '◉', alert: false },
        {
            label: 'Admin',
            icon: '⚔',
            alert: true,
            dropdown: [
                { label: 'Command Center', href: '/command', badge: '' },
                { label: 'Access Control', href: '/access', badge: '1 WARN' },
                { label: 'Admin Console', href: '/admin', badge: '' },
            ],
        },
        {
            label: 'License Management',
            icon: '🔑',
            alert: false,
            dropdown: [
                { label: 'Key Management', href: '/keys', badge: 'HSM·L3' },
                { label: 'Compliance Hub', href: '/compliance', badge: '98/100' },
                { label: 'Configuration', href: '/settings', badge: '' },
            ],
        },
        { label: 'Settings', href: '/settings', icon: '⚙', alert: false },
    ]

    // ZT Check details (S11.2)
    const ztChecks: ztCheck[] = [
        { name: 'MFA Status', status: 'pass', detail: '✓ All users verified' },
        { name: 'Device Trust', status: 'pass', detail: '✓ Device compliant' },
        { name: 'Network', status: 'pass', detail: '✓ VPN active (US-East)' },
        { name: 'Time Sync', status: 'pass', detail: '✓ NTP synchronized' },
        { name: 'TLS Version', status: 'pass', detail: '✓ TLS 1.3+' },
    ]

    // Enhanced notifications with severity levels (S11.4)
    const notifications: Notification[] = [
        {
            id: 1,
            type: 'critical',
            title: 'Brute Force on m.chen',
            time: '2min ago',
            action: 'View in Threat Center',
            link: '/threat',
        },
        {
            id: 2,
            type: 'warning',
            title: 'DEK dek-doc-3c77 due in 3d',
            time: '14min ago',
            action: 'View in Key Management',
            link: '/keys',
        },
        {
            id: 3,
            type: 'info',
            title: 'SOC 2 audit window opens',
            time: '1h ago',
            action: 'View in Compliance Hub',
            link: '/compliance',
        },
    ]

    // HSM Latency Color Coding (S11.2)
    const getHsmColor = () => {
        if (hsmLatency < 5) return '#10B981' // green
        if (hsmLatency < 20) return '#F59E0B' // amber
        return '#F43F5E' // red
    }

    const getHsmStatus = () => {
        if (hsmLatency < 5) return '✓ Optimal'
        if (hsmLatency < 20) return '⚠ Good'
        return '✗ Degraded'
    }

    const criticalCount = notifications.filter((n) => n.type === 'critical').length
    const warningCount = notifications.filter((n) => n.type === 'warning').length

    return (
        <div className="topnav">
            <div className="topnav-logo">◈ AegisShare</div>

            <div className="tnav-items">
                {navItems.map((item) => (
                    <div key={item.label} className="tnav-item">
                        <button
                            className={`tnav-link ${location.pathname.includes((item.href || '').toLowerCase()) ? 'active' : ''}`}
                            onClick={() => {
                                if (item.href) navigate(item.href)
                                if (item.dropdown) setOpenDropdown(openDropdown === item.label ? null : item.label)
                            }}
                            aria-expanded={item.dropdown ? openDropdown === item.label : undefined}
                        >
                            <span className="tnav-icon">{item.icon}</span>
                            {/* Alert Dot Indicator (S11.1) */}
                            {item.alert && <span className="tnav-alert-dot" title="Alert" />}
                            <span>{item.label}</span>
                            {item.dropdown && <span className="chev">▼</span>}
                        </button>

                        {item.dropdown && (
                            <div className={`tnav-dropdown ${openDropdown === item.label ? 'open' : ''}`}>
                                {item.dropdown.map((subitem) => (
                                    <div
                                        key={subitem.label}
                                        className="tnav-dd-item"
                                        onClick={() => {
                                            navigate(subitem.href)
                                            setOpenDropdown(null)
                                        }}
                                    >
                                        <span>{subitem.label}</span>
                                        {subitem.badge && <span className="dd-badge">{subitem.badge}</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="topnav-divider" />

            <div className="topnav-right">
                <div className="status-pills">
                    {/* HSM Latency Pill with Popover (S11.2) */}
                    <div className="status-pill-wrapper" ref={hsmRef}>
                        <button
                            className="status-pill hsm-pill"
                            style={{ borderColor: getHsmColor() + '50', color: getHsmColor() }}
                            onClick={() => setHsmPopoverOpen(!hsmPopoverOpen)}
                            title="HSM Latency"
                        >
                            ⬡ HSM <span className="sp-value">{hsmLatency}ms</span>
                        </button>

                        {hsmPopoverOpen && (
                            <div className="status-popover hsm-popover">
                                <div className="popover-header">HSM Status</div>
                                <div className="popover-content">
                                    <div className="hsm-metric">
                                        <span>Latency</span>
                                        <span className="metric-value" style={{ color: getHsmColor() }}>
                                            {hsmLatency}ms (<strong>{getHsmStatus()}</strong>)
                                        </span>
                                    </div>
                                    <div className="hsm-metric">
                                        <span>Operations/sec</span>
                                        <span className="metric-value">847</span>
                                    </div>
                                    <div className="hsm-metric">
                                        <span>Keys Stored</span>
                                        <span className="metric-value">12,447</span>
                                    </div>
                                    <div className="hsm-metric">
                                        <span>Load</span>
                                        <span className="metric-value">34%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Zero-Trust Pill with Popover (S11.2) */}
                    <div className="status-pill-wrapper" ref={ztRef}>
                        <button
                            className="status-pill zt-pill"
                            onClick={() => setZtPopoverOpen(!ztPopoverOpen)}
                            title="Zero-Trust Status"
                        >
                            ZT <span className="zt-dot">●</span> ON
                        </button>

                        {ztPopoverOpen && (
                            <div className="status-popover zt-popover">
                                <div className="popover-header">Zero-Trust Checks</div>
                                <div className="popover-content">
                                    {ztChecks.map((check, idx) => (
                                        <div key={idx} className={`zt-check zt-${check.status}`}>
                                            <span className="zt-check-status">{check.status === 'pass' ? '✓' : '✗'}</span>
                                            <div className="zt-check-details">
                                                <span className="zt-check-name">{check.name}</span>
                                                <span className="zt-check-detail">{check.detail}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    className="cmd-palette-btn"
                    onClick={() => setCommandOpen(true)}
                    title="Search commands (⌘K)"
                >
                    ⌘K
                </button>

                <div className="notification-container">
                    <button
                        className={`notif-bell ${criticalCount > 0 ? 'has-critical' : ''}`}
                        onClick={() => setNotificationOpen(!notificationOpen)}
                        title="Notifications"
                    >
                        🔔
                        {criticalCount > 0 && (
                            <>
                                <span className="notif-badge">{criticalCount}</span>
                                {/* Pulsing red dot for CRITICAL (S11.4) */}
                                <span className="notif-critical-dot" />
                            </>
                        )}
                    </button>

                    {notificationOpen && (
                        <div className="notif-drawer">
                            <div className="notif-header">
                                <span>Notifications</span>
                                <button className="notif-mark-all">Mark all ✓</button>
                            </div>

                            {/* Categorized Notifications (S11.4) */}
                            {criticalCount > 0 && (
                                <div className="notif-category">
                                    <div className="notif-cat-label">CRITICAL</div>
                                    {notifications
                                        .filter((n) => n.type === 'critical')
                                        .map((notif) => (
                                            <div
                                                key={notif.id}
                                                className="notif-item notif-critical"
                                                onClick={() => {
                                                    if (notif.link) {
                                                        navigate(notif.link)
                                                        setNotificationOpen(false)
                                                    }
                                                }}
                                            >
                                                <div className="notif-dot notif-dot-critical" />
                                                <div className="notif-content">
                                                    <div className="notif-title">{notif.title}</div>
                                                    <div className="notif-time">{notif.time}</div>
                                                    <div className="notif-action">{notif.action}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {warningCount > 0 && (
                                <div className="notif-category">
                                    <div className="notif-cat-label">WARNING</div>
                                    {notifications
                                        .filter((n) => n.type === 'warning')
                                        .map((notif) => (
                                            <div
                                                key={notif.id}
                                                className="notif-item notif-warning"
                                                onClick={() => {
                                                    if (notif.link) {
                                                        navigate(notif.link)
                                                        setNotificationOpen(false)
                                                    }
                                                }}
                                            >
                                                <div className="notif-dot notif-dot-warning" />
                                                <div className="notif-content">
                                                    <div className="notif-title">{notif.title}</div>
                                                    <div className="notif-time">{notif.time}</div>
                                                    <div className="notif-action">{notif.action}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {notifications.filter((n) => n.type === 'info').length > 0 && (
                                <div className="notif-category">
                                    <div className="notif-cat-label">INFO</div>
                                    {notifications
                                        .filter((n) => n.type === 'info')
                                        .map((notif) => (
                                            <div
                                                key={notif.id}
                                                className="notif-item notif-info"
                                                onClick={() => {
                                                    if (notif.link) {
                                                        navigate(notif.link)
                                                        setNotificationOpen(false)
                                                    }
                                                }}
                                            >
                                                <div className="notif-dot notif-dot-info" />
                                                <div className="notif-content">
                                                    <div className="notif-title">{notif.title}</div>
                                                    <div className="notif-time">{notif.time}</div>
                                                    <div className="notif-action">{notif.action}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Environment Indicator & P1 Incident (S11.5) */}
                <div className="env-section">
                    <div className={`env-indicator env-${environment.toLowerCase()}`} title={`Environment: ${environment}`}>
                        {environment}
                    </div>
                    {environment === 'PROD' && (
                        <button
                            className="p1-incident-btn"
                            onClick={() => setIncidentModalOpen(true)}
                            title="Declare P1 Incident"
                        >
                            🚨 P1
                        </button>
                    )}
                </div>

                <button className="user-avatar" title="User Menu">
                    <span>JD</span>
                    <div className="user-status" />
                </button>
            </div>

            {commandOpen && (
                <div className="cmd-palette-overlay" onClick={() => setCommandOpen(false)}>
                    <div className="cmd-palette-modal" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            className="cmd-palette-input"
                            placeholder="⌘  Search commands, files, users, policies…"
                            value={commandSearch}
                            onChange={(e) => setCommandSearch(e.target.value)}
                            autoFocus
                        />
                        <div className="cmd-palette-content">
                            <div className="cmd-section">
                                <div className="cmd-section-label">RECENT</div>
                                <div className="cmd-item" onClick={() => { navigate('/command'); setCommandOpen(false); }}>
                                    <span className="cmd-icon">⌚</span>
                                    <span>Command Center</span>
                                    <span className="cmd-shortcut">g c</span>
                                </div>
                                <div className="cmd-item" onClick={() => { navigate('/keys'); setCommandOpen(false); }}>
                                    <span className="cmd-icon">⌚</span>
                                    <span>Key Management</span>
                                    <span className="cmd-shortcut">g k</span>
                                </div>
                            </div>
                            <div className="cmd-section">
                                <div className="cmd-section-label">NAVIGATE</div>
                                <div className="cmd-item" onClick={() => { navigate('/command'); setCommandOpen(false); }}>
                                    <span className="cmd-icon">→</span>
                                    <span>Command Center</span>
                                    <span className="cmd-shortcut">⌘1</span>
                                </div>
                                <div className="cmd-item" onClick={() => { navigate('/vault'); setCommandOpen(false); }}>
                                    <span className="cmd-icon">→</span>
                                    <span>Secure Vault</span>
                                    <span className="cmd-shortcut">⌘2</span>
                                </div>
                                <div className="cmd-item" onClick={() => { navigate('/compliance'); setCommandOpen(false); }}>
                                    <span className="cmd-icon">→</span>
                                    <span>Compliance Hub</span>
                                    <span className="cmd-shortcut">⌘3</span>
                                </div>
                                <div className="cmd-item" onClick={() => { navigate('/threat'); setCommandOpen(false); }}>
                                    <span className="cmd-icon">→</span>
                                    <span>Threat Center</span>
                                    <span className="cmd-shortcut">⌘6</span>
                                </div>
                                <div className="cmd-item" onClick={() => { navigate('/access'); setCommandOpen(false); }}>
                                    <span className="cmd-icon">→</span>
                                    <span>Access Control</span>
                                    <span className="cmd-shortcut">⌘8</span>
                                </div>
                            </div>
                            <div className="cmd-section">
                                <div className="cmd-section-label">ACTIONS</div>
                                <div className="cmd-item">
                                    <span className="cmd-icon">⚡</span>
                                    <span>Rotate HSM Keys</span>
                                </div>
                                <div className="cmd-item">
                                    <span className="cmd-icon">⚡</span>
                                    <span>Run PDP Simulation</span>
                                </div>
                                <div className="cmd-item">
                                    <span className="cmd-icon">⚡</span>
                                    <span>Export Audit Log</span>
                                </div>
                                <div className="cmd-item">
                                    <span className="cmd-icon">⚡</span>
                                    <span>Declare P1 Incident</span>
                                    <span className="cmd-shortcut">PROD only</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* P1 Incident Declaration Modal (S11.5) */}
            {incidentModalOpen && (
                <div className="incident-modal-overlay" onClick={() => setIncidentModalOpen(false)}>
                    <div className="incident-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="incident-modal-header">
                            <h2>🚨 Declare P1 Incident</h2>
                            <button className="incident-modal-close" onClick={() => setIncidentModalOpen(false)}>✕</button>
                        </div>
                        <div className="incident-modal-content">
                            <div className="incident-section">
                                <label>Incident Title</label>
                                <input type="text" placeholder="Describe the incident..." className="incident-input" />
                            </div>
                            <div className="incident-section">
                                <label>Severity</label>
                                <div className="severity-options">
                                    <label><input type="radio" name="severity" defaultChecked /> P1 - Critical</label>
                                    <label><input type="radio" name="severity" /> P2 - High</label>
                                </div>
                            </div>
                            <div className="incident-section">
                                <label>Affected Systems</label>
                                <input type="text" placeholder="List affected services..." className="incident-input" />
                            </div>
                            <div className="incident-warning">
                                ⚠️ P1 incidents trigger automatic escalation to incident response.
                                All recent audit logs will be preserved and marked as under investigation.
                            </div>
                        </div>
                        <div className="incident-modal-actions">
                            <button className="incident-btn cancel" onClick={() => setIncidentModalOpen(false)}>Cancel</button>
                            <button className="incident-btn declare">🚨 Declare P1 Incident</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Topbar
