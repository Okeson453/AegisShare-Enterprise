import { AnimatePresence } from 'framer-motion'
import { useToastStore } from '@/store/toastStore'
import { Toast } from './Toast'

const MAX_VISIBLE_TOASTS = 5

export const ToastContainer = () => {
    const { toasts } = useToastStore()

    // Show newest toasts first, limit to MAX_VISIBLE_TOASTS
    const visibleToasts = toasts.slice(-MAX_VISIBLE_TOASTS)

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 10000,
                pointerEvents: 'none',
            }}
        >
            <AnimatePresence mode="popLayout">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        pointerEvents: 'auto',
                    }}
                >
                    {visibleToasts.map((toast) => (
                        <Toast key={toast.id} toast={toast} />
                    ))}
                </div>
            </AnimatePresence>
        </div>
    )
}
