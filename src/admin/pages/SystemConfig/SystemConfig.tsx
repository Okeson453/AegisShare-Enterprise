import { useState, useMemo } from 'react'
import { cn } from '../../../lib/utils'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'

interface ConfigItem {
    key: string
    value: string | number | boolean
    type: 'string' | 'number' | 'boolean' | 'select'
    category: 'security' | 'performance' | 'advanced' | 'danger'
    description: string
    options?: string[]
    isDangerous?: boolean
}

// Mock configuration data
const MOCK_CONFIG: ConfigItem[] = [
    // Security
    {
        key: 'session_timeout_minutes',
        value: 30,
        type: 'number',
        category: 'security',
        description: 'Session timeout duration in minutes',
    },
    {
        key: 'require_mfa',
        value: true,
        type: 'boolean',
        category: 'security',
        description: 'Require MFA for all admin users',
    },
    {
        key: 'password_min_length',
        value: 12,
        type: 'number',
        category: 'security',
        description: 'Minimum password length requirement',
    },
    {
        key: 'failed_login_lockout',
        value: 5,
        type: 'number',
        category: 'security',
        description: 'Failed login attempts before lockout',
    },
    // Performance
    {
        key: 'max_concurrent_sessions',
        value: 100,
        type: 'number',
        category: 'performance',
        description: 'Maximum concurrent active sessions',
    },
    {
        key: 'api_rate_limit',
        value: 1000,
        type: 'number',
        category: 'performance',
        description: 'API calls per minute per user',
    },
    {
        key: 'backup_interval_hours',
        value: 6,
        type: 'number',
        category: 'performance',
        description: 'Automated backup interval in hours',
    },
    {
        key: 'log_retention_days',
        value: 90,
        type: 'number',
        category: 'performance',
        description: 'Log retention period in days',
    },
    // Advanced
    {
        key: 'enable_audit_logging',
        value: true,
        type: 'boolean',
        category: 'advanced',
        description: 'Enable detailed audit logging for all operations',
    },
    {
        key: 'encryption_algorithm',
        value: 'AES-256-GCM',
        type: 'select',
        category: 'advanced',
        options: ['AES-256-GCM', 'AES-192-GCM', 'ChaCha20-Poly1305'],
        description: 'Data encryption algorithm',
    },
    {
        key: 'tls_version',
        value: '1.3',
        type: 'select',
        category: 'advanced',
        options: ['1.2', '1.3'],
        description: 'Minimum TLS version for connections',
    },
    // Danger Zone
    {
        key: 'allow_data_export',
        value: false,
        type: 'boolean',
        category: 'danger',
        isDangerous: true,
        description: 'Allow bulk data export functionality (requires 2FA verification)',
    },
    {
        key: 'maintenance_mode',
        value: false,
        type: 'boolean',
        category: 'danger',
        isDangerous: true,
        description: 'Enable maintenance mode (disables all public access)',
    },
]

const CATEGORY_COLORS: Record<string, string> = {
    security: 's12-border-l-4 s12-border-l-blue',
    performance: 's12-border-l-4 s12-border-l-success',
    advanced: 's12-border-l-4 s12-border-l-accent',
    danger: 's12-border-l-4 s12-border-l-error',
}

const CATEGORY_LABELS: Record<string, string> = {
    security: 'Security Settings',
    performance: 'Performance Tuning',
    advanced: 'Advanced Configuration',
    danger: 'Danger Zone',
}

