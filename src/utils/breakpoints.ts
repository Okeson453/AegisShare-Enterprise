import React from 'react';

/**
 * Breakpoints and Responsive Utilities
 * Mobile-first breakpoint system matching Tailwind defaults
 */

export const BREAKPOINTS = {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1920,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type BreakpointValue = (typeof BREAKPOINTS)[Breakpoint];

/**
 * Get all breakpoints greater than or equal to a given size
 * Useful for responsive prop objects
 */
export function getBreakpointUp(breakpoint: Breakpoint): string {
    return `@media (min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/**
 * Get all breakpoints less than a given size
 */
export function getBreakpointDown(breakpoint: Breakpoint): string {
    const breakpointArray = (Object.keys(BREAKPOINTS) as Breakpoint[]).sort(
        (a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]
    );
    const index = breakpointArray.indexOf(breakpoint);

    if (index === 0) return '';

    const previousBreakpoint = breakpointArray[index - 1];
    return `@media (max-width: ${BREAKPOINTS[previousBreakpoint] - 1}px)`;
}

/**
 * Get CSS media query for a breakpoint range
 */
export function getBreakpointOnly(breakpoint: Breakpoint): string {
    const breakpointArray = (Object.keys(BREAKPOINTS) as Breakpoint[]).sort(
        (a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]
    );
    const index = breakpointArray.indexOf(breakpoint);

    const minWidth = BREAKPOINTS[breakpoint];
    const maxWidth =
        index < breakpointArray.length - 1 ? BREAKPOINTS[breakpointArray[index + 1]] - 1 : Infinity;

    return `@media (min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`;
}

/**
 * React hook to check if screen is at or above a breakpoint
 * Usage: const isMobile = useBreakpoint('md')
 */
export function useBreakpointUp(breakpoint: Breakpoint): boolean {
    const [matches, setMatches] = React.useState(false);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);

        // Check initial state
        setMatches(mediaQuery.matches);

        // Listen for changes
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        mediaQuery.addEventListener('change', listener);

        return () => mediaQuery.removeEventListener('change', listener);
    }, [breakpoint]);

    return matches;
}

/**
 * React hook to check if screen is below a breakpoint
 * Usage: const isSmallScreen = useBreakpointDown('md')
 */
export function useBreakpointDown(breakpoint: Breakpoint): boolean {
    const [matches, setMatches] = React.useState(false);

    React.useEffect(() => {
        const breakpointArray = (Object.keys(BREAKPOINTS) as Breakpoint[]).sort(
            (a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]
        );
        const index = breakpointArray.indexOf(breakpoint);

        if (index === 0) {
            setMatches(true);
            return;
        }

        const previousBreakpoint = breakpointArray[index - 1];
        const mediaQuery = window.matchMedia(`(max-width: ${BREAKPOINTS[previousBreakpoint] - 1}px)`);

        setMatches(mediaQuery.matches);

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        mediaQuery.addEventListener('change', listener);

        return () => mediaQuery.removeEventListener('change', listener);
    }, [breakpoint]);

    return matches;
}

/**
 * React hook to get current breakpoint
 * Returns the smallest breakpoint where the device width matches
 */
export function useCurrentBreakpoint(): Breakpoint | null {
    const [breakpoint, setBreakpoint] = React.useState<Breakpoint | null>(null);

    React.useEffect(() => {
        const updateBreakpoint = () => {
            const breakpointArray = (Object.keys(BREAKPOINTS) as Breakpoint[]).sort(
                (a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]
            );

            for (let i = breakpointArray.length - 1; i >= 0; i--) {
                const bp = breakpointArray[i];
                const mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`);

                if (mediaQuery.matches) {
                    setBreakpoint(bp);
                    return;
                }
            }

            setBreakpoint('xs');
        };

        updateBreakpoint();

        // Listen to all breakpoint changes
        const mediaQueries = (Object.keys(BREAKPOINTS) as Breakpoint[]).map((bp) => ({
            bp,
            mq: window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`),
        }));

        const listener = () => updateBreakpoint();
        mediaQueries.forEach(({ mq }) => mq.addEventListener('change', listener));

        return () => mediaQueries.forEach(({ mq }) => mq.removeEventListener('change', listener));
    }, []);

    return breakpoint;
}

/**
 * React hook to run effect only on specific breakpoints
 * Usage: useBreakpointEffect(() => { ... }, ['xs', 'sm'])
 */
export function useBreakpointEffect(
    effect: () => void | (() => void),
    breakpoints: Breakpoint[]
): void {
    const currentBreakpoint = useCurrentBreakpoint();

    React.useEffect(() => {
        if (currentBreakpoint && breakpoints.includes(currentBreakpoint)) {
            return effect();
        }
    }, [currentBreakpoint, breakpoints, effect]);
}

/**
 * Responsive value hook
 * Returns different values based on current breakpoint
 * Usage: const padding = useResponsiveValue({ xs: 8, md: 16, lg: 24 })
 */
export function useResponsiveValue<T>(
    values: Partial<Record<Breakpoint, T>>,
    defaultValue?: T
): T | undefined {
    const currentBreakpoint = useCurrentBreakpoint();

    if (!currentBreakpoint) return defaultValue;

    // Find the largest breakpoint where we have a value
    const breakpointArray = (Object.keys(BREAKPOINTS) as Breakpoint[]).sort(
        (a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]
    );
    const currentIndex = breakpointArray.indexOf(currentBreakpoint);

    for (let i = currentIndex; i >= 0; i--) {
        const bp = breakpointArray[i];
        if (values[bp] !== undefined) {
            return values[bp];
        }
    }

    return defaultValue;
}

/**
 * CSS-in-JS helper for media queries
 * Usage: css`${media.up('md')} { padding: 24px; }`
 */
export const media = {
    up: getBreakpointUp,
    down: getBreakpointDown,
    only: getBreakpointOnly,
};

/**
 * Generate responsive class string based on current breakpoint
 * Usage: getResponsiveClasses({ xs: 'block', md: 'hidden' })
 */
export function getResponsiveClasses(classMap: Partial<Record<Breakpoint, string>>): string {
    return (Object.keys(classMap) as Breakpoint[])
        .map((bp) => classMap[bp])
        .filter((cls) => cls)
        .join(' ');
}

/**
 * Utility to combine responsive values into CSS variables
 * Usage: setResponsiveCSSVariables({ '--padding': { xs: '8px', md: '16px' } })
 */
export function setResponsiveCSSVariables(
    variables: Record<string, Partial<Record<Breakpoint, string>>>
): void {
    const breakpointArray = (Object.keys(BREAKPOINTS) as Breakpoint[]).sort(
        (a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]
    );

    breakpointArray.forEach((bp) => {
        const mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`);

        const updateVariables = () => {
            if (mediaQuery.matches) {
                Object.entries(variables).forEach(([varName, values]) => {
                    if (values[bp]) {
                        document.documentElement.style.setProperty(varName, values[bp]);
                    }
                });
            }
        };

        updateVariables();
        mediaQuery.addEventListener('change', updateVariables);
    });
}

/**
 * Check if device is mobile
 * Usage: const isMobile = isMobileDevice()
 */
export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device is tablet
 */
export function isTabletDevice(): boolean {
    if (typeof window === 'undefined') return false;

    return /iPad|Android/i.test(navigator.userAgent);
}

/**
 * Check if device is touch-capable
 */
export function isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;

    return (
        typeof window.ontouchstart !== 'undefined' ||
        typeof (window as any).onmsgesturechange !== 'undefined' ||
        navigator.maxTouchPoints > 0
    );
}
