import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { VARIANTS, DURATION } from '@/styles/motion'

interface ErrorPageProps {
  title?: string
  message?: string
  details?: string
  onRetry?: () => void
  onGoHome?: () => void
  children?: ReactNode
}

export const ErrorPage = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred',
  details,
  onRetry,
  onGoHome,
  children,
}: ErrorPageProps) => {
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
      <div style={{ textAlign: 'center', maxWidth: '520px' }}>
        <div
          style={{
            fontSize: '48px',
            marginBottom: '16px',
          }}
        >
          ⚠️
        </div>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--t0)',
            margin: '0 0 12px 0',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--t1)',
            margin: '0 0 16px 0',
            lineHeight: '1.6',
          }}
        >
          {message}
        </p>

        {details && (
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--s1)',
              border: '1px solid var(--bd)',
              borderRadius: '6px',
              marginBottom: '24px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--t2)',
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: '200px',
              letterSpacing: '0.5px',
            }}
          >
            {details}
          </div>
        )}

        {children && <div style={{ marginBottom: '24px' }}>{children}</div>}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
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
              Retry
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--s1)',
                border: '1px solid var(--bd)',
                borderRadius: '6px',
                color: 'var(--t0)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = 'var(--s2)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = 'var(--s1)'
              }}
            >
              Go Home
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
