export const BP = {
    xs: 320,     // iPhone SE
    sm: 480,     // Large phones
    md: 768,     // iPad portrait / large phones landscape
    lg: 1024,    // iPad landscape / small laptops
    xl: 1280,    // Laptops
    '2xl': 1440, // Large laptops / small desktops
    '3xl': 1920, // Full HD desktops
    '4k': 2560,  // 4K / ultrawide
} as const

export type Breakpoint = keyof typeof BP

export interface BreakpointState {
    bp: Breakpoint
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isWidescreen: boolean
    isTouch: boolean
    is4K: boolean
}

/**
 * Get current breakpoint from window width
 */
export const getBreakpointFromWidth = (width: number): Breakpoint => {
    if (width < BP.sm) return 'xs'
    if (width < BP.md) return 'sm'
    if (width < BP.lg) return 'md'
    if (width < BP.xl) return 'lg'
    if (width < BP['2xl']) return 'xl'
    if (width < BP['3xl']) return '2xl'
    if (width < BP['4k']) return '3xl'
    return '4k'
}

/**
 * Get responsive state from breakpoint
 * Maps breakpoint to logical states (isMobile, isDesktop, etc)
 */
export const getBreakpointState = (bp: Breakpoint): BreakpointState => ({
    bp,
    isMobile: ['xs', 'sm'].includes(bp),
    isTablet: bp === 'md',
    isDesktop: ['lg', 'xl', '2xl', '3xl', '4k'].includes(bp),
    isWidescreen: ['3xl', '4k'].includes(bp),
    isTouch: typeof window !== 'undefined' && 'ontouchstart' in window,
    is4K: bp === '4k',
})

/**
 * Backward compatibility: get breakpoint info from width
 */
export function getBreakpointInfo(width: number): BreakpointState {
    const bp = getBreakpointFromWidth(width)
    return getBreakpointState(bp)
}
