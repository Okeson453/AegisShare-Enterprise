import { ReactNode } from 'react'

interface ModalFooterProps {
  children: ReactNode
  alignment?: 'left' | 'center' | 'right'
}

export const ModalFooter = ({ children, alignment = 'right' }: ModalFooterProps) => {
  const justifyContent = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }[alignment]

  return (
    <div
      style={{
        padding: '24px',
        borderTop: '1px solid var(--bd)',
        display: 'flex',
        justifyContent,
        gap: '12px',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  )
}
