import { motion } from 'framer-motion'
import { VARIANTS } from '@/styles/motion'

export const SkeletonMerkleBlock = ({ count = 5, animated = true }: { count?: number; animated?: boolean }) => {
  const itemProps = animated ? { variants: VARIANTS.fadeUp } : {}

  return (
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflow: 'auto',
        padding: '20px',
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <motion.div key={idx} {...itemProps} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Block skeleton */}
          <div
            className="skeleton"
            style={{
              width: '140px',
              height: '120px',
              borderRadius: '8px',
              flexShrink: 0,
            }}
          />

          {/* Arrow between blocks (not on last) */}
          {idx < count - 1 && (
            <div
              className="skeleton"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                flexShrink: 0,
              }}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}
