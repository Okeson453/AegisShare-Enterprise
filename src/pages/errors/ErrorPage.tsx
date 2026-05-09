import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

/**
 * Error Page (500)
 *
 * Displayed when an unexpected error occurs
 * Features:
 * - Error code display
 * - Error details/debugging info
 * - Retry button
 * - Error reporting option
 * - Navigation back
 */
export default function ErrorPage() {
    const navigate = useNavigate()
    const { isMobile } = useBreakpoint()

    const errorId = `ERR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const timestamp = new Date().toISOString()

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-s0 via-s1 to-s2">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Explosion Icon */}
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 0.95, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-6 text-center"
                >
                    💥
                </motion.div>

                {/* Status Code */}
                <h1 className={`font-black text-em mb-2 text-center ${isMobile ? 'text-5xl' : 'text-7xl'}`}>
                    500
                </h1>

                {/* Title */}
                <h2 className="text-2xl font-bold text-t0 mb-2 text-center">Something Went Wrong</h2>
                <p className="text-sm text-t2 text-center mb-8">
                    We encountered an unexpected error. Our team has been notified.
                </p>

                {/* Error Details Box */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-s2 border border-bd rounded-lg p-4 mb-6 space-y-2 text-left"
                >
                    <div>
                        <p className="text-9px text-t2 uppercase font-mono">Error ID</p>
                        <p className="text-xs font-mono text-cy font-semibold">{errorId}</p>
                    </div>
                    <div className="border-t border-bd pt-2">
                        <p className="text-9px text-t2 uppercase font-mono">Timestamp</p>
                        <p className="text-9px font-mono text-t2">{timestamp}</p>
                    </div>
                    <div className="border-t border-bd pt-2">
                        <p className="text-9px text-t2 uppercase font-mono">Status</p>
                        <p className="text-xs font-mono text-em">Internal Server Error</p>
                    </div>
                </motion.div>

                {/* Help Text */}
                <p className="text-xs text-t2 text-center mb-6">
                    Please share the error ID above if you contact support. It will help us investigate faster.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                    <motion.button
                        onClick={() => window.location.reload()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-lg bg-cy text-white font-semibold hover:bg-cy/90 transition-colors"
                    >
                        🔄 Try Again
                    </motion.button>
                    <motion.button
                        onClick={() => navigate('/overview')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-lg border border-bd bg-s2 text-t0 font-semibold hover:bg-s3 transition-colors"
                    >
                        Go to Dashboard
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-lg bg-em/20 text-em font-semibold hover:bg-em/30 transition-colors"
                    >
                        Report Issue
                    </motion.button>
                </div>

                {/* Debug Info (Development Only) */}
                {import.meta.env.DEV && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 pt-6 border-t border-bd/50"
                    >
                        <details className="text-left">
                            <summary className="text-9px text-t2 uppercase font-mono cursor-pointer hover:text-t1">
                                💻 Debug Information
                            </summary>
                            <pre className="mt-3 p-3 bg-s1 border border-bd rounded text-9px font-mono text-t2 overflow-auto max-h-40">
                                {`Error {
  id: "${errorId}",
  code: 500,
  message: "Internal Server Error",
  timestamp: "${timestamp}",
  path: "${window.location.pathname}",
  userAgent: "${navigator.userAgent}"
}`}
                            </pre>
                        </details>
                    </motion.div>
                )}

                {/* Support Links */}
                <div className="mt-8 pt-6 border-t border-bd text-center space-y-2">
                    <p className="text-xs text-t2 uppercase font-mono mb-3">Need Help?</p>
                    <div className="flex flex-col gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="text-xs text-cy hover:text-cy/80 underline"
                        >
                            View System Status
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="text-xs text-cy hover:text-cy/80 underline"
                        >
                            Contact Support
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
