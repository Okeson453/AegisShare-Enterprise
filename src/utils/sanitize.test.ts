import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '@/utils/sanitize'

describe('Sanitization', () => {
    it('should remove script tags', () => {
        const dirty = '<p>Hello</p><script>alert("xss")</script>'
        const clean = sanitizeHtml(dirty)
        expect(clean).not.toContain('<script>')
    })

    it('should remove dangerous attributes', () => {
        const dirty = '<img src="x" onerror="alert(1)" />'
        const clean = sanitizeHtml(dirty)
        expect(clean).not.toContain('onerror')
    })

    it('should allow safe tags', () => {
        const safe = '<strong>Bold text</strong>'
        const clean = sanitizeHtml(safe)
        expect(clean).toContain('<strong>')
    })

    it('should remove style tags', () => {
        const dirty = '<style>body { display: none }</style><p>Content</p>'
        const clean = sanitizeHtml(dirty)
        expect(clean).not.toContain('<style>')
    })

    it('should handle empty input', () => {
        expect(sanitizeHtml('')).toBe('')
        expect(sanitizeHtml(null as any)).toBe('')
    })

    it('should prevent DOM-based XSS', () => {
        const dirty = '<div><img src=x name=img src=bogus onerror=alert(1)></div>'
        const clean = sanitizeHtml(dirty)
        expect(clean).not.toContain('onerror')
    })
})
