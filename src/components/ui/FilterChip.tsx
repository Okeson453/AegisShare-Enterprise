import React from 'react'

interface FilterChipProps {
    label: string
    active?: boolean
    onClick: () => void
    removable?: boolean
    onRemove?: () => void
    count?: number
    className?: string
}

const FilterChip: React.FC<FilterChipProps> = ({
    label,
    active = false,
    onClick,
    removable = false,
    onRemove,
    count,
    className = '',
}) => {
    return (
        <button
            onClick={onClick}
            className={`filter-chip inline-flex items-center gap-6px px-10px py-6px
            border rounded-full text-11px font-600 transition-all duration-200
            ${
                active
                    ? 'bg-cy text-black border-cy'
                    : 'bg-transparent border-bd text-t2 hover:border-bd1'
            } ${className}`}
        >
            <span className="whitespace-nowrap">{label}</span>
            {count !== undefined && (
                <span className="text-10px opacity-75">
                    ({count})
                </span>
            )}
            {removable && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove?.()
                    }}
                    className="ml-4px text-14px opacity-60 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            )}
        </button>
    )
}

export default FilterChip
