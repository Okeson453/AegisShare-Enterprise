import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearch } from '@/hooks/useSearch'

describe('useSearch Hook', () => {
    const mockData = [
        { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
        { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
        { id: '3', name: 'Charlie Davis', email: 'charlie@example.com' },
    ]

    it('should initialize with empty query and results', () => {
        const { result } = renderHook(() => useSearch(mockData, ['name', 'email']))

        expect(result.current.query).toBe('')
        expect(result.current.results).toEqual([])
        expect(result.current.hasResults).toBe(false)
    })

    it('should filter results based on query', async () => {
        const { result } = renderHook(() => useSearch(mockData, ['name', 'email']))

        await act(async () => {
            result.current.setQuery('alice')
            // Wait for debounce
            await new Promise((resolve) => setTimeout(resolve, 350))
        })

        expect(result.current.results).toHaveLength(1)
        expect(result.current.results[0].item.name).toBe('Alice Johnson')
    })

    it('should support fuzzy matching', async () => {
        const { result } = renderHook(() => useSearch(mockData, ['name']))

        await act(async () => {
            result.current.setQuery('aj')
            await new Promise((resolve) => setTimeout(resolve, 350))
        })

        expect(result.current.results.length).toBeGreaterThan(0)
        expect(result.current.results.some((r) => r.item.name.includes('Alice'))).toBe(true)
    })

    it('should clear query and results', async () => {
        const { result } = renderHook(() => useSearch(mockData, ['name']))

        await act(async () => {
            result.current.setQuery('alice')
            await new Promise((resolve) => setTimeout(resolve, 350))
        })

        expect(result.current.results.length).toBeGreaterThan(0)

        await act(async () => {
            result.current.clear()
        })

        expect(result.current.query).toBe('')
        expect(result.current.results).toEqual([])
    })

    it('should respect maxResults option', async () => {
        const { result } = renderHook(() =>
            useSearch(mockData, ['name', 'email'], { maxResults: 1 })
        )

        await act(async () => {
            result.current.setQuery('a')
            await new Promise((resolve) => setTimeout(resolve, 350))
        })

        expect(result.current.results.length).toBeLessThanOrEqual(1)
    })

    it('should require minimum characters before searching', async () => {
        const { result } = renderHook(() =>
            useSearch(mockData, ['name'], { minChars: 3 })
        )

        await act(async () => {
            result.current.setQuery('al')
            await new Promise((resolve) => setTimeout(resolve, 350))
        })

        expect(result.current.results).toEqual([])

        await act(async () => {
            result.current.setQuery('alice')
            await new Promise((resolve) => setTimeout(resolve, 350))
        })

        expect(result.current.results.length).toBeGreaterThan(0)
    })
})
