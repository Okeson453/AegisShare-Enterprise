import React from 'react';

/**
 * Scroll Lock — Prevent body scroll when modals/popovers are open
 * Better than overflow:hidden (preserves scrollbar width, works on nested scopes)
 */

const scrollLocks = new Set<string>();

/**
 * Lock body scroll
 * @param lockId - Unique identifier for this lock (e.g., 'modal-1')
 * @returns Function to unlock scroll
 */
export function lockScroll(lockId: string = 'default'): () => void {
    // Store current scroll position
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // Add lock to set
    scrollLocks.add(lockId);

    // Only apply styles if this is the first lock
    if (scrollLocks.size === 1) {
        // Calculate scrollbar width
        const scrollbarWidth =
            typeof window !== 'undefined' ? window.innerWidth - document.documentElement.clientWidth : 0;

        // Save original padding
        const originalPaddingRight = document.body.style.paddingRight;

        // Apply scroll lock
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        // Store state for cleanup
        (window as any).__scrollLockState = {
            scrollPosition,
            paddingRight: originalPaddingRight,
        };
    }

    // Return unlock function
    return () => {
        scrollLocks.delete(lockId);

        // Only remove styles if all locks are cleared
        if (scrollLocks.size === 0) {
            const state = (window as any).__scrollLockState;

            document.body.style.overflow = '';
            document.body.style.paddingRight = state?.paddingRight || '';

            delete (window as any).__scrollLockState;
        }
    };
}

/**
 * React hook for scroll lock
 * Usage: useScrollLock({ isOpen: true })
 */
export function useScrollLock(opts?: { isOpen?: boolean; lockId?: string }): void {
    const { isOpen = true, lockId = 'default' } = opts || {};
    const lockIdRef = React.useRef<string>(lockId);

    React.useEffect(() => {
        if (isOpen) {
            return lockScroll(lockIdRef.current);
        } else {
            unlockScroll(lockIdRef.current);
        }
    }, [isOpen]);
}

/**
 * Unlock scroll for default lock
 * @param lockId - Which lock to remove (default: 'default')
 */
export function unlockScroll(lockId: string = 'default'): void {
    scrollLocks.delete(lockId);

    // Only remove styles if all locks are cleared
    if (scrollLocks.size === 0) {
        const state = (window as any).__scrollLockState;

        document.body.style.overflow = '';
        document.body.style.paddingRight = state?.paddingRight || '';

        delete (window as any).__scrollLockState;
    }
}

/**
 * Unlock all scroll locks
 * Use sparingly — only for error recovery
 */
export function unlockAllScroll(): void {
    scrollLocks.clear();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    delete (window as any).__scrollLockState;
}
