import React from 'react'
import { createPortal } from 'react-dom'

interface ToastMessage {
    id: string
    title: string
    description?: string
    type: 'info' | 'success' | 'warning' | 'error'
    duration?: number
    action?: { label: string; onClick: () => void }
}

interface ToastStackProps {
    messages: ToastMessage[]
    onDismiss: (id: string) => void
}

const typeConfig = {
    info: { bg: 'bg-bl/10', border: 'border-bl/30', text: 'text-bl', icon: 'ℹ' },
    success: { bg: 'bg-em/10', border: 'border-em/30', text: 'text-em', icon: '✓' },
    warning: { bg: 'bg-go/10', border: 'border-go/30', text: 'text-go', icon: '⚠' },
    error: { bg: 'bg-rd/10', border: 'border-rd/30', text: 'text-rd', icon: '●' },
}

/**
 * ToastStack Component — Global notification center
 * Stacks toasts in top-right with auto-dismiss and manual close
 */
export function ToastStack({ messages, onDismiss }: ToastStackProps) {
    const portal = document.getElementById('toast-stack-portal')
    if (!portal) return null

    return createPortal(
        <div className="space-y-2">
            {messages.map((msg) => {
                const config = typeConfig[msg.type]

                return (
                    <div
                        key={msg.id}
                        className={`
                            ${config.bg} ${config.border}
                            border rounded-lg p-4 w-80
                            flex gap-3
                            animate-in slide-in-right-2 fade-in duration-300
                            pointer-events-auto
                        `}
                        role="alert"
                    >
                        <div className="flex-shrink-0">
                            <span className={`${config.text} font-bold text-lg`}>
                                {config.icon}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className={`${config.text} font-semibold`}>
                                {msg.title}
                            </div>
                            {msg.description && (
                                <div className="text-t2 text-sm mt-1">
                                    {msg.description}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                            {msg.action && (
                                <button
                                    onClick={msg.action.onClick}
                                    className={`${config.text} text-sm font-semibold hover:opacity-70 transition-opacity`}
                                >
                                    {msg.action.label}
                                </button>
                            )}
                            <button
                                onClick={() => onDismiss(msg.id)}
                                className={`${config.text} hover:opacity-70 transition-opacity`}
                                aria-label="Dismiss"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>,
        portal
    )
}

export default ToastStack
