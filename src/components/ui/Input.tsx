import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ error, label, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label className="text-sm font-medium text-t1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            px-3 py-2 bg-s0 border border-bd rounded-md
            text-t0 placeholder-t3
            focus:outline-none focus:border-cy focus:ring-1 focus:ring-cy
            transition-colors duration-200
            ${error ? 'border-rd focus:border-rd focus:ring-rd' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <span className="text-xs text-rd">{error}</span>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
