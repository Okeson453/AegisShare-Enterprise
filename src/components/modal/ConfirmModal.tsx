import { Modal } from './Modal'
import { ModalHeader } from './ModalHeader'
import { ModalBody } from './ModalBody'
import { ModalFooter } from './ModalFooter'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmLabel?: string
    cancelLabel?: string
    isDangerous?: boolean
    subtitle?: string
}

export const ConfirmModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDangerous = false,
    subtitle,
}: ConfirmModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <ModalHeader onClose={onCancel} subtitle={subtitle}>
                {title}
            </ModalHeader>

            <ModalBody>
                <p
                    style={{
                        fontSize: '14px',
                        color: 'var(--t1)',
                        lineHeight: '1.6',
                        margin: 0,
                    }}
                >
                    {message}
                </p>
            </ModalBody>

            <ModalFooter>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        backgroundColor: 'var(--s1)',
                        border: '1px solid var(--bd)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--t0)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.backgroundColor = 'var(--s2)'
                        el.style.borderColor = 'var(--s4)'
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.backgroundColor = 'var(--s1)'
                        el.style.borderColor = 'var(--bd)'
                    }}
                >
                    {cancelLabel}
                </button>

                <button
                    onClick={onConfirm}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        backgroundColor: isDangerous ? 'var(--rd)' : 'var(--cy)',
                        border: `1px solid ${isDangerous ? 'var(--rd)' : 'var(--cy)'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.opacity = '0.9'
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.opacity = '1'
                    }}
                >
                    {confirmLabel}
                </button>
            </ModalFooter>
        </Modal>
    )
}
