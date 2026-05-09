import { ReactNode } from 'react'
import { ToastContainer } from './ToastContainer'
import { useToast } from '@/hooks/useToast'

interface ToastProviderProps {
    children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    return (
        <>
            {children}
            <ToastContainer />
        </>
    )
}

// Re-export the useToast hook for convenience
export { useToast }
