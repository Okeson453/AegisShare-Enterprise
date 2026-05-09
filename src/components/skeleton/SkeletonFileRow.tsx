import { motion } from 'framer-motion'
import { VARIANTS } from '@/styles/motion'

export const SkeletonFileRow = ({ animated = true }: { animated?: boolean }) => {
  const skeletonProps = animated ? { variants: VARIANTS.fadeUp } : {}

  return (
    <motion.div
      {...skeletonProps}
      className="skeleton-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '6px',
      }}
    >
      {/* File type badge */}
      <div
        className="skeleton"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '4px',
        }}
      />

      {/* File name */}
      <div style={{ flex: 1 }}>
        <div
          className="skeleton"
          style={{
            width: '65%',
            height: '14px',
            marginBottom: '8px',
          }}
        />
        {/* Metadata line */}
        <div
          className="skeleton"
          style={{
            width: '100%',
            height: '10px',
          }}
        />
      </div>

      {/* File size tag */}
      <div
        className="skeleton"
        style={{
          width: '80px',
          height: '20px',
          borderRadius: '4px',
        }}
      />

      {/* Status tag */}
      <div
        className="skeleton"
        style={{
          width: '70px',
          height: '20px',
          borderRadius: '4px',
        }}
      />

      {/* Chevron icon */}
      <div
        className="skeleton"
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '3px',
        }}
      />
    </motion.div>
  )
}
