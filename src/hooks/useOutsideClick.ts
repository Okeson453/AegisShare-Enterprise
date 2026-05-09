import { useEffect, useRef } from 'react'

type Handler = (e: MouseEvent) => void

interface UseOutsideClickOptions {
    enabled?: boolean
    stopPropagation?: boolean
}

/**
 * useOutsideClick — Detect clicks outside element
 *
 * Usage:
 *   const ref = useRef(null)
 *   useOutsideClick(ref, () => setOpen(false))
 *
 * Features:
 * - Works with multiple refs
 * - Safe for nested components
 * - Can be toggled on/off
 * - Handles cleanup automatically
 * - Works with touch events too
 *
 * Common use cases:
 * - Close drawers/modals when clicking outside
 * - Close dropdowns when clicking elsewhere
 * - Dismiss tooltips on click away
 */
export function useOutsideClick(
    ref: React.RefObject<HTMLElement | null>,
    handler: Handler,
    options: UseOutsideClickOptions = {}
) {
    const { enabled = true, stopPropagation = false } = options
    const handlerRef = useRef(handler)

    // Keep handler in sync without reregistering listener
    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    useEffect(() => {
        if (!enabled || !ref.current) return

        const listener = (e: MouseEvent | TouchEvent) => {
            // Ignore if click is inside ref
            if (ref.current?.contains(e.target as Node)) {
                return
            }

            if (stopPropagation) {
                e.stopPropagation()
            }

            handlerRef.current(e as MouseEvent)
        }

        // Use capture phase to catch clicks before bubbling
        document.addEventListener('mousedown', listener, true)
        document.addEventListener('touchstart', listener, true)

        return () => {
            document.removeEventListener('mousedown', listener, true)
            document.removeEventListener('touchstart', listener, true)
        }
    }, [ref, enabled, stopPropagation])
}

/**
 * useOutsideClickMultiple — Detect clicks outside multiple elements
 *
 * Usage:
 *   useOutsideClickMultiple([ref1, ref2], () => handleClose())
 *
 * Useful for:
 * - Closing a dropdown that's positioned outside its trigger
 * - Managing multiple related elements (popover + trigger)
 * - Accessibility/focus management
 */
export function useOutsideClickMultiple(
    refs: React.RefObject<HTMLElement | null>[],
    handler: Handler,
    options: UseOutsideClickOptions = {}
) {
    const { enabled = true, stopPropagation = false } = options
    const handlerRef = useRef(handler)

    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    useEffect(() => {
        if (!enabled || !refs.length) return

        const listener = (e: MouseEvent | TouchEvent) => {
            // Check if click is inside ANY of the refs
            const isInsideAny = refs.some((ref) => ref.current?.contains(e.target as Node))
            if (isInsideAny) return

            if (stopPropagation) {
                e.stopPropagation()
            }

            handlerRef.current(e as MouseEvent)
        }

        document.addEventListener('mousedown', listener, true)
        document.addEventListener('touchstart', listener, true)

        return () => {
            document.removeEventListener('mousedown', listener, true)
            document.removeEventListener('touchstart', listener, true)
        }
    }, [refs, enabled, stopPropagation])
}

/**
 * Utility to check if element is inside another element
 * Useful without useOutsideClick hook
 */
export function isClickOutside(
    element: HTMLElement | null,
    clickTarget: EventTarget | null
): boolean {
    if (!element) return true
    return !element.contains(clickTarget as Node)
}
