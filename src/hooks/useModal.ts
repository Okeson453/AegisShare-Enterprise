import { useCallback } from 'react'
import { useModalStore } from '@/store/modalStore'

export const useModal = (id: string) => {
  const { open, close, isOpen } = useModalStore()

  return {
    open: useCallback(() => open(id), [id, open]),
    close: useCallback(() => close(id), [id, close]),
    isOpen: isOpen(id),
  }
}
