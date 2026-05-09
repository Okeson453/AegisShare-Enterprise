import { motion } from 'framer-motion'
import { DURATION, VARIANTS } from '@/styles/motion'

/**
 * Full-page loader shown during route transitions
 * NEVER use spinners — use skeleton components for specific sections
 */
export default function PageLoader() {
  return (
    <motion.div
      className="w-full h-dvh flex items-center justify-center bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.fast }}
    >
      {/* Loading skeleton backdrop — shows page structure during load */}
      <div className="w-full max-w-screen-4k px-4 sm:px-5 lg:px-6">
        {/* Topbar skeleton */}
        <div
          className="h-14 bg-gradient-to-r from-s1 via-s2 to-s1 rounded-lg mb-6 animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
            backgroundPosition: '-200% 0',
          }}
        />

        {/* Content skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-br from-s1 via-s2 to-s1 animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
                backgroundPosition: '-200% 0',
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: DURATION.standard }}
            />
          ))}
        </div>

        {/* Large content skeleton */}
        <motion.div
          className="mt-8 h-96 rounded-lg bg-gradient-to-r from-s1 via-s2 to-s1 animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
            backgroundPosition: '-200% 0',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: DURATION.standard }}
        />
      </div>
    </motion.div>
  )
}
