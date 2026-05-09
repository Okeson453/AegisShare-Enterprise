import { useState, useCallback, useMemo } from 'react'
import { debounce } from '@/utils/debounce'

interface UseSearchOptions {
  delayMs?: number
  minChars?: number
  maxResults?: number
}

interface SearchResult<T> {
  item: T
  score: number
  highlights?: {
    field: string
    positions: Array<{ start: number; end: number }>
  }[]
}

export const useSearch = <T extends Record<string, any>>(
  items: T[],
  searchFields: (keyof T)[],
  options: UseSearchOptions = {}
) => {
  const { delayMs = 300, minChars = 2, maxResults = 50 } = options

  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult<T>[]>([])

  // Simple scoring algorithm: matches and position-based relevance
  const scoreMatch = useCallback((text: string, query: string): number => {
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()

    if (lowerText === lowerQuery) return 100
    if (lowerText.startsWith(lowerQuery)) return 80
    if (lowerText.includes(lowerQuery)) return 60

    // Fuzzy matching: count matching characters in order
    let score = 0
    let queryIndex = 0
    for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
      if (lowerText[i] === lowerQuery[queryIndex]) {
        score += 10
        queryIndex++
      }
    }
    return queryIndex === lowerQuery.length ? score : 0
  }, [])

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.length < minChars) {
        setResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)

      const searchResults: SearchResult<T>[] = items
        .map((item) => {
          let maxScore = 0

          searchFields.forEach((field) => {
            const fieldValue = String(item[field] || '')
            const score = scoreMatch(fieldValue, searchQuery)
            maxScore = Math.max(maxScore, score)
          })

          return { item, score: maxScore }
        })
        .filter((result) => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)

      setResults(searchResults)
      setIsSearching(false)
    },
    [items, searchFields, scoreMatch, minChars, maxResults]
  )

  // Debounced search function
  const debouncedSearch = useMemo(() => debounce(performSearch, delayMs), [performSearch, delayMs])

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      debouncedSearch(newQuery)
    },
    [debouncedSearch]
  )

  const clear = useCallback(() => {
    setQuery('')
    setResults([])
    debouncedSearch.cancel()
  }, [debouncedSearch])

  return {
    query,
    setQuery: handleQueryChange,
    results,
    isSearching,
    clear,
    hasResults: results.length > 0,
  }
}
