import { GlobalSearch } from '@/components/search/GlobalSearch'
import { useSearch } from '@/hooks/useSearch'

/**
 * Main App Layout Integration
 * Add GlobalSearch to app header/navigation
 */

interface AppLayoutIntegrationProps {
    // List of all searchable items across the app
    searchIndex?: Array<{ id: string; name: string; type: string; route: string }>
}

/**
 * Header Search Component
 * Integrates GlobalSearch into main app header
 */
export const HeaderSearch = ({ searchIndex = [] }: AppLayoutIntegrationProps) => {
    return (
        <div style={{ flex: 1, maxWidth: '400px' }}>
            <GlobalSearch
                items={searchIndex}
                searchFields={['name', 'type']}
                onSelect={(item) => {
                    // Navigate to selected item
                    const route = (item as any).route
                    if (route) {
                        window.location.href = route
                    }
                }}
                renderResult={(item) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{(item as any).name}</span>
                        <span
                            style={{
                                fontSize: '11px',
                                color: 'var(--t3)',
                                backgroundColor: 'var(--s2)',
                                padding: '2px 6px',
                                borderRadius: '3px',
                            }}
                        >
                            {(item as any).type}
                        </span>
                    </div>
                )}
                placeholder="Search policies, users, files... (Ctrl+K)"
                maxResults={8}
            />
        </div>
    )
}

/**
 * Build global search index from multiple app sections
 */
export const buildSearchIndex = (
    policies: any[] = [],
    users: any[] = [],
    files: any[] = [],
    compliance: any[] = []
) => {
    return [
        ...policies.map((p) => ({
            id: p.id,
            name: p.name,
            type: 'Policy',
            route: `/policy/${p.id}`,
        })),
        ...users.map((u) => ({
            id: u.id,
            name: u.name || u.email,
            type: 'User',
            route: `/admin/users/${u.id}`,
        })),
        ...files.map((f) => ({
            id: f.id,
            name: f.name,
            type: 'File',
            route: `/vault/${f.id}`,
        })),
        ...compliance.map((c) => ({
            id: c.id,
            name: c.title,
            type: 'Compliance',
            route: `/compliance/${c.id}`,
        })),
    ]
}

/**
 * Register Ctrl+K keyboard shortcut for search
 */
export const useSearchKeyboardShortcut = () => {
    const handleSearchOpen = () => {
        const searchInput = document.querySelector(
            'input[placeholder*="Search"]'
        ) as HTMLInputElement
        if (searchInput) {
            searchInput.focus()
        }
    }

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                handleSearchOpen()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])
}

import React from 'react'
