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
                <p className="text-sm text-t1 leading-relaxed m-0">
                    {message}
                </p>
            </ModalBody>

            <ModalFooter>
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 bg-s1 border border-bd rounded text-sm font-medium text-t0 cursor-pointer transition-all duration-200 hover:bg-s2 hover:border-s4"
                >
                    {cancelLabel}
                </button>

                <button
                    onClick={onConfirm}
                    className={`flex-1 px-4 py-2 rounded text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90 ${isDangerous ? 'bg-rd border border-rd' : 'bg-cy border border-cy'}`}
                >
                    {confirmLabel}
                </button>
            </ModalFooter>
        </Modal>
    )
}
