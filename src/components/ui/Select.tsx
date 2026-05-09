import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SelectOption {
    value: string | number
    label: string
}

interface SelectProps {
    options: SelectOption[]
    value?: string | number
    onChange?: (value: string | number) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
}

/**
 * Select Component — Dropdown select with Framer Motion animations
 * Features: hover effects, keyboard support, smooth open/close
 */
export function Select({
    options,
    value,
    onChange,
    placeholder = 'Select an option...',
    disabled = false,
    className = '',
    size = 'md',
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
            {/* Trigger */}
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    ${sizeClasses[size]}
                    w-full bg-s3 border border-bd rounded-lg
                    text-t0 text-left
                    flex justify-between items-center gap-2
                    hover:border-bd1 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                `}
            >
                <span className={value === undefined ? 'text-t2' : 'text-t0'}>
                    {selectedLabel}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    ▼
                </motion.div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-s1 border border-bd rounded-lg shadow-lg z-dropdown"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange?.(option.value)
                                    setIsOpen(false)
                                }}
                                className={`
                                    w-full px-4 py-2 text-left
                                    hover:bg-s2 transition-colors
                                    ${value === option.value ? 'bg-cy/10 text-cy font-semibold border-l-2 border-cy' : 'text-t0'}
                                    first:rounded-t-lg last:rounded-b-lg
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Select
