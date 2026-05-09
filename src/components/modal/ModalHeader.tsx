import { ReactNode } from 'react'

interface ModalHeaderProps {
  children: ReactNode
  onClose: () => void
  subtitle?: string
}

export const ModalHeader = ({ children, onClose, subtitle }: ModalHeaderProps) => {
  return (
    <div
      style={{
        padding: '24px',
        borderBottom: '1px solid var(--bd)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
      }}
    >
      <div style={{ flex: 1 }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--t0)',
            margin: '0 0 8px 0',
            lineHeight: '1.3',
          }}
        >
          {children}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--t2)',
              margin: 0,
              lineHeight: '1.4',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          color: 'var(--t2)',
          cursor: 'pointer',
          fontSize: '20px',
          lineHeight: 1,
          padding: '4px',
          opacity: 0.6,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.6'
        }}
        aria-label="Close dialog"
      >
        ✕
      </button>
    </div>
  )
}
