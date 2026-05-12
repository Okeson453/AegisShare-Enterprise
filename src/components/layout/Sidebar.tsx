import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../styles/sidebar.css'

interface SidebarProps {
    collapsed?: boolean
    onToggleCollapse?: () => void
    onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggleCollapse, onClose }) => {
    const location = useLocation()
    const [sessionTime, setSessionTime] = useState(0)
    const [hsmData, setHsmData] = useState([12, 15, 14, 18, 16, 19, 17, 15, 14, 16])
    const [hsmLatency, setHsmLatency] = useState(2)
    const [hsmOps, setHsmOps] = useState(847)
    const [hsmKeys, setHsmKeys] = useState(2847)
    const [hoveredShortcut, setHoveredShortcut] = useState<string | null>(null)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const collapseBtnRef = useRef<HTMLButtonElement>(null)
    const userCardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Consolidated simulation interval for production optimization
        // In production, replace this with real API calls
        if (import.meta.env.DEV) {
            let tick = 0
            const timer = setInterval(() => {
                tick++
                // Update session time every tick (1s)
                setSessionTime(t => t + 1)
                
                // Update HSM latency every 5 ticks (5s)
                if (tick % 5 === 0) {
                    setHsmLatency(Math.max(1, 2 + Math.floor(Math.random() * 4)))
                }
            }, 1000)
            
            return () => clearInterval(timer)
        }
    }, [])

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userCardRef.current && !userCardRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false)
            }
        }
        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [userMenuOpen])

    const navGroups = [
        {
            title: 'PLATFORM',
            items: [
                { icon: '◉', label: 'Command Center', path: '/command', shortcut: '⌘1' },
                { icon: '🗃', label: 'Secure Vault', path: '/vault', shortcut: '⌘2', badge: '247' },
                { icon: '✓', label: 'Compliance Hub', path: '/compliance', shortcut: '⌘3', badge: '98%' },
            ],
        },
        {
            title: 'SECURITY',
            items: [
                { icon: '⚙', label: 'Policy Engine', path: '/policy', shortcut: '⌘4' },
                { icon: '⛓', label: 'Audit Ledger', path: '/audit', shortcut: '⌘5' },
                { icon: '⚠', label: 'Threat Center', path: '/threat', shortcut: '⌘6', badge: '3' },
            ],
        },
        {
            title: 'CRYPTOGRAPHY',
            items: [
                { icon: '🔑', label: 'Key Management', path: '/keys', shortcut: '⌘7', badge: 'HSM' },
                { icon: '👤', label: 'Access Control', path: '/access', shortcut: '⌘8', badge: 'WARN' },
            ],
        },
        {
            title: 'SYSTEM',
            items: [
                { icon: '⚙', label: 'Configuration', path: '/config', shortcut: '⌘9' },
            ],
        },
    ]

    const isActive = (path: string) => location.pathname.includes(path)

    const mins = Math.floor(sessionTime / 60).toString().padStart(2, '0')
    const secs = (sessionTime % 60).toString().padStart(2, '0')
    const sessionColor = sessionTime > 3300 ? '#F59E0B' : '#10B981'

    const generateSparklinePoints = (): string => {
        if (hsmData.length === 0) return ''
        const max = Math.max(...hsmData)
        const min = Math.min(...hsmData)
        const range = max - min || 1
        return hsmData.map((v, i) => `${(i / (hsmData.length - 1)) * 100},${100 - ((v - min) / range) * 80}`).join(' ')
    }

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-logo">
                <div className="logo-icon">◈</div>
                <div className="logo-text">AegisShare v4.2.1</div>
            </div>

            <div className="sidebar-scroll">
                {navGroups.map((group) => (
                    <div key={group.title} className="nav-group">
                        <div className="nav-group-label nav-group-label-cinzel">{group.title}</div>
                        <div className="nav-items">
                            {group.items.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                                    data-label={item.label}
                                    title={`${item.label} (${item.shortcut})`}
                                    onMouseEnter={() => setHoveredShortcut(item.path)}
                                    onMouseLeave={() => setHoveredShortcut(null)}
                                >
                                    <span className="ni-icon">{item.icon}</span>
                                    <span className="ni-label">{item.label}</span>
                                    {item.badge && (
                                        <span className="ni-badge" title={item.badge}>
                                            {item.badge}
                                        </span>
                                    )}
                                    {!collapsed && (
                                        <span className={`ni-shortcut ${hoveredShortcut === item.path ? 'visible' : ''}`}>
                                            {item.shortcut}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="hsm-card">
                    <div className="hsm-header">
                        <span className="hsm-label">HSM · FIPS 140-3 L3</span>
                        <span className="hsm-dot">●</span>
                    </div>
                    <div className="hsm-region">CloudHSM · eu-west-1</div>
                    <div className="hsm-spark-wrap">
                        <svg viewBox="0 0 100 40" className="hsm-sparkline" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <polyline
                                points={generateSparklinePoints()}
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <polyline
                                points={`0,40 ${generateSparklinePoints().split(' ').join(' ')} 100,40`}
                                fill="url(#sparkGrad)"
                                stroke="none"
                            />
                        </svg>
                    </div>
                    <div className="hsm-stats">
                        <div className="hsm-stat">
                            <span className="stat-label">Latency</span>
                            <span className="stat-value">&lt; {hsmLatency}ms</span>
                        </div>
                        <div className="hsm-stat">
                            <span className="stat-label">Ops/sec</span>
                            <span className="stat-value">{hsmOps}/s</span>
                        </div>
                        <div className="hsm-stat">
                            <span className="stat-label">Keys</span>
                            <span className="stat-value">{hsmKeys}</span>
                        </div>
                    </div>
                    <div className="hsm-failover">
                        <div className="failover-dot">●</div>
                        <div className="failover-text">
                            <div className="failover-label">FAILOVER: HSM-2 · eu-west-2</div>
                            <div className="failover-status">Standby ready · 0 diverge</div>
                        </div>
                    </div>
                </div>

                <div className="user-card" ref={userCardRef}>
                    <div className="uc-avatar">JD</div>
                    <div className="uc-info">
                        <div className="uc-name">James Davis</div>
                        <div className="uc-role">Security Admin · L5</div>
                        <div
                            className="uc-session"
                            style={{
                                color: sessionTime > 3300 ? '#F59E0B' : '#10B981',
                                transition: 'color 0.3s ease-out'
                            }}
                        >
                            {mins}:{secs} session
                        </div>
                    </div>
                    <div className="uc-dot">●</div>

                    {/* S1.5: User Card Dropdown Menu */}
                    <button
                        className="uc-menu-btn"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        title="User menu"
                    >
                        ⋮
                    </button>

                    {userMenuOpen && !collapsed && (
                        <div className="uc-dropdown">
                            <div className="ucd-header">
                                <span className="ucd-user">James Davis</span>
                                <span className="ucd-clearance">TOP SECRET</span>
                            </div>
                            <div className="ucd-divider"></div>
                            <button
                                className="ucd-action"
                                onClick={() => {
                                    console.log('Manage Session')
                                    setUserMenuOpen(false)
                                }}
                            >
                                <span className="ucd-icon">⚙</span>
                                <span className="ucd-text">Manage Session</span>
                            </button>
                            <button
                                className="ucd-action"
                                onClick={() => {
                                    console.log('Switch Role')
                                    setUserMenuOpen(false)
                                }}
                            >
                                <span className="ucd-icon">👤</span>
                                <span className="ucd-text">Switch Role</span>
                            </button>
                            <button
                                className="ucd-action"
                                onClick={() => {
                                    console.log('Sign Out')
                                    setUserMenuOpen(false)
                                }}
                            >
                                <span className="ucd-icon">🚪</span>
                                <span className="ucd-text">Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <button
                ref={collapseBtnRef}
                className="sb-collapse-btn"
                onClick={() => onToggleCollapse?.()}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? '▶' : '◀'}
            </button>
        </aside>
    )
}

export default Sidebar
