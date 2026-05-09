import React from 'react'import '../../styles/access-control-extension.css';
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg'
}

const sizeStyles: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="flex items-center justify-center inset-0 absolute">
                <div
                    className={`
            ${sizeStyles[size]}
            bg-s0 border border-bd rounded-lg
            shadow-2xl animate-slideIn
          `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {title && (
                        <div className="px-6 py-4 border-b border-bd">
                            <h2 className="text-lg font-semibold text-t0">{title}</h2>
                        </div>
                    )}
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default Modal
