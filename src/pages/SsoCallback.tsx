import { memo } from 'react'
import { motion } from 'framer-motion'
import { VARIANTS } from '@/styles/motion'

/**
 * SsoCallback.tsx — OAuth/SAML callback handler
 * Processes successful authentication from external providers
 */
const SsoCallback = memo(function SsoCallback() {
  // Set page title
  if (typeof document !== 'undefined') {
    document.title = 'Signing in — AegisShare'
  }

  return (
    <div>
      <motion.div
        className="w-full h-dvh flex items-center justify-center bg-bg"
        variants={VARIANTS.fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <h1 className="text-2xl font-display text-t0 mb-4">Completing sign in…</h1>
          <p className="text-t2">Exchanging credentials with your identity provider</p>
        </div>
      </motion.div>
    </div>
  )
})

export default SsoCallback
