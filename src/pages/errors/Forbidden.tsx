import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

/**
 * Forbidden Page (403)
 *
 * Displayed when user lacks clearance/permissions for a resource
 * Features:
 * - Lock icon
 * - Clearance level requirement info
 * - Request escalation button
 * - Navigation back options
 */
export default function Forbidden() {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-s0 via-s1 to-s2">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        {/* Lock Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          🔐
        </motion.div>

        {/* Status Code */}
        <h1 className={`font-black text-em mb-2 ${isMobile ? 'text-5xl' : 'text-7xl'}`}>
          403
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-t0 mb-3">Access Denied</h2>

        {/* Description */}
        <p className="text-sm text-t2 mb-6">
          Your current clearance level doesn't allow access to this resource. You may need a higher
          authorization level or special permissions.
        </p>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-em/10 border border-em/30 rounded-lg p-4 mb-8"
        >
          <p className="text-xs font-mono text-em uppercase mb-2">⚠️ Access Information</p>
          <p className="text-xs text-t2">
            Your clearance: <span className="text-t0 font-semibold">L2</span>
          </p>
          <p className="text-xs text-t2">
            Required: <span className="text-t0 font-semibold">L4+</span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg bg-cy text-white font-semibold hover:bg-cy/90 transition-colors"
          >
            ← Go Back
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
            Request Access
          </motion.button>
        </div>

        {/* Escalation Info */}
        <div className="mt-12 pt-8 border-t border-bd space-y-3">
          <p className="text-xs text-t2 uppercase font-mono">Need higher access?</p>
          <p className="text-xs text-t2">
            Contact your security administrator to request a clearance level upgrade. Access requests are
            typically reviewed within 24 hours.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="text-xs text-cy hover:text-cy/80 font-semibold underline"
          >
            View policy details
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
