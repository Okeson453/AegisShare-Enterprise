import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

/**
 * NotFound Page (404)
 *
 * Displayed when user navigates to non-existent route
 * Features:
 * - Large 404 text
 * - Helpful description
 * - Back button + Home link
 * - Responsive layout
 */
export default function NotFound() {
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
        {/* 404 Icon */}
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          🔍
        </motion.div>

        {/* Status Code */}
        <h1 className={`font-black text-cy mb-2 ${isMobile ? 'text-5xl' : 'text-7xl'}`}>
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-t0 mb-3">Page Not Found</h2>

        {/* Description */}
        <p className="text-sm text-t2 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

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
            Back to Home
          </motion.button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-bd space-y-2">
          <p className="text-xs text-t2 uppercase font-mono mb-3">Quick Links</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Overview', '/overview'],
              ['Vault', '/vault'],
              ['Settings', '/settings'],
              ['Help', '#'],
            ].map(([label, path]) => (
              <motion.button
                key={label}
                onClick={() => path !== '#' && navigate(path as string)}
                className="text-xs text-cy hover:text-cy/80 underline"
                whileHover={{ scale: 1.05 }}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
