import { expect, it, describe } from 'vitest'
import { formatBytes, formatDate, formatHash } from '@/utils/formatters'

describe('Formatters', () => {
    it('formats bytes correctly', () => {
        expect(formatBytes(1024)).toContain('KB')
        expect(formatBytes(1024 * 1024)).toContain('MB')
    })

    it('formats hash correctly', () => {
        const hash = 'a'.repeat(64)
        const formatted = formatHash(hash)
        expect(formatted).toContain('...')
    })
})
