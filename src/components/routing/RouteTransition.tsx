import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { VARIANTS, DURATION } from '@/styles/motion'

interface RouteTransitionProps {
  children: ReactNode
}

/**
 * Wraps page content with consistent entry animation
 * Applied to all routes for smooth transitions
 */
export default function RouteTransition({ children }: RouteTransitionProps) {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: DURATION.standard }}
    >
      {children}
    </motion.div>
  )
}
