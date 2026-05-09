import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import '../../styles/access-control-extension.css'

export interface CommandItem {
    id: string
    label: string
    description?: string
    icon?: React.ReactNode
    category?: string
    action: () => void
    shortcut?: string
}

interface CommandPaletteProps {
    items: CommandItem[]
    isOpen: boolean
    onClose: () => void
    placeholder?: string
}

/**
 * CommandPalette Component — Cmd+K command palette for quick actions
 * Features: Fuzzy search, categories, keyboard navigation, custom icons
 */
export function CommandPalette({
    items,
    isOpen,
    onClose,
    placeholder = 'Cmd+K to search...',
}: CommandPaletteProps) {
    const [search, setSearch] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    // Fuzzy search filter
    const filtered = items.filter(item => {
        if (!search.trim()) return true
        const query = search.toLowerCase()
        return (
            item.label.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
        )
    })

    // Group by category
    const grouped = filtered.reduce((acc, item) => {
        const cat = item.category || 'General'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(item)
        return acc
    }, {} as Record<string, CommandItem[]>)

    const categories = Object.entries(grouped)
    const flatItems = categories.flatMap(([_, items]) => items)

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
            setSearch('')
            setSelectedIndex(0)
        }
    }, [isOpen])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setSelectedIndex(prev => Math.min(prev + 1, flatItems.length - 1))
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setSelectedIndex(prev => Math.max(prev - 1, 0))
                    break
                case 'Enter':
                    e.preventDefault()
                    if (flatItems[selectedIndex]) {
                        flatItems[selectedIndex].action()
                        onClose()
                    }
                    break
                case 'Escape':
                    e.preventDefault()
                    onClose()
                    break
            }
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose, selectedIndex, flatItems])

    const portal = document.getElementById('modal-portal')
    if (!portal) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-fixed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Command Palette */}
                    <div className="fixed inset-0 flex items-start justify-center pt-20 z-fixed pointer-events-none">
                        <motion.div
                            className="w-full max-w-2xl pointer-events-auto mx-4"
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="bg-s1 border border-bd rounded-lg shadow-lg overflow-hidden">
                                {/* Search Input */}
                                <div className="border-b border-bd p-4 flex gap-2 items-center">
                                    <span className="text-cy text-lg">⌘</span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder={placeholder}
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value)
                                            setSelectedIndex(0)
                                        }}
                                        className="flex-1 bg-transparent text-t0 placeholder-t2 outline-none"
                                    />
                                    <span className="text-t3 text-xs">ESC</span>
                                </div>

                                {/* Results */}
                                <div className="max-h-96 overflow-y-auto">
                                    {categories.length === 0 ? (
                                        <div className="p-8 text-center text-t2">No results found</div>
                                    ) : (
                                        categories.map(([category, items]) => (
                                            <div key={category}>
                                                {/* Category Header */}
                                                <div className="px-4 pt-3 pb-2 text-xs font-semibold text-t3 uppercase">
                                                    {category}
                                                </div>

                                                {/* Items */}
                                                {items.map((item, idx) => {
                                                    const itemIndex = flatItems.indexOf(item)
                                                    const isSelected = itemIndex === selectedIndex

                                                    return (
                                                        <motion.button
                                                            key={item.id}
                                                            className={`
                                                                w-full px-4 py-3 flex items-center gap-3
                                                                ${isSelected ? 'bg-cy/10 border-l-2 border-cy' : 'hover:bg-s2'}
                                                                transition-colors text-left
                                                            `}
                                                            onClick={() => {
                                                                item.action()
                                                                onClose()
                                                            }}
                                                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                                                            whileHover={{ x: 4 }}
                                                        >
                                                            {item.icon && (
                                                                <span className="flex-shrink-0">{item.icon}</span>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-t0 font-medium truncate">
                                                                    {item.label}
                                                                </div>
                                                                {item.description && (
                                                                    <div className="text-t2 text-xs truncate">
                                                                        {item.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {item.shortcut && (
                                                                <span className="flex-shrink-0 text-t3 text-xs">
                                                                    {item.shortcut}
                                                                </span>
                                                            )}
                                                        </motion.button>
                                                    )
                                                })}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="border-t border-bd p-2 flex gap-2 text-xs text-t3 justify-end">
                                    <span>↑↓</span>
                                    <span>navigate</span>
                                    <span>•</span>
                                    <span>⏎</span>
                                    <span>select</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        portal
    )
}

export default CommandPalette
