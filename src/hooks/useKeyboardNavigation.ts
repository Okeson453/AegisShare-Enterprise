import { useEffect, useCallback } from 'react'

export type KeyboardShortcut = {
    key: string
    code: string
    ctrlKey?: boolean
    shiftKey?: boolean
    altKey?: boolean
}

export type KeyboardHandler = (event: KeyboardEvent) => void

/**
 * Hook for registering keyboard shortcuts
 * Usage: useKeyboardShortcut({ key: 's', ctrlKey: true }, () => handleSave())
 */
export const useKeyboardShortcut = (
    shortcut: KeyboardShortcut,
    handler: KeyboardHandler,
    enabled = true
) => {
    useEffect(() => {
        if (!enabled) return

        const handleKeyDown = (event: KeyboardEvent) => {
            const matches =
                event.key === shortcut.key &&
                (shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey) &&
                (shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey) &&
                (shortcut.altKey === undefined || event.altKey === shortcut.altKey)

            if (matches) {
                event.preventDefault()
                handler(event)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [shortcut, handler, enabled])
}

/**
 * Hook for multiple keyboard shortcuts
 */
export const useKeyboardShortcuts = (
    shortcuts: Array<{ shortcut: KeyboardShortcut; handler: KeyboardHandler }>,
    enabled = true
) => {
    useEffect(() => {
        if (!enabled) return

        const handleKeyDown = (event: KeyboardEvent) => {
            for (const { shortcut, handler } of shortcuts) {
                const matches =
                    event.key === shortcut.key &&
                    (shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey) &&
                    (shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey) &&
                    (shortcut.altKey === undefined || event.altKey === shortcut.altKey)

                if (matches) {
                    event.preventDefault()
                    handler(event)
                    break
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [shortcuts, enabled])
}

/**
 * Hook for arrow key navigation (up/down, left/right)
 */
interface ArrowKeyOptions {
    vertical?: boolean
    horizontal?: boolean
    wrap?: boolean
}

export const useArrowKeyNavigation = (
    onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void,
    options: ArrowKeyOptions = { vertical: true, horizontal: false, wrap: false },
    enabled = true
) => {
    useEffect(() => {
        if (!enabled) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (options.vertical && event.key === 'ArrowUp') {
                event.preventDefault()
                onNavigate('up')
            } else if (options.vertical && event.key === 'ArrowDown') {
                event.preventDefault()
                onNavigate('down')
            } else if (options.horizontal && event.key === 'ArrowLeft') {
                event.preventDefault()
                onNavigate('left')
            } else if (options.horizontal && event.key === 'ArrowRight') {
                event.preventDefault()
                onNavigate('right')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onNavigate, options, enabled])
}

/**
 * Hook for Enter/Escape key handling
 */
export const useEnterEscapeKeys = (
    onEnter?: () => void,
    onEscape?: () => void,
    enabled = true
) => {
    useEffect(() => {
        if (!enabled) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && onEnter) {
                event.preventDefault()
                onEnter()
            } else if (event.key === 'Escape' && onEscape) {
                event.preventDefault()
                onEscape()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onEnter, onEscape, enabled])
}

/**
 * Hook for search/filter with Ctrl/Cmd + F or Cmd + K
 */
export const useSearchKeyNavigation = (onSearch: (query: string) => void, enabled = true) => {
    const handleSearch = useCallback(
        (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && (event.key === 'f' || event.key === 'k')) {
                event.preventDefault()
                const query = prompt('Search:')
                if (query) {
                    onSearch(query)
                }
            }
        },
        [onSearch]
    )

    useEffect(() => {
        if (!enabled) return

        window.addEventListener('keydown', handleSearch)
        return () => window.removeEventListener('keydown', handleSearch)
    }, [handleSearch, enabled])
}

/**
 * Global keyboard shortcuts for dashboard
 */
export const DASHBOARD_SHORTCUTS = {
    SAVE: { key: 's', ctrlKey: true },
    SEARCH: { key: 'k', ctrlKey: true },
    ESCAPE: { key: 'Escape' },
    ENTER: { key: 'Enter' },
    PREV: { key: 'ArrowLeft' },
    NEXT: { key: 'ArrowRight' },
    UP: { key: 'ArrowUp' },
    DOWN: { key: 'ArrowDown' },
    DELETE: { key: 'Delete' },
    REFRESH: { key: 'r', ctrlKey: true },
    HELP: { key: '?' },
} as const
