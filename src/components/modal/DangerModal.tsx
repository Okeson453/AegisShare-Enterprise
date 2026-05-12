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
                <p className="text-sm text-t1 leading-relaxed mb-4 m-0">
                    {message}
                </p>

                <div className="mb-4">
                    <label className="block text-xs font-semibold text-t2 mb-2 uppercase tracking-wider">
                        Type <code className="text-rd font-bold">{confirmPhrase}</code> to confirm
                    </label>

                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={confirmPhrase}
                        className={`w-full px-3 py-2 text-sm bg-s1 rounded font-mono text-t0 transition-all duration-200 ${userInput === confirmPhrase ? 'border-rd' : 'border-bd'} border`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isConfirmDisabled) {
                                handleConfirm()
                            }
                        }}
                    />
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-rd m-0 font-medium leading-relaxed">
                        ⚠️ This action cannot be undone.
                    </p>
                </div>
            </ModalBody>

            <ModalFooter>
                <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-s1 border border-bd rounded text-sm font-medium text-t0 cursor-pointer transition-all duration-200 hover:bg-s2 hover:border-s4"
                >
                    {cancelLabel}
                </button>

                <button
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled}
                    className="flex-1 px-4 py-2 bg-rd border border-rd rounded text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {confirmLabel}
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
