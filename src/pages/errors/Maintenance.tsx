import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

/**
 * Maintenance Page (503)
 *
 * Displayed when service is under maintenance
 * Features:
 * - Maintenance notice
 * - Estimated resume time
 * - Status page link
 * - Subscribe to updates
 * - Countdown animation
 */
export default function Maintenance() {
    const { isMobile } = useBreakpoint()

    const maintenanceEnd = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-s0 via-s1 to-s2">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md text-center"
            >
                {/* Maintenance Icon */}
                <motion.div
                    animate={{ scale: [1, 1.2, 0.95, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-7xl mb-6"
                >
                    🔧
                </motion.div>

                {/* Status Code */}
                <h1 className={`font-black text-cy mb-2 ${isMobile ? 'text-5xl' : 'text-7xl'}`}>
                    503
                </h1>

                {/* Title */}
                <h2 className="text-2xl font-bold text-t0 mb-3">Scheduled Maintenance</h2>

                {/* Status Badge */}
                <motion.div
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cy/20 text-cy text-9px font-mono uppercase mb-6">
                        <span className="w-2 h-2 rounded-full bg-cy animate-pulse" />
                        Under Maintenance
                    </span>
                </motion.div>

                {/* Description */}
                <p className="text-sm text-t2 mb-8">
                    We're performing scheduled maintenance to improve your experience. AegisShare will be back online soon.
                </p>

                {/* Maintenance Details */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-s2 border border-bd rounded-lg p-6 mb-8 space-y-4"
                >
                    <div>
                        <p className="text-9px text-t2 uppercase font-mono mb-2">Estimated Resume Time</p>
                        <p className={`font-mono text-cyan-400 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {maintenanceEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-9px text-t2 mt-1">{maintenanceEnd.toLocaleDateString()}</p>
                    </div>

                    <div className="border-t border-bd pt-4">
                        <p className="text-9px text-t2 uppercase font-mono mb-2">Affected Services</p>
                        <div className="text-left space-y-1 text-xs text-t2">
                            <p>✓ File Vault</p>
                            <p>✓ Compliance Hub</p>
                            <p>✓ Audit Ledger</p>
                            <p>✓ Key Management</p>
                        </div>
                    </div>

                    <div className="border-t border-bd pt-4">
                        <p className="text-9px text-t2 uppercase font-mono mb-2">Reason</p>
                        <p className="text-xs text-t2">
                            Critical security patches and database optimization
                        </p>
                    </div>
                </motion.div>

                {/* Maintenance Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-9px text-t2 uppercase font-mono">Progress</p>
                        <p className="text-9px text-cy font-mono">45%</p>
                    </div>
                    <div className="w-full h-2 bg-bd rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cy to-em"
                            initial={{ width: '0%' }}
                            animate={{ width: '45%' }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-lg bg-cy text-white font-semibold hover:bg-cy/90 transition-colors"
                    >
                        📊 Check Status Page
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-lg border border-bd bg-s2 text-t0 font-semibold hover:bg-s3 transition-colors"
                    >
                        🔔 Get Notifications
                    </motion.button>
                </div>

                {/* Email Subscription */}
                <div className="mt-8 pt-8 border-t border-bd">
                    <p className="text-xs text-t2 mb-3">Get notified when we're back online</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-3 py-2 bg-s1 border border-bd rounded text-t0 text-sm placeholder-t2 focus:outline-none focus:border-cy"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded bg-cy text-white font-semibold hover:bg-cy/90 text-sm"
                        >
                            Notify
                        </motion.button>
                    </div>
                </div>

                {/* Follow Us */}
                <div className="mt-8 pt-8 border-t border-bd space-y-3">
                    <p className="text-xs text-t2 uppercase font-mono">Stay Updated</p>
                    <div className="flex justify-center gap-4">
                        {['Twitter', 'Status Page', 'Discord'].map((link) => (
                            <motion.button
                                key={link}
                                whileHover={{ scale: 1.05 }}
                                className="text-xs text-cy hover:text-cy/80 underline"
                            >
                                {link}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
