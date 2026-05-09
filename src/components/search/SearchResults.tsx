import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VARIANTS, DURATION } from '@/styles/motion'
import { HighlightText } from '@/utils/highlightText'

interface SearchResultsProps<T> {
    results: Array<{ item: T; score: number }>
    query: string
    renderResult: (item: T) => ReactNode
    renderEmpty?: () => ReactNode
    maxHeight?: number
    isSearching?: boolean
}

export const SearchResults = <T extends any>({
    results,
    query,
    renderResult,
    renderEmpty,
    maxHeight = 400,
    isSearching = false,
}: SearchResultsProps<T>) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast }}
            style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--bd)',
                borderRadius: '8px',
                maxHeight: `${maxHeight}px`,
                overflowY: 'auto',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
            }}
        >
            <AnimatePresence mode="wait">
                {results.length === 0 ? (
                    <motion.div
                        key="empty"
                        variants={VARIANTS.fadeUp}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: 'var(--t2)',
                            fontSize: '14px',
                        }}
                    >
                        {isSearching ? (
                            <>
                                <div style={{ marginBottom: '8px' }}>Searching...</div>
                            </>
                        ) : renderEmpty ? (
                            renderEmpty()
                        ) : (
                            <div>No results found for "{query}"</div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        variants={VARIANTS.staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {results.map((result, index) => (
                            <motion.div
                                key={`result-${index}`}
                                variants={VARIANTS.fadeUp}
                                style={{
                                    padding: '12px 16px',
                                    borderBottom: index < results.length - 1 ? '1px solid var(--bd)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--s1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                            >
                                <div style={{ fontSize: '13px' }}>
                                    {renderResult(result.item)}
                                </div>

                                {/* Score indicator */}
                                <div
                                    style={{
                                        fontSize: '10px',
                                        color: 'var(--t3)',
                                        marginTop: '4px',
                                        opacity: 0.5,
                                        fontFamily: 'var(--font-mono)',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Relevance: {Math.round(result.score)}%
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
