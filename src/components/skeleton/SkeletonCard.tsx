import { motion } from 'framer-motion'
import { VARIANTS } from '@/styles/motion'

export const SkeletonCard = ({ animated = true }: { animated?: boolean }) => {
  const itemProps = animated ? { variants: VARIANTS.fadeUp } : {}

  return (
    <motion.div
      {...itemProps}
      style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'var(--s1)',
        border: '1px solid var(--bd)',
      }}
    >
      {/* Card header */}
      <div className="skeleton" style={{ width: '65%', height: '18px', marginBottom: '16px' }} />

      {/* Content lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="skeleton" style={{ width: '100%', height: '14px' }} />
        <div className="skeleton" style={{ width: '95%', height: '14px' }} />
        <div className="skeleton" style={{ width: '85%', height: '14px' }} />
      </div>
    </motion.div>
  )
}
