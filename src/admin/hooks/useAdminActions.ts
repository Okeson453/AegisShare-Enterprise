import { useToast } from '@/hooks/useToast'
import { useModal } from '@/hooks/useModal'
import { ConfirmModal } from '@/components/modal/ConfirmModal'
import { DangerModal } from '@/components/modal/DangerModal'

/**
 * Admin Action Handler Utilities
 * Pre-configured integrationsfor toast notifications and confirmations
 */

export const useAdminActions = () => {
    const toast = useToast()

    return {
        /**
         * Wrap async action with loading state and toast
         */
        executeAction: async <T,>(
            action: () => Promise<T>,
            options: {
                loadingMessage?: string
                successMessage?: string
                errorMessage?: string
                onSuccess?: (result: T) => void
                onError?: (error: Error) => void
            } = {}
        ): Promise<T | null> => {
            const {
                loadingMessage = 'Processing...',
                successMessage = 'Action completed successfully',
                errorMessage = 'Action failed',
                onSuccess,
                onError,
            } = options

            try {
                const result = await action()
                toast.success(successMessage)
                onSuccess?.(result)
                return result
            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error))
                toast.error(errorMessage, { details: err.message })
                onError?.(err)
                return null
            }
        },

        /**
         * Open confirmation dialog for destructive actions
         */
        confirmAction: (options: {
            title: string
            message: string
            onConfirm: () => void | Promise<void>
            confirmLabel?: string
            isDangerous?: boolean
        }) => {
            const { title, message, onConfirm, confirmLabel, isDangerous = false } = options
            return {
                openConfirm: () => {
                    // To be used with ConfirmModal component
                    return {
                        title,
                        message,
                        onConfirm,
                        confirmLabel: confirmLabel || (isDangerous ? 'Delete' : 'Confirm'),
                        isDangerous,
                    }
                },
            }
        },

        /**
         * Open danger zone confirmation with phrase requirement
         */
        confirmDangerAction: (options: {
            title: string
            message: string
            confirmPhrase: string
            onConfirm: () => void | Promise<void>
        }) => {
            return options
        },

        toast,
    }
}

/**
 * useAdminModal - Pre-configured modal for admin actions
 */
export const useAdminModal = (modalId: string) => {
    return useModal(modalId)
}

/**
 * Action confirmation with built-in modal state
 */
export const useActionConfirmation = (modalId: string) => {
    const { isOpen, open, close } = useModal(modalId)
    const toast = useToast()

    return {
        isOpen,
        open,
        close,
        executeConfirmed: async (action: () => Promise<void>) => {
            try {
                await action()
                toast.success('Action completed')
                close()
            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error))
                toast.error('Action failed', { details: err.message })
            }
        },
    }
}
