import React, { useEffect, ReactNode } from 'react'

interface DrawerProps {
    open: boolean
    onClose: () => void
    position?: 'left' | 'right'
    title?: string
    children: ReactNode
    footer?: ReactNode
    width?: string
    className?: string
}

const Drawer: React.FC<DrawerProps> = ({
    open,
    onClose,
    position = 'right',
    title,
    children,
    footer,
    width = '400px',
    className = '',
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (open) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
            return () => {
                document.removeEventListener('keydown', handleEscape)
                document.body.style.overflow = 'auto'
            }
        }
    }, [open, onClose])

    if (!open) return null

    const positionClasses = {
        left: 'left-0 animate-slide-in-left',
        right: 'right-0 animate-slide-in-right',
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black/75 backdrop-blur-8px z-modal-backdrop animate-fade-in"
                onClick={onClose}
            />
            <div
                className={`fixed top-0 ${positionClasses[position]} bottom-0 
                z-modal bg-s1 shadow-shadow-2xl flex flex-col
                transition-transform duration-300 ${className}`}
                style={{ width }}
            >
                {title && (
                    <div className="flex items-center justify-between p-16px border-b border-bd">
                        <h2 className="text-13px font-700 text-t0">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-t2 hover:text-t0 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-16px">{children}</div>

                {footer && (
                    <div className="border-t border-bd p-16px bg-s2">{footer}</div>
                )}
            </div>
        </>
    )
}

export default Drawer
