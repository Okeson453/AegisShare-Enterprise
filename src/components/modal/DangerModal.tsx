import { useState } from 'react'
import { Modal } from './Modal'
import { ModalHeader } from './ModalHeader'
import { ModalBody } from './ModalBody'
import { ModalFooter } from './ModalFooter'

interface DangerModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmPhrase: string
    confirmLabel?: string
    cancelLabel?: string
    subtitle?: string
}

export const DangerModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmPhrase,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    subtitle,
}: DangerModalProps) => {
    const [userInput, setUserInput] = useState('')

    const isConfirmDisabled = userInput !== confirmPhrase

    const handleConfirm = () => {
        if (!isConfirmDisabled) {
            onConfirm()
            setUserInput('')
        }
    }

    const handleCancel = () => {
        setUserInput('')
        onCancel()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleCancel}>
            <ModalHeader onClose={handleCancel} subtitle={subtitle}>
                {title}
            </ModalHeader>

            <ModalBody>
                <p
                    style={{
                        fontSize: '14px',
                        color: 'var(--t1)',
                        lineHeight: '1.6',
                        margin: '0 0 16px 0',
                    }}
                >
                    {message}
                </p>

                <div style={{ marginBottom: '16px' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--t2)',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Type <code style={{ color: 'var(--rd)', fontWeight: 700 }}>{confirmPhrase}</code> to
                        confirm
                    </label>

                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={confirmPhrase}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '14px',
                            backgroundColor: 'var(--s1)',
                            border: `1px solid ${userInput === confirmPhrase ? 'var(--rd)' : 'var(--bd)'}`,
                            borderRadius: '6px',
                            color: 'var(--t0)',
                            fontFamily: 'var(--font-mono)',
                            transition: 'all 0.2s ease',
                            boxSizing: 'border-box',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isConfirmDisabled) {
                                handleConfirm()
                            }
                        }}
                    />
                </div>

                <div
                    style={{
                        padding: '12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '6px',
                    }}
                >
                    <p
                        style={{
                            fontSize: '12px',
                            color: 'var(--rd)',
                            margin: 0,
                            fontWeight: 500,
                            lineHeight: '1.4',
                        }}
                    >
                        ⚠️ This action cannot be undone.
                    </p>
                </div>
            </ModalBody>

            <ModalFooter>
                <button
                    onClick={handleCancel}
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
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        backgroundColor: isConfirmDisabled ? 'var(--s2)' : 'var(--rd)',
                        border: `1px solid ${isConfirmDisabled ? 'var(--bd)' : 'var(--rd)'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isConfirmDisabled ? 'var(--t2)' : '#fff',
                        cursor: isConfirmDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        if (!el.disabled) {
                            el.style.opacity = '0.9'
                        }
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        if (!el.disabled) {
                            el.style.opacity = '1'
                        }
                    }}
                >
                    {confirmLabel}
                </button>
            </ModalFooter>
        </Modal>
    )
}
