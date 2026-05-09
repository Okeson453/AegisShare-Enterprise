import { ReactNode } from 'react'

interface ModalBodyProps {
    children: ReactNode
}

export const ModalBody = ({ children }: ModalBodyProps) => {
    return (
        <div
            style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                minHeight: '100px',
            }}
        >
            {children}
        </div>
    )
}
