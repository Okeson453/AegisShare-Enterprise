import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface UserProfile {
    name: string
    email: string
    role: 'Admin' | 'Viewer' | 'Editor'
    clearanceLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
    department?: string
    joinDate: string
    lastActive: string
}

const mockUser: UserProfile = {
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@aegisshare.io',
    role: 'Admin',
    clearanceLevel: 'L5',
    department: 'Security Operations',
    joinDate: '2024-01-15',
    lastActive: '5 minutes ago',
}

/**
 * Profile Page — User profile management (read-only on this build)
 *
 * Desktop (lg+):
 *   ┌─────────────────────────────────────┐
 *   │ Avatar | Name, Role, Email          │
 *   ├─────────────────────────────────────┤
 *   │ Info Cards (read-only):             │
 *   │  • Department | Clearance Level     │
 *   │  • Joined | Last Active             │
 *   └─────────────────────────────────────┘
 *
 * Tablet/Mobile:
 *   Stack vertically, center-aligned
 */
export default function Profile() {
    const { isMobile, isTablet } = useBreakpoint()
    const [user] = useState<UserProfile>(mockUser)

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-bold text-t0">Profile</h1>
                <p className="text-sm text-t2">Manage your account information and credentials</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`
          bg-s2 border border-bd rounded-lg p-6
          ${isMobile ? 'p-4' : 'p-6'}
        `}
            >
                <div
                    className={`
            flex gap-6
            ${isMobile || isTablet ? 'flex-col items-center text-center' : 'items-start'}
          `}
                >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div
                            className={`
                rounded-full bg-gradient-to-br from-cy to-em flex items-center justify-center font-bold text-white
                ${isMobile ? 'w-16 h-16 text-xl' : 'w-20 h-20 text-2xl'}
              `}
                        >
                            SC
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className={`font-bold text-t0 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                            {user.name}
                        </h2>
                        <p className="text-sm text-t2 mt-1">{user.email}</p>
                        <div className={`flex gap-2 mt-3 ${isMobile || isTablet ? 'justify-center' : ''}`}>
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-cy/20 text-cy">
                                {user.role}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-em/20 text-em">
                                {user.clearanceLevel}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Details Grid */}
            <div
                className={`
          grid gap-4
          ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'}
        `}
            >
                {[
                    { label: 'Department', value: user.department || '—' },
                    { label: 'Clearance', value: user.clearanceLevel },
                    { label: 'Joined', value: user.joinDate },
                    { label: 'Last Active', value: user.lastActive },
                    { label: 'Status', value: 'Active' },
                    { label: 'MFA', value: 'Enabled' },
                ].map((item, idx) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                        className="bg-s2 border border-bd rounded-lg p-4"
                    >
                        <p className="text-xs text-t2 uppercase font-mono mb-2">{item.label}</p>
                        <p className="text-sm font-semibold text-t0">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Coming Soon Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-bd/20 border border-bd2 rounded-lg p-4 text-sm text-t2"
            >
                <p className="font-mono">
                    ℹ️ Profile editing, photo upload, and additional management features coming in next release.
                </p>
            </motion.div>
        </div>
    )
}
