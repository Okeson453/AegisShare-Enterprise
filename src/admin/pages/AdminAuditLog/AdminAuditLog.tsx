import { useState, useMemo } from 'react'
import { cn } from '../../../lib/utils'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'

interface AdminAction {
    id: string
    actor: string
    action: string
    resource: string
    changes?: Record<string, any>
    status: 'success' | 'failed'
    timestamp: string
    ipAddress: string
}

interface SystemEvent {
    id: string
    type: 'error' | 'warning' | 'info'
    message: string
    component: string
    timestamp: string
    details?: string
}

// Mock data
const MOCK_ADMIN_ACTIONS: AdminAction[] = [
    {
        id: 'act-001',
        actor: 'alice@company.com',
        action: 'Create Incident',
        resource: 'Incident #P0-001',
        status: 'success',
        timestamp: '2026-04-06T14:30:00Z',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'act-002',
        actor: 'bob@company.com',
        action: 'Provision User',
        resource: 'newuser@company.com (L3)',
        status: 'success',
        timestamp: '2026-04-06T13:15:00Z',
        ipAddress: '10.0.0.50',
    },
    {
        id: 'act-003',
        actor: 'charlie@company.com',
        action: 'Update Config',
        resource: 'max_concurrent_sessions',
        changes: { from: 100, to: 150 },
        status: 'success',
        timestamp: '2026-04-06T12:00:00Z',
        ipAddress: '172.16.0.25',
    },
    {
        id: 'act-004',
        actor: 'david@company.com',
        action: 'Reset MFA',
        resource: 'user@company.com',
        status: 'failed',
        timestamp: '2026-04-06T11:45:00Z',
        ipAddress: '192.168.2.80',
    },
    {
        id: 'act-005',
        actor: 'eve@company.com',
        action: 'Access Export',
        resource: 'Admin Audit Log (full)',
        status: 'success',
        timestamp: '2026-04-06T10:30:00Z',
        ipAddress: '10.0.1.200',
    },
]

const MOCK_SYSTEM_EVENTS: SystemEvent[] = [
    {
        id: 'evt-001',
        type: 'error',
        message: 'Database connection timeout',
        component: 'Admin Service',
        timestamp: '2026-04-06T14:00:00Z',
        details: 'Connection to primary DB failed, switched to replica',
    },
    {
        id: 'evt-002',
        type: 'warning',
        message: 'High memory usage detected',
        component: 'Service Health Monitor',
        timestamp: '2026-04-06T13:30:00Z',
        details: 'Memory usage at 85%, investigating...',
    },
    {
        id: 'evt-003',
        type: 'info',
        message: 'Backup snapshot created',
        component: 'Backup Service',
        timestamp: '2026-04-06T12:00:00Z',
        details: 'Snapshot ID: snap-20260406-001, Size: 2.3 GB',
    },
    {
        id: 'evt-004',
        type: 'warning',
        message: 'Failed login attempt',
        component: 'Auth Service',
        timestamp: '2026-04-06T11:15:00Z',
        details: 'Multiple failed attempts from IP 203.0.113.45',
    },
]

const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
        'Create Incident': 's12-error-state',
        'Provision User': 's12-success-state',
        'Deprovision User': 's12-warning-state',
        'Update Config': 's12-info-state',
        'Reset MFA': 's12-warning-state',
        'Access Export': 's12-badge-default',
    }
    return colors[action] || 's12-badge-muted'
}

const getStatusIcon = (status: string) => status === 'success' ? '✓' : '✗'
const getStatusColor = (status: string) => status === 'success' ? 's12-text-success' : 's12-text-error'

const getEventTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
        error: '⚠',
        warning: '!',
        info: 'ⓘ',
    }
    return icons[type] || '?'
}

const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
        error: 's12-error-state',
        warning: 's12-warning-state',
        info: 's12-info-state',
    }
    return colors[type] || 's12-badge-muted'
}

