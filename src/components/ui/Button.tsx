import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    isLoading?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
        bg-gradient-to-r from-cy to-cy/80 text-s0
        border border-cy/30
        hover:shadow-lg hover:shadow-cy/20 transition-all
        active:scale-95 active:shadow-md
        focus:outline-none focus:ring-2 focus:ring-cy focus:ring-offset-2 focus:ring-offset-bg
    `,
    secondary: `
        bg-s3 text-t0
        border border-bd hover:border-bd1
        hover:bg-s4 transition-colors
        active:bg-s5
        focus:outline-none focus:ring-2 focus:ring-cy/50
    `,
    danger: `
        bg-rd/10 text-rd
        border border-rd/30 hover:border-rd/60
        hover:bg-rd/20 transition-colors
        active:bg-rd/30
        focus:outline-none focus:ring-2 focus:ring-rd/50
    `,
    ghost: `
        bg-transparent text-t0
        hover:bg-white/5 active:bg-white/10
        transition-colors
        focus:outline-none focus:ring-2 focus:ring-cy/50
    `,
    glass: `
        glass text-t0
        hover:bg-white/12 transition-all
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-cy/50
    `,
    outline: `
        bg-transparent text-cy
        border border-cy/50 hover:border-cy
        hover:bg-cy/5 transition-all
        focus:outline-none focus:ring-2 focus:ring-cy
    `,
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1',
    md: 'px-4 py-2 text-sm font-semibold gap-2',
    lg: 'px-6 py-3 text-base font-semibold gap-2',
    xl: 'px-8 py-4 text-lg font-bold gap-2',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ 
        variant = 'primary', 
        size = 'md', 
        className = '',
        isLoading = false,
        icon,
        iconPosition = 'left',
        disabled,
        children,
        ...props 
    }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
                    inline-flex items-center justify-center
                    rounded-lg font-medium
                    transition-all duration-300 ease-spring
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${variantStyles[variant]}
                    ${sizeStyles[size]}
                    ${className}
                `}
                {...props}
            >
                {isLoading ? (
                    <span className="animate-spin">⊙</span>
                ) : (
                    <>
                        {icon && iconPosition === 'left' && icon}
                        {children}
                        {icon && iconPosition === 'right' && icon}
                    </>
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
