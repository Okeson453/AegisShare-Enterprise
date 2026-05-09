import React from 'react';

/**
 * Focus Trap — Keyboard accessibility for modals, dialogs, and dropdowns
 * Ensures focus never leaves the modal while it's open.
 * Implements WCAG 2.1 Level AA dialog pattern (APG Modal Dialog Example).
 */

/**
 * Create and activate a focus trap
 * @param containerElement - The DOM element containing focusable elements
 * @param opts - Configuration options
 * @returns Function to deactivate the trap
 */
export function createFocusTrap(
    containerElement: HTMLElement,
    opts?: {
        initialFocus?: HTMLElement | null;
        escapeDeactivates?: boolean;
        clickOutsideDeactivates?: boolean;
        onDeactivate?: () => void;
    }
) {
    const {
        initialFocus = null,
        escapeDeactivates = true,
        clickOutsideDeactivates = true,
        onDeactivate,
    } = opts || {};

    const previousActiveElement = document.activeElement as HTMLElement;
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input[type="checkbox"]:not([disabled])',
        'input[type="radio"]:not([disabled])',
        'input[type="number"]:not([disabled])',
        'input[type="search"]:not([disabled])',
        'input[type="text"]:not([disabled])',
        'input[type="password"]:not([disabled])',
        'input[type="email"]:not([disabled])',
        'input[type="tel"]:not([disabled])',
        'input[type="url"]:not([disabled])',
        'input[type="date"]:not([disabled])',
        'input[type="time"]:not([disabled])',
        'input[type="datetime-local"]:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[contenteditable="true"]',
        '[tabindex]:not([tabindex="-1"])',
    ];

    function getFocusableElements(): HTMLElement[] {
        const focusableElements = Array.from(
            containerElement.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
        );

        return focusableElements.filter((el) => {
            return (
                getComputedStyle(el).visibility !== 'hidden' &&
                getComputedStyle(el).display !== 'none' &&
                el.offsetParent !== null
            );
        });
    }

    function handleKeyDown(event: KeyboardEvent): void {
        // ESC to deactivate
        if (escapeDeactivates && event.key === 'Escape') {
            event.preventDefault();
            deactivate();
            return;
        }

        // TAB to cycle focus
        if (event.key === 'Tab') {
            const focusableElements = getFocusableElements();

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];
            const activeElement = document.activeElement as HTMLElement;

            // Shift+Tab at start → go to end
            if (event.shiftKey) {
                if (activeElement === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                // Tab at end → go to start
                if (activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    }

    function handleClickOutside(event: MouseEvent): void {
        if (
            clickOutsideDeactivates &&
            event.target instanceof Node &&
            !containerElement.contains(event.target)
        ) {
            deactivate();
        }
    }

    function activate(): void {
        // Set initial focus
        const focusableElements = getFocusableElements();
        const elementToFocus = initialFocus || focusableElements[0];

        if (elementToFocus) {
            elementToFocus.focus();
        }

        // Add event listeners
        containerElement.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClickOutside, true);
    }

    function deactivate(): void {
        // Remove event listeners
        containerElement.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClickOutside, true);

        // Restore focus to previous element or body
        if (previousActiveElement && previousActiveElement !== document.body) {
            previousActiveElement.focus();
        }

        // Call deactivation callback
        if (onDeactivate) {
            onDeactivate();
        }
    }

    // Activate immediately
    activate();

    // Return deactivation function
    return deactivate;
}

/**
 * React hook for focus trap
 * Usage: useFocusTrap(ref, { escapeDeactivates: true })
 */
export function useFocusTrap(
    containerRef: React.RefObject<HTMLElement>,
    opts?: Parameters<typeof createFocusTrap>[1]
) {
    const deactivateRef = React.useRef<(() => void) | null>(null);

    React.useEffect(() => {
        if (containerRef.current) {
            deactivateRef.current = createFocusTrap(containerRef.current, opts);
        }

        return () => {
            if (deactivateRef.current) {
                deactivateRef.current();
            }
        };
    }, [containerRef, opts]);
}
