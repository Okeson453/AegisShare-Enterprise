import React from 'react'

interface TabItem {
    id: string
    label: string
    badge?: string
}

interface TabsProps {
    items: TabItem[]
    activeTab: string
    onTabChange: (tabId: string) => void
}

const Tabs: React.FC<TabsProps> = ({ items, activeTab, onTabChange }) => {
    return (
        <div className="flex gap-1 border-b border-bd">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
            px-4 py-3 text-sm font-medium
            border-b-2 transition-colors duration-200
            ${activeTab === item.id
                            ? 'border-cy text-cy'
                            : 'border-transparent text-t1 hover:text-t0'
                        }
          `}
                >
                    {item.label}
                    {item.badge && (
                        <span className="ml-2 px-2 py-0.5 bg-cy/20 text-cy rounded text-xs">
                            {item.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}

export default Tabs
