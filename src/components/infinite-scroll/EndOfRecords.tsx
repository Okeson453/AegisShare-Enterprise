import { motion } from 'framer-motion'
import { VARIANTS, DURATION } from '@/styles/motion'

interface EndOfRecordsProps {
  count: number
  singular?: string
  plural?: string
}

export const EndOfRecords = ({
  count,
  singular = 'record',
  plural = 'records',
}: EndOfRecordsProps) => {
  const label = count === 1 ? singular : plural

  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: DURATION.standard }}
      style={{
        padding: '32px 20px',
        textAlign: 'center',
        borderTop: '1px solid var(--bd)',
        marginTop: '32px',
      }}
    >
      <div
        style={{
          fontSize: '24px',
          marginBottom: '8px',
        }}
      >
        ✓
      </div>

      <p
        style={{
          margin: 0,
          fontSize: '14px',
          color: 'var(--t1)',
          fontWeight: 500,
          marginBottom: '4px',
        }}
      >
        You've reached the end
      </p>

      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: 'var(--t2)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.5px',
        }}
      >
        {count} {label} loaded
      </p>
    </motion.div>
  )
}
