import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SearchInput } from './SearchInput'
import { SearchResults } from './SearchResults'
import { useSearch } from '@/hooks/useSearch'

interface GlobalSearchProps<T> {
    items: T[]
    searchFields: (keyof T)[]
    onSelect: (item: T) => void
    renderResult: (item: T) => React.ReactNode
    placeholder?: string
    maxResults?: number
}

export const GlobalSearch = <T extends Record<string, any>>({
    items,
    searchFields,
    onSelect,
    renderResult,
    placeholder = 'Search...',
    maxResults = 8,
}: GlobalSearchProps<T>) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const { query, setQuery, results, isSearching, clear, hasResults } = useSearch(items, searchFields, {
        delayMs: 300,
        minChars: 1,
        maxResults,
    })

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false)
                clear()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            return () => document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, clear])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleSelect = (item: T) => {
        onSelect(item)
        setIsOpen(false)
        clear()
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
            }}
        >
            <SearchInput
                query={query}
                onChange={(value) => {
                    setQuery(value)
                    setIsOpen(value.length > 0)
                }}
                onClear={() => {
                    clear()
                    setIsOpen(false)
                }}
                isSearching={isSearching}
                placeholder={placeholder}
            />

            <AnimatePresence>
                {isOpen && hasResults && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                        }}
                    >
                        <SearchResults
                            results={results}
                            query={query}
                            renderResult={renderResult}
                            isSearching={isSearching}
                            renderEmpty={() => <div>No results found</div>}
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Handle item selection */}
            {results.map((result) => (
                <div
                    key={JSON.stringify(result.item)}
                    onClick={() => handleSelect(result.item)}
                    style={{ display: 'none' }}
                />
            ))}
        </div>
    )
}
