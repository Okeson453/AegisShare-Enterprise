import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION, VARIANTS } from '@/styles/motion'
import { useToastStore, type Toast as ToastType } from '@/store/toastStore'

const VARIANT_COLORS = {
  success: 'var(--em)',
  error: 'var(--rd)',
  warning: 'var(--am)',
  info: 'var(--cy)',
  critical: 'var(--vl)',
}

const VARIANT_STYLES = {
  success: {
    bg: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  warning: {
    bg: 'rgba(217, 119, 6, 0.05)',
    border: '1px solid rgba(217, 119, 6, 0.2)',
  },
  info: {
    bg: 'rgba(34, 211, 238, 0.05)',
    border: '1px solid rgba(34, 211, 238, 0.2)',
  },
  critical: {
    bg: 'rgba(168, 85, 247, 0.05)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
}

interface ToastProps {
  toast: ToastType
}

export const Toast = ({ toast }: ToastProps) => {
  const { remove } = useToastStore()

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        remove(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id, remove])

  const variantColor = VARIANT_COLORS[toast.variant]
  const variantStyle = VARIANT_STYLES[toast.variant]

  return (
    <motion.div
      layout
      variants={VARIANTS.fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: DURATION.fast }}
      style={{
        padding: '12px 16px',
        borderRadius: '6px',
        backgroundColor: variantStyle.bg,
        border: variantStyle.border,
        borderLeft: `4px solid ${variantColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
        minWidth: '320px',
        maxWidth: '420px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div style={{ flex: 1 }}>
        {/* Message */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--t0)',
            marginBottom: toast.metadata ? '8px' : '0',
            lineHeight: '1.4',
          }}
        >
          {toast.message}
        </div>

        {/* Metadata */}
        {toast.metadata && (
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--t2)',
              opacity: 0.8,
              letterSpacing: '0.5px',
            }}
          >
            {toast.metadata.timestamp && (
              <div>{new Date(toast.metadata.timestamp).toLocaleTimeString()}</div>
            )}
            {toast.metadata.code && <div>Code: {toast.metadata.code}</div>}
            {toast.metadata.details && <div>{toast.metadata.details}</div>}
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => remove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--t2)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          lineHeight: 1,
          opacity: 0.6,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.6'
        }}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </motion.div>
  )
}
