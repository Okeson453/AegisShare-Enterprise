import React from 'react';

/**
 * HighlightText — Search result highlighting component
 * Splits text by search query and wraps matches in <mark> tags
 */

interface HighlightTextProps {
    text: string;
    query: string;
    caseSensitive?: boolean;
    className?: string;
    matchClassName?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
    text,
    query,
    caseSensitive = false,
    className = '',
    matchClassName = '',
}) => {
    if (!query || !text) {
        return <span className={className}>{text}</span>;
    }

    // Escape special regex characters in query
    const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create regex with case sensitivity flag
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${escapeRegExp(query)})`, flags);

    // Split text and create parts
    const parts = text.split(regex);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                const isMatch = index % 2 === 1;

                if (!isMatch || !part) {
                    return (
                        <React.Fragment key={index}>
                            {part}
                        </React.Fragment>
                    );
                }

                return (
                    <mark
                        key={index}
                        className={matchClassName}
                        style={{
                            backgroundColor: 'var(--cy2)',
                            color: 'var(--cy)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0 2px',
                        }}
                    >
                        {part}
                    </mark>
                );
            })}
        </span>
    );
};

HighlightText.displayName = 'HighlightText';

/**
 * Hook to extract snippet around search match
 * Usage: useSearchSnippet(text, query, contextLength)
 */
export function useSearchSnippet(text: string, query: string, contextLength: number = 50): string {
    return React.useMemo(() => {
        if (!query || !text) return text;

        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const matchIndex = lowerText.indexOf(lowerQuery);

        if (matchIndex === -1) return text.substring(0, contextLength) + '...';

        const start = Math.max(0, matchIndex - contextLength);
        const end = Math.min(text.length, matchIndex + query.length + contextLength);

        let snippet = text.substring(start, end);

        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';

        return snippet;
    }, [text, query, contextLength]);
}

/**
 * Hook to highlight text in search results
 * Usage: useHighlightedText(results, query)
 */
export function useHighlightedText(
    results: Array<{ id: string; text: string }>,
    query: string
): Array<{ id: string; text: string; highlighted: boolean }> {
    return React.useMemo(() => {
        return results.map((result) => ({
            ...result,
            highlighted: query ? result.text.toLowerCase().includes(query.toLowerCase()) : false,
        }));
    }, [results, query]);
}

/**
 * Component for rendering search result with highlighting
 */
interface SearchResultItemProps {
    id: string;
    title: string;
    description?: string;
    query: string;
    onSelect?: (id: string) => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
    id,
    title,
    description,
    query,
    onSelect,
}) => {
    return (
        <div
            role="option"
            tabIndex={0}
            onClick={() => onSelect?.(id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(id);
                }
            }}
            style={{
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--bd)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-hover)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--bd2)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--bd)';
            }}
        >
            <div style={{ marginBottom: 'var(--spacing-sm)', fontWeight: 600, color: 'var(--t0)' }}>
                <HighlightText text={title} query={query} />
            </div>
            {description && (
                <div style={{ fontSize: '0.875rem', color: 'var(--t2)', lineHeight: 1.5 }}>
                    <HighlightText text={description} query={query} />
                </div>
            )}
        </div>
    );
};

SearchResultItem.displayName = 'SearchResultItem';

/**
 * Hook for counting matches in text
 */
export function useMatchCount(text: string, query: string, caseSensitive: boolean = false): number {
    return React.useMemo(() => {
        if (!query || !text) return 0;

        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
        const matches = text.match(regex);

        return matches ? matches.length : 0;
    }, [text, query, caseSensitive]);
}
