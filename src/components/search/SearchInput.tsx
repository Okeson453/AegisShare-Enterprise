import { InputHTMLAttributes } from 'react'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    query: string
    onChange: (value: string) => void
    onClear?: () => void
    isSearching?: boolean
    placeholder?: string
}

export const SearchInput = ({
    query,
    onChange,
    onClear,
    isSearching = false,
    placeholder = 'Search...',
    ...rest
}: SearchInputProps) => {
    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {/* Search icon */}
            <span
                style={{
                    position: 'absolute',
                    left: '12px',
                    fontSize: '16px',
                    color: 'var(--t2)',
                    pointerEvents: 'none',
                }}
            >
                🔍
            </span>

            {/* Input field */}
            <input
                type="text"
                value={query}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: query || isSearching ? '36px' : '12px',
                    fontSize: '14px',
                    backgroundColor: 'var(--s1)',
                    border: '1px solid var(--bd)',
                    borderRadius: '6px',
                    color: 'var(--t0)',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cy)'
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(34, 211, 238, 0.1)'
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--bd)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
                {...rest}
            />

            {/* Loading spinner or clear button */}
            {isSearching ? (
                <div
                    style={{
                        position: 'absolute',
                        right: '12px',
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(34, 211, 238, 0.2)',
                        borderTopColor: 'var(--cy)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }}
                />
            ) : query && onClear ? (
                <button
                    onClick={onClear}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--t2)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '4px',
                        opacity: 0.6,
                        transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        ; (e.currentTarget as HTMLButtonElement).style.opacity = '1'
                    }}
                    onMouseLeave={(e) => {
                        ; (e.currentTarget as HTMLButtonElement).style.opacity = '0.6'
                    }}
                    aria-label="Clear search"
                >
                    ✕
                </button>
            ) : null}

            <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    )
}