export const AdminAuditLog = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterActor, setFilterActor] = useState('all')
    const [filterAction, setFilterAction] = useState('all')
    const [tab, setTab] = useState<'actions' | 'events'>('actions')

    const actors = useMemo(() => ['all', ...new Set(MOCK_ADMIN_ACTIONS.map(a => a.actor))], [])
    const actions = useMemo(() => ['all', ...new Set(MOCK_ADMIN_ACTIONS.map(a => a.action))], [])

    const filteredActions = useMemo(() => {
        return MOCK_ADMIN_ACTIONS.filter(action => {
            const matchesSearch = searchTerm === '' ||
                action.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                action.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                action.resource.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesActor = filterActor === 'all' || action.actor === filterActor
            const matchesAction = filterAction === 'all' || action.action === filterAction

            return matchesSearch && matchesActor && matchesAction
        })
    }, [searchTerm, filterActor, filterAction])

    const filteredEvents = useMemo(() => {
        return MOCK_SYSTEM_EVENTS.filter(event => {
            return searchTerm === '' ||
                event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.component.toLowerCase().includes(searchTerm.toLowerCase())
        })
    }, [searchTerm])

    return (
        <AdminPageWrapper title='Audit Log' subtitle='Track all administrative actions and system events'>
            <div className='s12-stack-lg'>

            {/* Tabs */}
            <div className='s12-flex s12-items-center s12-gap-4 s12-border-b s12-border-accent'>
                <button
                    onClick={() => setTab('actions')}
                    className={cn(
                        's12-px-4 s12-py-3 s12-font-bold s12-border-b-2 s12-transition-colors',
                        tab === 'actions'
                            ? 's12-border-warning s12-text-warning'
                            : 's12-border-transparent s12-text-muted s12-hover:text-subtle'
                    )}
                >
                    Admin Actions
                </button>
                <button
                    onClick={() => setTab('events')}
                    className={cn(
                        's12-px-4 s12-py-3 s12-font-bold s12-border-b-2 s12-transition-colors',
                        tab === 'events'
                            ? 's12-border-warning s12-text-warning'
                            : 's12-border-transparent s12-text-muted s12-hover:text-subtle'
                    )}
                >
                    System Events
                </button>
            </div>

            {tab === 'actions' ? (
                <div className='s12-stack-md'>
                    {/* Controls */}
                    <div className='s12-flex s12-flex-col s12-gap-3'>
                        <input
                            type='text'
                            placeholder='Search actions, actors, resources...'
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className='s12-input s12-px-4 s12-py-2'
                        />
                        <div className='bento bento-2'>
                            <select
                                aria-label='Filter actions by actor'
                                value={filterActor}
                                onChange={e => setFilterActor(e.target.value)}
                                className='s12-input s12-px-4 s12-py-2'
                            >
                                <option value='all'>All Actors</option>
                                {actors.map(actor => actor !== 'all' && (
                                    <option key={actor} value={actor}>{actor}</option>
                                ))}
                            </select>
                            <select
                                aria-label='Filter actions by type'
                                value={filterAction}
                                onChange={e => setFilterAction(e.target.value)}
                                className='s12-input s12-px-4 s12-py-2'
                            >
                                <option value='all'>All Actions</option>
                                {actions.map(action => action !== 'all' && (
                                    <option key={action} value={action}>{action}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions Timeline */}
                    <div className='s12-stack-sm'>
                        {filteredActions.length === 0 ? (
                            <div className='s12-text-center s12-py-8 s12-text-muted'>No actions found</div>
                        ) : (
                            filteredActions.map(action => (
                                <div
                                    key={action.id}
                                    className='s12-section s12-stack-md s12-transition-colors'
                                >
                                    <div className='s12-flex s12-items-start s12-justify-between s12-mb-3'>
                                        <div className='s12-flex-1'>
                                            <div className='s12-flex s12-items-center s12-gap-2 s12-mb-1'>
                                                <span className={cn('s12-px-2 s12-py-1 s12-rounded s12-border s12-text-xs s12-font-bold', getActionColor(action.action))}>
                                                    {action.action}
                                                </span>
                                                <span className={cn('s12-text-xl s12-font-bold', getStatusColor(action.status))}>
                                                    {getStatusIcon(action.status)}
                                                </span>
                                            </div>
                                            <p className='s12-text-sm s12-text-emphasis'>{action.resource}</p>
                                        </div>
                                        <p className='s12-text-xs s12-text-muted'>
                                            {new Date(action.timestamp).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className='bento bento-3'>
                                        <div>
                                            <p className='s12-text-xs s12-font-bold s12-text-muted s12-mb-1'>ACTOR</p>
                                            <p className='s12-text-emphasis'>{action.actor}</p>
                                        </div>
                                        <div>
                                            <p className='s12-text-xs s12-font-bold s12-text-muted s12-mb-1'>IP ADDRESS</p>
                                            <p className='s12-text-emphasis s12-font-mono s12-text-xs'>{action.ipAddress}</p>
                                        </div>
                                        {action.changes && (
                                            <div>
                                                <p className='s12-text-xs s12-font-bold s12-text-muted s12-mb-1'>CHANGES</p>
                                                <p className='s12-text-emphasis s12-text-xs'>
                                                    {Object.entries(action.changes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className='s12-stack-md'>
                    {/* Events Search */}
                    <input
                        type='text'
                        aria-label='Search system events'
                        placeholder='Search system events...'
                        className='s12-input s12-w-full s12-px-4 s12-py-2'
                    />

                    {/* Events Timeline */}
                    <div className='s12-stack-sm'>
                        {filteredEvents.length === 0 ? (
                            <div className='s12-text-center s12-py-8 s12-text-muted'>No events found</div>
                        ) : (
                            filteredEvents.map(event => (
                                <div
                                    key={event.id}
                                    className={cn('s12-section s12-stack-md', getEventTypeColor(event.type))}
                                >
                                    <div className='s12-flex s12-items-start s12-gap-3 s12-mb-2'>
                                        <span className='s12-text-2xl s12-flex-shrink-0'>{getEventTypeIcon(event.type)}</span>
                                        <div className='s12-flex-1 s12-min-w-0'>
                                            <p className='s12-font-bold s12-text-emphasis'>{event.message}</p>
                                            <p className='s12-text-xs s12-text-muted s12-mt-1'>{event.component}</p>
                                        </div>
                                        <p className='s12-text-xs s12-text-muted s12-whitespace-nowrap'>
                                            {new Date(event.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    {event.details && (
                                        <div className='s12-ml-10 s12-mt-2 s12-p-2 s12-bg-slate-900/50 s12-rounded s12-border s12-border-accent'>
                                            <p className='s12-text-xs s12-text-muted'>{event.details}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
        </AdminPageWrapper>
    )
}
