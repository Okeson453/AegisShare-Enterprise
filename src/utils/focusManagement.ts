import React from 'react';

/**
 * Focus Management and Screen Reader Announcements
 * Ensures screen reader users are informed of route changes, dynamic content, and state updates
 */

/**
 * Announce a message to screen readers
 * Creates a live region with aria-live="polite" and announces the message
 * @param message - The message to announce
 * @param priority - 'polite' (wait for pause) or 'assertive' (interrupt)
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    // Get or create the announcer element
    let announcer = document.getElementById('route-announcer');

    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'route-announcer';
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        document.body.appendChild(announcer);
    }

    // Update aria-live attribute based on priority
    announcer.setAttribute('aria-live', priority);

    // Clear and set message (clearing ensures repeated messages are announced)
    announcer.textContent = '';
    setTimeout(() => {
        announcer!.textContent = message;
    }, 100);
}

/**
 * React hook to announce route changes
 * Usage: useRouteAnnouncer(pathname)
 */
export function useRouteAnnouncer(pathname: string, pageTitle?: string): void {
    React.useEffect(() => {
        const title = pageTitle || document.title;
        announceToScreenReader(`${title} page loaded`, 'assertive');

        // Also update document title for screen readers
        document.title = title;
    }, [pathname, pageTitle]);
}

/**
 * React hook to announce dynamic content updates
 * Usage: useDynamicContentAnnouncer({ isLoading, itemCount })
 */
export function useDynamicContentAnnouncer(opts?: {
    isLoading?: boolean;
    itemCount?: number;
    message?: string;
}): void {
    const { isLoading = false, itemCount = 0, message } = opts || {};

    React.useEffect(() => {
        if (message) {
            announceToScreenReader(message, 'polite');
        } else if (isLoading) {
            announceToScreenReader('Loading content', 'polite');
        } else if (itemCount > 0) {
            announceToScreenReader(`${itemCount} items loaded`, 'polite');
        }
    }, [isLoading, itemCount, message]);
}

/**
 * Set focus to an element and announce it
 * Useful for error messages, alerts, and important updates
 * @param elementId - The element ID to focus
 * @param announcement - Optional message to announce
 */
export function setFocusAndAnnounce(elementId: string, announcement?: string): void {
    const element = document.getElementById(elementId);

    if (element) {
        // Make element focusable if it isn't already
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '-1');
        }

        // Focus the element
        element.focus();

        // Announce if provided
        if (announcement) {
            announceToScreenReader(announcement, 'assertive');
        }
    }
}

/**
 * React hook to manage focus restoration
 * Restores focus to a specific element after modal closes
 * Usage: useRestoreFocus(isClosed)
 */
export function useRestoreFocus(shouldRestore: boolean): React.RefObject<HTMLElement> {
    const triggerRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        if (shouldRestore && triggerRef.current) {
            triggerRef.current.focus();
        }
    }, [shouldRestore]);

    return triggerRef;
}

/**
 * Skip to main content link handler
 * Usage: onSkipToMain() and set id="main-content" on main element
 */
export function skipToMain(): void {
    const mainElement = document.getElementById('main-content');

    if (mainElement) {
        // Make main focusable if it isn't
        if (!mainElement.hasAttribute('tabindex')) {
            mainElement.setAttribute('tabindex', '-1');
        }

        mainElement.focus();
        announceToScreenReader('Skipped to main content', 'assertive');
    }
}

/**
 * React hook for managing skip link
 * Provides function to handle skip-to-main-content
 */
export function useSkipLink(mainElementId: string = 'main-content'): () => void {
    return () => {
        const mainElement = document.getElementById(mainElementId);

        if (mainElement) {
            if (!mainElement.hasAttribute('tabindex')) {
                mainElement.setAttribute('tabindex', '-1');
            }

            mainElement.focus();
            announceToScreenReader('Skipped to main content', 'assertive');
        }
    };
}

/**
 * Announce form field validation errors
 * Usage: announceFieldError('email-error', 'Email is invalid')
 */
export function announceFieldError(fieldId: string, errorMessage: string): void {
    const errorElement = document.getElementById(fieldId);

    if (errorElement) {
        announceToScreenReader(`${fieldId}: ${errorMessage}`, 'assertive');
        errorElement.setAttribute('aria-invalid', 'true');
    }
}

/**
 * Clear form field validation error announcement
 */
export function clearFieldError(fieldId: string): void {
    const errorElement = document.getElementById(fieldId);

    if (errorElement) {
        announceToScreenReader(`${fieldId}: valid`, 'polite');
        errorElement.setAttribute('aria-invalid', 'false');
    }
}

/**
 * Announce route/page change
 * @param pageTitle - Title of the page being navigated to
 */
export function announceRouteChange(pageTitle?: string): void {
    const title = pageTitle || document.title;
    announceToScreenReader(`${title} page loaded`, 'assertive');
}
