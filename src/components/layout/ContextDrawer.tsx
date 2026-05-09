import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ContextDrawerProps {
    isOpen: boolean
    title: string
    children: React.ReactNode
    onClose: () => void
    width?: number // pixels, default 320
}

/**
 * ContextDrawer Component — Ephemeral side panel for related intelligence
 * Slides in from the right, animates out on close or backdrop click
 * Usage: user clicks table row → drawer shows related details
 */
export function ContextDrawer({
    isOpen,
    title,
    children,
    onClose,
    width = 320
}: ContextDrawerProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    const portal = document.getElementById('context-drawer-portal')
    if (!portal) return null

    return createPortal(
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-fixed"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                className={`
                    fixed right-0 top-0 bottom-0
                    bg-s1 border-l border-bd
                    shadow-xl shadow-black/40
                    transition-all duration-300 ease-smooth
                    flex flex-col
                    ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
                `}
                style={{ width, zIndex: 'var(--z-fixed)' }}
            >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-bd">
                    <h2 className="text-lg font-semibold text-t0">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-t2 hover:text-t0 transition-colors p-1"
                        aria-label="Close drawer"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        </>,
        portal
    )
}

export default ContextDrawer
