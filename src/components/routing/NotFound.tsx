import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { VARIANTS, DURATION } from '@/styles/motion'

interface NotFoundProps {
  title?: string
  message?: string
  onGoBack?: () => void
  children?: ReactNode
}

export const NotFound = ({
  title = '404',
  message = 'Page not found',
  onGoBack,
  children,
}: NotFoundProps) => {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: DURATION.standard }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '120px',
            fontWeight: 700,
            color: 'var(--s3)',
            marginBottom: '16px',
            fontFamily: 'var(--font-display)',
          }}
        >
          {title}
        </div>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--t0)',
            margin: '0 0 12px 0',
          }}
        >
          {message}
        </h1>

        {children && <div style={{ marginTop: '24px' }}>{children}</div>}

        {onGoBack && (
          <button
            onClick={onGoBack}
            style={{
              marginTop: '24px',
              padding: '10px 20px',
              backgroundColor: 'var(--cy)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
            }}
          >
            Go Back
          </button>
        )}
      </div>
    </motion.div>
  )
}
