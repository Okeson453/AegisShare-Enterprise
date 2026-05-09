import React from 'react'

interface AvatarProps {
    initials: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeStyles: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
}

const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md' }) => {
    return (
        <div
            className={`
        ${sizeStyles[size]}
        flex items-center justify-center
        rounded-md border border-cy bg-cy/10
        font-mono font-semibold text-cy
      `}
        >
            {initials}
        </div>
    )
}

export default Avatar
