import { useEffect } from 'react'

/**
 * Global Keyboard Shortcuts for Admin Console
 * Modifiers: Ctrl+Shift for admin actions
 */

export const KEYBOARD_SHORTCUTS = {
    // Navigation
    ADMIN_HOME: 'ctrl+shift+h',
    ADMIN_SEARCH: 'ctrl+shift+f',
    ADMIN_USERS: 'ctrl+shift+u',
    ADMIN_AUDIT: 'ctrl+shift+a',
    ADMIN_SETTINGS: 'ctrl+shift+s',

    // Actions
    ADD_ITEM: 'ctrl+shift+n',
    EDIT_ITEM: 'ctrl+shift+e',
    DELETE_ITEM: 'ctrl+shift+d',
    SAVE_CHANGES: 'ctrl+shift+s',
    CANCEL_ACTION: 'escape',
    OPEN_SEARCH: 'ctrl+k',

    // Filtering
    FILTER_CLEAR: 'ctrl+shift+backspace',
    FILTER_OPEN: 'ctrl+l',
} as const

export interface KeyboardShortcutConfig {
    key: string
    handler: () => void
    description?: string
    disabled?: boolean
}

/**
 * Hook for registering keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcutConfig[]) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Build current key string
            const keys: string[] = []
            if (e.ctrlKey) keys.push('ctrl')
            if (e.shiftKey) keys.push('shift')
            if (e.altKey) keys.push('alt')

            // Add the actual key
            const key = e.key.toLowerCase()
            if (key !== 'control' && key !== 'shift' && key !== 'alt') {
                keys.push(key)
            }

            const currentKey = keys.join('+')

            // Check if any shortcut matches
            shortcuts.forEach((shortcut) => {
                if (!shortcut.disabled && shortcut.key === currentKey) {
                    e.preventDefault()
                    shortcut.handler()
                }
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [shortcuts])
}

/**
 * Pre-configured common admin shortcuts
 */
export const useAdminKeyboardShortcuts = () => {
    const handlers = {
        openSearch: () => {
            // Implementation depends on your search component
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
            searchInput?.focus()
        },

        goHome: () => {
            window.location.href = '/admin/overview'
        },

        addItem: () => {
            // Dispatch custom event that page components can listen to
            window.dispatchEvent(new CustomEvent('admin:add-item'))
        },

        deleteItem: () => {
            window.dispatchEvent(new CustomEvent('admin:delete-item'))
        },

        saveChanges: () => {
            window.dispatchEvent(new CustomEvent('admin:save-changes'))
        },
    }

    return {
        shortcuts: [
            {
                key: 'ctrl+k',
                handler: handlers.openSearch,
                description: 'Open search',
            },
            {
                key: 'ctrl+shift+h',
                handler: handlers.goHome,
                description: 'Go to admin home',
            },
            {
                key: 'ctrl+shift+n',
                handler: handlers.addItem,
                description: 'Add new item',
            },
            {
                key: 'ctrl+shift+d',
                handler: handlers.deleteItem,
                description: 'Delete selected item',
            },
        ],
        handlers,
    }
}
