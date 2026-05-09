import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface SecuritySetting {
    id: string
    label: string
    description: string
    status: boolean
    critical?: boolean
}

const securitySettings: SecuritySetting[] = [
    {
        id: 'mfa',
        label: 'Multi-Factor Authentication',
        description: 'Require 2FA for all sign-ins',
        status: true,
    },
    {
        id: 'biometric',
        label: 'Biometric Authentication',
        description: 'Allow fingerprint/face recognition',
        status: true,
    },
    {
        id: 'session-timeout',
        label: 'Session Auto-Timeout',
        description: 'Automatically sign out after 30 minutes of inactivity',
        status: true,
    },
    {
        id: 'ip-restriction',
        label: 'IP Address Restriction',
        description: 'Only allow access from whitelisted IPs (L4+ only)',
        status: false,
        critical: true,
    },
    {
        id: 'device-trust',
        label: 'Device Trust Management',
        description: 'Require device verification for new sign-ins',
        status: true,
    },
    {
        id: 'password-history',
        label: 'Password History',
        description: 'Prevent reuse of last 10 passwords',
        status: true,
        critical: true,
    },
]

/**
 * Security Page — Security settings and access controls
 *
 * Layout: Toggleable security features with descriptions
 * - Critical features marked with badge
 * - Status indicators (on/off)
 * - Responsive grid layout
 */
export default function Security() {
    const { isMobile } = useBreakpoint()
    const [settings, setSettings] = useState<SecuritySetting[]>(securitySettings)

    const toggleSetting = (id: string) => {
        setSettings((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-bold text-t0">Security</h1>
                <p className="text-sm text-t2">Manage authentication methods and access controls</p>
            </motion.div>

            {/* Security Settings List */}
            <div className="space-y-3">
                {settings.map((setting, idx) => (
                    <motion.div
                        key={setting.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={`
              bg-s2 border border-bd rounded-lg p-4
              flex items-center justify-between
              hover:border-bd2 transition-colors
              ${isMobile ? 'flex-col items-start gap-3' : ''}
            `}
                    >
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-t0">{setting.label}</h3>
                                {setting.critical && (
                                    <span className="px-2 py-0.5 rounded text-9px font-mono bg-em/20 text-em uppercase">
                                        Critical
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-t2 mt-1">{setting.description}</p>
                        </div>

                        {/* Toggle */}
                        <motion.button
                            onClick={() => toggleSetting(setting.id)}
                            className={`
                flex-shrink-0 w-12 h-6 rounded-full transition-colors relative
                ${setting.status ? 'bg-cy' : 'bg-bd'}
              `}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute w-5 h-5 rounded-full bg-white"
                                initial={false}
                                animate={{
                                    left: setting.status ? '6px' : '1px',
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                style={{ top: '2px' }}
                            />
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {/* Password Management Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="bg-s2 border border-bd rounded-lg p-6 space-y-4"
            >
                <h2 className="font-bold text-t0">Password Management</h2>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-cy text-white text-sm font-semibold hover:bg-cy/90 transition-colors"
                >
                    Change Password
                </motion.button>
                <p className="text-xs text-t2">
                    Last changed: 45 days ago • Expires in: 75 days (120-day rotation policy)
                </p>
            </motion.div>

            {/* Active Sessions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-s2 border border-bd rounded-lg p-6 space-y-4"
            >
                <h2 className="font-bold text-t0">Active Sessions</h2>
                <div className="space-y-2 text-xs text-t2">
                    <p>✓ This Device (Current) • Chrome on Windows • 192.168.1.100</p>
                    <p>✓ Mobile • Safari on iOS • 203.0.113.45</p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-em hover:text-em/80 font-semibold"
                    >
                        Sign out all other sessions
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}
