import { useEffect, useRef } from 'react'

interface CountUpProps {
    value: number
    duration?: number
    format?: (v: number) => string
    className?: string
    decimals?: number
}

/**
 * CountUp Component — Animated numeric counter with easing
 * Renders a number that animates from 0 to the target value
 */
export function CountUp({ 
    value, 
    duration = 1200, 
    format = (v) => v.toLocaleString(), 
    className = '',
    decimals = 0
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const start = 0
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing: easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const current = start + (value - start) * eased

            if (decimals > 0) {
                element.textContent = format(Math.round(current * Math.pow(10, decimals)) / Math.pow(10, decimals))
            } else {
                element.textContent = format(Math.floor(current))
            }

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        animate()
    }, [value, duration, format, decimals])

    return <span ref={ref} className={className}>{format(0)}</span>
}

export default CountUp
