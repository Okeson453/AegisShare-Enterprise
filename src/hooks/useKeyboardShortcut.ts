import { useEffect, useRef } from 'react'

type KeyCombo = string // e.g., 'cmd+k', 'ctrl+shift+s', 'Alt+A'
type Handler = (e: KeyboardEvent) => void

interface UseKeyboardShortcutOptions {
    enabled?: boolean
    preventDefault?: boolean
    stopPropagation?: boolean
}

/**
 * useKeyboardShortcut — Register global keyboard shortcuts
 *
 * Usage:
 *   useKeyboardShortcut('cmd+k', () => openCommandPalette())
 *   useKeyboardShortcut('ctrl+s', handleSave, { preventDefault: true })
 *
 * Features:
 * - Cross-platform (Cmd on Mac, Ctrl on Windows/Linux)
 * - Can enable/disable without reregistering
 * - Optional event handling (preventDefault, stopPropagation)
 * - Cleanup on unmount
 *
 * Supported modifiers: ctrl, cmd, shift, alt
 * Case-insensitive for letters
 */
export function useKeyboardShortcut(
    combo: KeyCombo,
    handler: Handler,
    options: UseKeyboardShortcutOptions = {}
) {
    const { enabled = true, preventDefault = false, stopPropagation = false } = options
    const handlerRef = useRef(handler)

    // Keep handler in sync without reregistering listener
    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    useEffect(() => {
        if (!enabled) return

        const listener = (e: KeyboardEvent) => {
            if (matchesCombo(e, combo)) {
                if (preventDefault) e.preventDefault()
                if (stopPropagation) e.stopPropagation()
                handlerRef.current(e)
            }
        }

        window.addEventListener('keydown', listener)
        return () => window.removeEventListener('keydown', listener)
    }, [combo, enabled, preventDefault, stopPropagation])
}

/**
 * Match keyboard event against combo string
 * @example
 *   matchesCombo(e, 'cmd+k')  // true if Cmd+K pressed on Mac
 *   matchesCombo(e, 'ctrl+k') // true if Ctrl+K pressed on Windows
 */
function matchesCombo(e: KeyboardEvent, combo: string): boolean {
    const parts = combo.toLowerCase().split('+')
    const key = parts[parts.length - 1]

    // Check modifiers
    const hasCtrl = parts.includes('ctrl') && e.ctrlKey
    const hasCmd = parts.includes('cmd') && e.metaKey
    const hasShift = parts.includes('shift') && e.shiftKey
    const hasAlt = parts.includes('alt') && e.altKey

    // Check main key (case-insensitive)
    const keyMatch = e.key.toLowerCase() === key

    // For "cmd+k", accept both on Mac and Ctrl on other platforms
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    const ctrlMatch = isMac ? hasCmd : hasCtrl

    // Verify all specified modifiers are pressed
    const ctrlRequired = parts.includes('ctrl') || parts.includes('cmd')
    const shiftRequired = parts.includes('shift')
    const altRequired = parts.includes('alt')

    return (
        keyMatch &&
        (ctrlRequired ? ctrlMatch : !e.ctrlKey && !e.metaKey) &&
        (shiftRequired ? hasShift : !e.shiftKey) &&
        (altRequired ? hasAlt : !e.altKey)
    )
}

/**
 * Get keyboard shortcut display string for user's platform
 * @example
 *   getShortcutDisplay('cmd+k') // "Cmd+K" on Mac, "Ctrl+K" on Windows
 */
export function getShortcutDisplay(combo: KeyCombo): string {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    return combo
        .split('+')
        .map((part) => {
            if (part === 'cmd') return isMac ? '⌘' : 'Ctrl'
            if (part === 'ctrl') return isMac ? '⌘' : 'Ctrl'
            if (part === 'shift') return isMac ? '⇧' : 'Shift'
            if (part === 'alt') return isMac ? '⌥' : 'Alt'
            return part.charAt(0).toUpperCase() + part.slice(1)
        })
        .join(isMac ? '' : '+')
}

/**
 * Common keyboard shortcuts
 */
export const SHORTCUTS = {
    COMMAND_PALETTE: 'cmd+k',
    SAVE: 'cmd+s',
    UNDO: 'cmd+z',
    REDO: 'cmd+shift+z',
    FIND: 'cmd+f',
    ESCAPE: 'Escape',
    ENTER: 'Enter',
} as const
