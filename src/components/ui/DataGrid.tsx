import React, { useState, useMemo, useCallback } from 'react'
import { useVirtualization } from '@/hooks/useVirtualization'

type SortDirection = 'asc' | 'desc' | null

interface DataGridColumn {
    key: string
    label: string
    width?: number | string
    align?: 'left' | 'center' | 'right'
    sortable?: boolean
    render?: (value: any, row: any, index: number) => React.ReactNode
    onSort?: (direction: SortDirection) => void
}

interface DataGridProps<T> {
    rows: T[]
    columns: DataGridColumn[]
    rowHeight?: number
    containerHeight?: number
    selectable?: boolean
    selectedRows?: string[]
    onSelectionChange?: (rows: string[]) => void
    onRowClick?: (row: T, index: number) => void
    striped?: boolean
    loading?: boolean
    emptyMessage?: string
    className?: string
}

export function DataGrid<T extends { id: string | number }>(
    {
        rows,
        columns,
        rowHeight = 40,
        containerHeight = 600,
        selectable = false,
        selectedRows = [],
        onSelectionChange,
        onRowClick,
        striped = true,
        loading = false,
        emptyMessage = 'No data available',
        className = '',
    }: DataGridProps<T>
) {
    const [scrollTop, setScrollTop] = useState(0)
    const [sortField, setSortField] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>(null)

    // Sort rows
    const sortedRows = useMemo(() => {
        if (!sortField || !sortDirection) return rows

        return [...rows].sort((a, b) => {
            const aVal = (a as any)[sortField]
            const bVal = (b as any)[sortField]

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
    }, [rows, sortField, sortDirection])

    // Virtualization
    const { visibleItems, startIndex, offsetY, totalHeight } = useVirtualization({
        items: sortedRows,
        rowHeight,
        containerHeight,
        scrollTop,
    })

    const handleSort = useCallback((key: string) => {
        if (sortField === key) {
            setSortDirection(
                sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc'
            )
            if (sortDirection === 'desc') setSortField(null)
        } else {
            setSortField(key)
            setSortDirection('asc')
        }
    }, [sortField, sortDirection])

    const handleSelectAll = useCallback(() => {
        if (selectedRows.length === sortedRows.length) {
            onSelectionChange?.([])
        } else {
            // Use stable row IDs, not array indices
            onSelectionChange?.(sortedRows.map((r) => String(r.id)))
        }
    }, [selectedRows, sortedRows, onSelectionChange])

    const handleSelectRow = useCallback((rowId: string | number) => {
        const rowIdStr = String(rowId)
        onSelectionChange?.(
            selectedRows.includes(rowIdStr)
                ? selectedRows.filter(id => id !== rowIdStr)
                : [...selectedRows, rowIdStr]
        )
    }, [selectedRows, onSelectionChange])

    if (loading) {
        return (
            <div className={`bg-s1 border border-bd rounded-lg p-4 ${className}`}>
                <div className="flex items-center justify-center h-96">
                    <div className="text-t2">Loading...</div>
                </div>
            </div>
        )
    }

    if (!sortedRows.length) {
        return (
            <div className={`bg-s1 border border-bd rounded-lg p-4 ${className}`}>
                <div className="flex items-center justify-center h-96">
                    <div className="text-t2">{emptyMessage}</div>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-s1 border border-bd rounded-lg overflow-hidden ${className}`}>
            {/* Wrapper for mobile horizontal scroll */}
            <div className="overflow-x-auto -mx-3 sm:mx-0 sm:overflow-x-visible">
                <div className="inline-block min-w-full sm:w-full">
                    {/* Table Header */}
                    <div className="sticky top-0 bg-s2 border-b border-bd z-10">
                        <div className="flex h-12" style={{ minWidth: '100%' }}>
                            {/* Checkbox column */}
                            {selectable && (
                                <div className="flex-shrink-0 w-12 flex items-center justify-center border-r border-bd">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === sortedRows.length && sortedRows.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 cursor-pointer"
                                        aria-label="Select all"
                                    />
                                </div>
                            )}

                            {/* Column headers */}
                            {columns.map((col) => (
                                <div
                                    key={col.key}
                                    className={`
                                        flex-shrink-0 px-4 flex items-center
                                        border-r border-bd
                                        ${col.sortable ? 'cursor-pointer hover:bg-s3 transition-colors' : ''}
                                        ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}
                                        hidden sm:flex
                                    `}
                                    style={{ width: col.width || '150px' }}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <span className="font-semibold text-t0 text-sm whitespace-nowrap">
                                        {col.label}
                                        {col.sortable && sortField === col.key && (
                                            <span className="ml-2">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Table Body */}
                    <div
                        className="overflow-y-auto"
                        style={{ height: containerHeight }}
                        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
                    >
                        <div style={{ height: totalHeight, position: 'relative' }}>
                            <div style={{ transform: `translateY(${offsetY}px)` }}>
                                {visibleItems.map((row, localIndex) => {
                                    const globalIndex = startIndex + localIndex
                                    // Use stable row ID instead of array index
                                    const rowId = String(row.id)
                                    const isSelected = selectedRows.includes(rowId)

                                    return (
                                        <div
                                            key={row.id}
                                            className={`
                                                flex h-10
                                                border-b border-bd
                                                ${striped && globalIndex % 2 === 1 ? 'bg-s2' : 'bg-s1'}
                                                ${onRowClick ? 'cursor-pointer hover:bg-s3' : ''}
                                                transition-colors
                                            `}
                                            onClick={() => onRowClick?.(row, globalIndex)}
                                        >
                                            {/* Checkbox */}
                                            {selectable && (
                                                <div className="flex-shrink-0 w-12 flex items-center justify-center border-r border-bd">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectRow(row.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-4 h-4 cursor-pointer"
                                                    />
                                                </div>
                                            )}

                                            {/* Row cells - hide extra cols on mobile, show only first 2 */}
                                            {columns.map((col, colIndex) => {
                                                const value = (row as any)[col.key]
                                                // On mobile (hidden sm), only show first 2 columns
                                                const isMobileVisible = colIndex < 2

                                                return (
                                                    <div
                                                        key={col.key}
                                                        className={`
                                                            flex-shrink-0 px-4 flex items-center
                                                            border-r border-bd
                                                            ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}
                                                            text-t0 text-sm truncate
                                                            ${!isMobileVisible ? 'hidden sm:flex' : 'flex'}
                                                        `}
                                                        style={{ width: col.width || '150px' }}
                                                    >
                                                        {col.render ? col.render(value, row, globalIndex) : String(value || '—')}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-s2 border-t border-bd px-4 py-2 flex items-center justify-between text-xs text-t2">
                        <div>
                            {selectable && selectedRows.length > 0 ? (
                                <span>{selectedRows.length} selected</span>
                            ) : (
                                <span>{sortedRows.length} rows</span>
                            )}
                        </div>
                        <div>Showing {visibleItems.length} of {sortedRows.length}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataGrid
