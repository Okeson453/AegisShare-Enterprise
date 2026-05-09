import React from 'react'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg'
}

const sizeStyles: Record<string, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ size = 'md', className = '', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`
          ${sizeStyles[size]}
          rounded-full border-bd
          border-t-cy
          animate-spin
          ${className}
        `}
                {...props}
            />
        )
    }
)

Spinner.displayName = 'Spinner'

export default Spinner
