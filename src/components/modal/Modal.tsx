import { ReactNode, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION, VARIANTS } from '@/styles/motion'
import { useFocusTrap } from '@/utils/focusTrap'
import { lockScroll } from '@/utils/scrollLock'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    maxWidth?: number
}

export const Modal = ({ isOpen, onClose, children, maxWidth = 520 }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null)

    useFocusTrap(modalRef, { escapeDeactivates: true })

    useEffect(() => {
        if (isOpen) {
            const unlock = lockScroll('modal')
            return () => {
                unlock()
            }
        }
    }, [isOpen])

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-overlay"
                    style={{
                        position: 'fixed',
                        inset: '0',
                        zIndex: 50000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: DURATION.fast }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: '0',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(4px)',
                        }}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        variants={VARIANTS.fadeUp}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: DURATION.standard }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            maxWidth: `${maxWidth}px`,
                            width: '100%',
                            maxHeight: '90vh',
                            backgroundColor: 'var(--bg)',
                            border: '1px solid var(--bd)',
                            borderRadius: '12px',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
