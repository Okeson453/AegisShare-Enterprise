import React from 'react'import '../../styles/access-control-extension.css';
interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            {icon && <div className="mb-4 text-4xl opacity-50">{icon}</div>}
            <h3 className="text-lg font-semibold text-t0 mb-2">{title}</h3>
            {description && <p className="text-sm text-t2 mb-6">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    )
}

export default EmptyState
