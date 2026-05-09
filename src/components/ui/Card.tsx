import React from 'react'

type CardVariant = 'default' | 'elevated' | 'glass' | 'outline'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant
    hoverable?: boolean
    interactive?: boolean
}

const variantStyles: Record<CardVariant, string> = {
    default: `
        bg-s1 border border-bd
        shadow-sm
    `,
    elevated: `
        bg-s2 border border-bd1
        shadow-lg shadow-black/20
        backdrop-blur-sm
    `,
    glass: `
        glass
        hover:bg-white/8 transition-colors
    `,
    outline: `
        bg-transparent border border-bd1
        hover:border-cy/30 transition-all
    `,
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ 
        variant = 'default',
        hoverable = false, 
        interactive = false,
        className = '', 
        ...props 
    }, ref) => {
        return (
            <div
                ref={ref}
                className={`
                    rounded-lg p-4 transition-all duration-300
                    ${variantStyles[variant]}
                    ${(hoverable || interactive) ? 'hover:shadow-md cursor-pointer' : ''}
                    ${interactive ? 'active:scale-[0.98]' : ''}
                    ${className}
                `}
                {...props}
            />
        )
    }
)

Card.displayName = 'Card'

export default Card
