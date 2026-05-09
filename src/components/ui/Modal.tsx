import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
    isOpen: boolean
    title: string
    children: React.ReactNode
    onClose: () => void
    isDestructive?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl'
    footer?: React.ReactNode
}

const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
}

/**
 * Modal Component — Dialog with backdrop and animations
 * Supports small, medium, large, and extra-large sizes
 * Features: Escape key support, z-index management, smooth animations
 */
export function Modal({
    isOpen,
    title,
    children,
    onClose,
    isDestructive = false,
    size = 'md',
    footer,
}: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isDestructive) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
            return () => {
                document.removeEventListener('keydown', handleEscape)
                document.body.style.overflow = 'unset'
            }
        }
    }, [isOpen, onClose, isDestructive])

    const portal = document.getElementById('modal-portal')
    if (!portal) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => !isDestructive && onClose()}
                        aria-hidden="true"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-modal pointer-events-none">
                        <motion.div
                            className={`
                                bg-s1 border border-bd rounded-lg shadow-modal
                                w-full mx-4 pointer-events-auto
                                ${sizeMap[size]}
                            `}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-bd">
                                <h2 className={`text-xl font-bold ${isDestructive ? 'text-rd' : 'text-t0'}`}>
                                    {title}
                                </h2>
                                {!isDestructive && (
                                    <button
                                        onClick={onClose}
                                        className="text-t2 hover:text-t0 transition-colors p-1"
                                        aria-label="Close modal"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                {children}
                            </div>

                            {/* Footer */}
                            {footer && (
                                <div className="border-t border-bd p-6 bg-s2 rounded-b-lg flex gap-3 justify-end">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        portal
    )
}

export default Modal
