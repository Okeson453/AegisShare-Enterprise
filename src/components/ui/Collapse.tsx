import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../../styles/access-control-extension.css'

interface CollapseProps {
    title: React.ReactNode
    children: React.ReactNode
    defaultOpen?: boolean
    icon?: React.ReactNode
    onToggle?: (open: boolean) => void
    className?: string
}

/**
 * Collapse Component — Expandable section with smooth animation
 * Used for accordion-style panels in configuration/settings
 */
export function Collapse({
    title,
    children,
    defaultOpen = true,
    icon,
    onToggle,
    className = '',
}: CollapseProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const handleToggle = () => {
        const newState = !isOpen
        setIsOpen(newState)
        onToggle?.(newState)
    }

    return (
        <div className={`border border-bd rounded-lg overflow-hidden ${className}`}>
            {/* Header */}
            <button
                onClick={handleToggle}
                className="w-full px-4 py-3 flex items-center gap-2 justify-between bg-s2 hover:bg-s3 transition-colors text-left"
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    <span className="font-semibold text-t0">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    ▼
                </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-4 py-3 border-t border-bd bg-s1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Collapse