export const SystemConfig = () => {
    const [editingKey, setEditingKey] = useState<string | null>(null)
    const [tempValue, setTempValue] = useState<any>(null)
    const [confirmDanger, setConfirmDanger] = useState<string | null>(null)
    const [confirmCode, setConfirmCode] = useState('')

    const categories = useMemo(
        () => ['security', 'performance', 'advanced', 'danger'] as const,
        []
    )

    const configByCategory = useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat] = MOCK_CONFIG.filter(c => c.category === cat)
            return acc
        }, {} as Record<typeof categories[number], ConfigItem[]>)
    }, [categories])

    const handleEdit = (config: ConfigItem) => {
        setEditingKey(config.key)
        setTempValue(config.value)
    }

    const handleSave = (config: ConfigItem) => {
        if (config.isDangerous) {
            setConfirmDanger(config.key)
        } else {
            // In real app, would call API to update
            setEditingKey(null)
            setTempValue(null)
        }
    }

    const handleConfirmDanger = () => {
        if (confirmCode === '12345') { // Mock verification
            setEditingKey(null)
            setTempValue(null)
            setConfirmDanger(null)
            setConfirmCode('')
            // In real app, would call API to update
        }
    }

    const renderConfigValue = (config: ConfigItem) => {
        if (editingKey === config.key) {
            if (config.type === 'boolean') {
                return (
                    <input
                        type='checkbox'
                        aria-label={`Toggle ${config.key}`}
                        checked={tempValue}
                        onChange={e => setTempValue(e.target.checked)}
                        className='s12-w-5 s12-h-5 s12-rounded s12-cursor-pointer'
                    />
                )
            } else if (config.type === 'select') {
                return (
                    <select
                        aria-label={`Select value for ${config.key}`}
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        className='s12-input s12-px-3 s12-py-1 s12-text-sm'
                    >
                        {config.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                )
            } else if (config.type === 'number') {
                return (
                    <input
                        type='number'
                        aria-label={`Enter numeric value for ${config.key}`}
                        value={tempValue}
                        onChange={e => setTempValue(Number(e.target.value))}
                        className='s12-input s12-px-3 s12-py-1 s12-text-sm s12-w-24'
                    />
                )
            } else {
                return (
                    <input
                        type='text'
                        aria-label={`Enter text value for ${config.key}`}
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        className='s12-input s12-px-3 s12-py-1 s12-text-sm s12-w-40'
                    />
                )
            }
        }

        if (config.type === 'boolean') {
            return (
                <span className={cn(
                    's12-px-2 s12-py-1 s12-rounded s12-text-xs s12-font-bold s12-border',
                    config.value
                        ? 's12-success-state'
                        : 's12-badge-muted'
                )}>
                    {config.value ? 'TRUE' : 'FALSE'}
                </span>
            )
        }

        return <span className='s12-text-emphasis'>{String(config.value)}</span>
    }

    return (
        <AdminPageWrapper title='System Configuration' subtitle='Manage system settings and configuration parameters'>
            <div className='s12-stack-lg'>
                {/* Configuration Sections */}
                {categories.map(category => (
                    <div key={category} className='s12-stack-md'>
                        <h2 className={cn('s12-text-2xl s12-font-bold s12-text-emphasis s12-pb-3 s12-border-b', category === 'danger' ? 's12-border-error' : 's12-border-accent')}>
                            {CATEGORY_LABELS[category]}
                        </h2>

                        {category === 'danger' && (
                            <div className='s12-section s12-warning-state s12-row-md s12-gap-3'>
                                <span className='s12-text-2xl s12-flex-shrink-0'>⚠️</span>
                                <div>
                                    <p className='s12-font-bold s12-text-emphasis s12-mb-1'>Danger Zone Settings</p>
                                    <p className='s12-text-sm s12-text-muted'>
                                        These settings can significantly impact system security and operations. Changes require verification and 2FA confirmation.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className='s12-stack-sm'>
                            {configByCategory[category].map(config => (
                                <div
                                    key={config.key}
                                    className={cn(
                                        's12-section s12-row-md s12-justify-between s12-gap-4',
                                        config.isDangerous
                                            ? 's12-error-state'
                                            : '',
                                        editingKey === config.key && 's12-border-warning'
                                    )}
                                >
                                    <div className='s12-flex-1'>
                                        <div className='s12-flex s12-items-center s12-gap-2 s12-mb-2'>
                                            <code className='s12-px-2 s12-py-1 s12-bg-slate-800 s12-rounded s12-text-xs s12-font-mono s12-text-muted'>
                                                {config.key}
                                            </code>
                                            {config.isDangerous && (
                                                <span className='s12-text-xs s12-px-2 s12-py-1 s12-badge-error s12-font-bold'>
                                                    DANGEROUS
                                                </span>
                                            )}
                                        </div>
                                        <p className='s12-text-sm s12-text-muted s12-mt-2'>{config.description}</p>
                                    </div>

                                    <div className='s12-flex s12-items-center s12-gap-3'>
                                        {renderConfigValue(config)}

                                        {editingKey === config.key ? (
                                            <div className='s12-flex s12-gap-2'>
                                                <button
                                                    onClick={() => handleSave(config)}
                                                    className='s12-btn s12-btn-primary s12-px-3 s12-py-1 s12-text-xs'
                                                >
                                                    Save
                                                </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingKey(null)
                                                            setTempValue(null)
                                                        }}
                                                        className='s12-btn s12-btn-secondary s12-px-3 s12-py-1 s12-text-xs'
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(config)}
                                                    className='s12-btn s12-btn-secondary s12-px-3 s12-py-1 s12-text-xs'
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Danger Confirmation Modal */}
                {confirmDanger && (
                    <div className='s12-fixed s12-inset-0 s12-bg-black/50 s12-flex s12-items-center s12-justify-center s12-z-50'>
                        <div className='s12-section s12-error-state s12-max-w-md s12-stack-md'>
                            <h3 className='s12-text-xl s12-font-bold s12-text-error'>Confirm Dangerous Change</h3>
                            <p className='s12-text-muted s12-text-sm'>
                                You're about to modify a critical configuration that could impact system operation. This action requires verification.
                            </p>

                            <div className='s12-stack-sm'>
                                <p className='s12-text-xs s12-font-bold s12-text-muted'>
                                    Enter verification code (hint: 5-digit number):
                                </p>
                                <input
                                    type='password'
                                    value={confirmCode}
                                    onChange={e => setConfirmCode(e.target.value)}
                                    placeholder='00000'
                                    className='s12-input s12-w-full s12-px-4 s12-py-2 s12-text-center s12-font-mono s12-tracking-widest'
                                />
                            </div>

                            <div className='s12-p-3 s12-rounded s12-border s12-border-accent s12-bg-slate-800/50'>
                                <p className='s12-text-xs s12-text-muted'>
                                    <span className='s12-font-bold'>For testing:</span>  Enter <span className='s12-text-warning'>12345</span>
                                </p>
                            </div>

                            <div className='s12-flex s12-gap-3'>
                                <button
                                    onClick={handleConfirmDanger}
                                    className={cn(
                                        's12-flex-1 s12-px-4 s12-py-2 s12-rounded s12-font-bold s12-text-sm s12-transition-all s12-btn',
                                        confirmCode === '12345'
                                            ? 's12-btn-danger'
                                            : 's12-btn-disabled'
                                    )}
                                    disabled={confirmCode !== '12345'}
                                >
                                    Confirm Change
                                </button>
                                <button
                                    onClick={() => {
                                        setConfirmDanger(null)
                                        setConfirmCode('')
                                    }}
                                    className='s12-flex-1 s12-btn s12-btn-secondary s12-px-4 s12-py-2 s12-font-bold s12-text-sm'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    )
}
