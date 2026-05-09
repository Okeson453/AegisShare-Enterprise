import React, { ReactNode } from 'react'

export interface TabItem {
    id: string
    label: string
    content: ReactNode
    badge?: string | number
    disabled?: boolean
}

interface TabsProps {
    items: TabItem[]
    activeId: string
    onTabChange: (id: string) => void
    variant?: 'underline' | 'pill' | 'box'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const Tabs: React.FC<TabsProps> = ({
    items,
    activeId,
    onTabChange,
    variant = 'underline',
    size = 'md',
    className = '',
}) => {
    const sizeClasses = {
        sm: 'text-10px gap-6px py-4px px-10px',
        md: 'text-12px gap-12px py-6px px-12px',
        lg: 'text-13px gap-16px py-8px px-14px',
    }

    const variantClasses = {
        underline: 'border-b border-bd',
        pill: 'bg-s2 rounded-full p-4px',
        box: 'gap-8px',
    }

    return (
        <div className={`tabs tabs-${variant} ${className}`}>
            <div className={`tabs-header ${variantClasses[variant]} flex items-center ${sizeClasses[size]}`}>
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && onTabChange(item.id)}
                        disabled={item.disabled}
                        className={`tab-item transition-all duration-200 ${
                            activeId === item.id ? 'active' : ''
                        } ${item.disabled ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="flex items-center gap-8px">
                            {item.label}
                            {item.badge && (
                                <span className="badge badge-sm bg-cy1 text-cy text-10px px-6px py-2px rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </span>
                    </button>
                ))}
            </div>

            <div className="tabs-content">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`tab-pane transition-opacity duration-200 ${activeId === item.id ? 'active' : 'hidden'}`}
                    >
                        {item.content}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tabs
