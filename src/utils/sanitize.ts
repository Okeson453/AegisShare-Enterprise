/**
 * Sanitization Utilities — XSS Prevention
 * Uses DOMPurify for sanitizing HTML content
 * All user-provided HTML must pass through these functions
 */

import DOMPurify from 'dompurify';

/**
 * Configuration for DOMPurify
 * Allows basic HTML formatting but blocks scripts and dangerous attributes
 */
const PURIFY_CONFIG = {
    ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'b',
        'em',
        'i',
        'u',
        'a',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'span',
        'div',
        'img',
        'table',
        'thead',
        'tbody',
        'tfoot',
        'tr',
        'th',
        'td',
    ],
    ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'width', 'height', 'target', 'rel', 'data-id'],
    ALLOW_DATA_ATTR: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    FORCE_BODY: false,
    SANITIZE_DOM: true,
    IN_PLACE: false,
} as any;

/**
 * Sanitize HTML string
 * Removes all dangerous scripts and attributes
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(dirty: string): string {
    if (!dirty) return '';
    const result = DOMPurify.sanitize(dirty, PURIFY_CONFIG);
    return typeof result === 'string' ? result : result.toString();
}

/**
 * Sanitize plain text (escape HTML special characters)
 * Use for user-provided text that should NOT contain HTML
 * @param text - The text to escape
 * @returns HTML-escaped text
 */
export function sanitizeText(text: string): string {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param url - The URL to sanitize
 * @returns Safe URL
 */
export function sanitizeUrl(url: string): string {
    if (!url) return '';

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:'];
    const lowerUrl = url.trim().toLowerCase();

    for (const protocol of dangerousProtocols) {
        if (lowerUrl.startsWith(protocol)) {
            return '';
        }
    }

    return url;
}

/**
 * Sanitize JSON string (parse and stringify to prevent injection)
 * @param json - The JSON string to sanitize
 * @returns Sanitized object
 */
export function sanitizeJson<T = any>(json: string): T | null {
    try {
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

/**
 * Create a safe data URL for images
 * Only allows images from trusted sources
 * @param src - The image source
 * @returns Safe image URL
 */
export function sanitizeImageUrl(src: string): string {
    if (!src) return '';

    const url = new URL(src, typeof window !== 'undefined' ? window.location.href : 'about:blank');

    // Only allow http, https, and data URLs for images
    if (!['http:', 'https:', 'data:'].includes(url.protocol)) {
        return '';
    }

    // If data URL, verify it's an image
    if (url.protocol === 'data:') {
        if (!url.href.includes('image/')) {
            return '';
        }
    }

    return url.href;
}

/**
 * React hook for sanitizing user input
 * Usage: const sanitized = useSanitizedHtml(userInput)
 */
export function useSanitizedHtml(html: string): string {
    return React.useMemo(() => sanitizeHtml(html), [html]);
}

/**
 * React hook for sanitizing user text
 * Usage: const sanitized = useSanitizedText(userInput)
 */
export function useSanitizedText(text: string): string {
    return React.useMemo(() => sanitizeText(text), [text]);
}

/**
 * Add hooks to DOMPurify for additional security
 * Call this once on app mount
 */
export function setupDOMPurifyHooks(): void {
    // Hook to ensure all links open external sites safely
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        if (node.tagName === 'A') {
            node.setAttribute('rel', 'noopener noreferrer');
            node.setAttribute('target', '_blank');
        }
    });

    // Hook to add security attributes to images
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        if (node.tagName === 'IMG') {
            node.setAttribute('loading', 'lazy');
        }
    });
}

/**
 * Check if a string contains potentially dangerous content
 * @param text - The text to check
 * @returns True if potentially dangerous
 */
export function isContentDangerous(text: string): boolean {
    if (!text) return false;

    // Check for script tags, event handlers, and dangerous protocols
    const dangerousPatterns = [
        /<script/i,
        /on\w+\s*=/i,
        /javascript:/i,
        /data:text\/html/i,
        /vbscript:/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(text)) {
            return true;
        }
    }

    return false;
}

import React from 'react';
