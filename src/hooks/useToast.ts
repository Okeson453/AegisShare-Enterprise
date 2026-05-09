import { useToastStore } from '@/store/toastStore'

export interface ToastOptions {
  duration?: number
  code?: string
  details?: string
}

export const useToast = () => {
  const { add } = useToastStore()

  return {
    success: (message: string, options?: ToastOptions) =>
      add({
        message,
        variant: 'success',
        duration: options?.duration ?? 4000,
        metadata: {
          timestamp: new Date().toISOString(),
          code: options?.code,
          details: options?.details,
        },
      }),

    error: (message: string, options?: ToastOptions) =>
      add({
        message,
        variant: 'error',
        duration: options?.duration ?? 6000,
        metadata: {
          timestamp: new Date().toISOString(),
          code: options?.code,
          details: options?.details,
        },
      }),

    warning: (message: string, options?: ToastOptions) =>
      add({
        message,
        variant: 'warning',
        duration: options?.duration ?? 5000,
        metadata: {
          timestamp: new Date().toISOString(),
          code: options?.code,
          details: options?.details,
        },
      }),

    info: (message: string, options?: ToastOptions) =>
      add({
        message,
        variant: 'info',
        duration: options?.duration ?? 4000,
        metadata: {
          timestamp: new Date().toISOString(),
          code: options?.code,
          details: options?.details,
        },
      }),

    critical: (message: string, options?: ToastOptions) =>
      add({
        message,
        variant: 'critical',
        duration: options?.duration ?? 0, // No auto-dismiss for critical
        metadata: {
          timestamp: new Date().toISOString(),
          code: options?.code,
          details: options?.details,
        },
      }),
  }
}
