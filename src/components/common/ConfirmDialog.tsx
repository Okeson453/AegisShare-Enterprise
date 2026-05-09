import React from 'react'import '../../styles/access-control-extension.css';import Button from '../ui/Button'

interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    onCancel: () => void
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning'
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
}) => {
    if (!isOpen) return null

    // Map warning to secondary for Button component
    const buttonVariant = variant === 'warning' ? 'secondary' : 'danger'

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="flex items-center justify-center inset-0 absolute">
                <div
                    className="max-w-sm bg-s0 border border-bd rounded-lg shadow-2xl animate-slideIn p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-semibold text-t0 mb-2">{title}</h2>
                    <p className="text-sm text-t1 mb-6">{description}</p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={onCancel}>
                            {cancelLabel}
                        </Button>
                        <Button variant={buttonVariant} onClick={onConfirm}>
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
