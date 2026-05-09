import React, { useState, useRef, useEffect, ReactNode } from 'react'

interface PopoverProps {
    trigger: ReactNode
    content: ReactNode
    placement?: 'top' | 'bottom' | 'left' | 'right'
    trigger_type?: 'click' | 'hover'
    className?: string
}

const Popover: React.FC<PopoverProps> = ({
    trigger,
    content,
    placement = 'bottom',
    trigger_type = 'click',
    className = '',
}) => {
    const [open, setOpen] = useState(false)
    const popoverRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (trigger_type === 'click') {
            const handleClickOutside = (e: MouseEvent) => {
                if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                    setOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [trigger_type])

    const placementClasses = {
        top: 'bottom-full mb-8px',
        bottom: 'top-full mt-8px',
        left: 'right-full mr-8px',
        right: 'left-full ml-8px',
    }

    return (
        <div ref={popoverRef} className={`popover relative inline-block ${className}`}>
            <div
                ref={triggerRef}
                onClick={() => trigger_type === 'click' && setOpen(!open)}
                onMouseEnter={() => trigger_type === 'hover' && setOpen(true)}
                onMouseLeave={() => trigger_type === 'hover' && setOpen(false)}
                className="popover-trigger cursor-pointer"
            >
                {trigger}
            </div>

            {open && (
                <div
                    className={`popover-content absolute ${placementClasses[placement]} 
                    z-popover bg-glass-2 backdrop-blur-12px border border-glass-bd
                    rounded-radius-lg shadow-glass-glow p-12px min-w-200px
                    animate-fade-in`}
                    onMouseEnter={() => trigger_type === 'hover' && setOpen(true)}
                    onMouseLeave={() => trigger_type === 'hover' && setOpen(false)}
                >
                    {content}
                </div>
            )}
        </div>
    )
}

export default Popover
