/**
 * Motion Design System
 * All animation primitives for AegisShare
 * Spring physics, easing functions, duration timings, stagger patterns
 */

// Spring configurations for different interaction types
export const SPRING = {
    // Snappy — immediate UI feedback (toggles, clicks, rapid feedback)
    snappy: { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.8 },
    // Smooth — panel slides, modals, measured transitions
    smooth: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 1 },
    // Gentle — page transitions, list reveals, user-driven
    gentle: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 1.2 },
    // Bouncy — success states, confirmations, celebratory feedback
    bouncy: { type: 'spring' as const, stiffness: 400, damping: 20, mass: 0.9 },
    // Inertia — drag and drop release, momentum-based conclusion
    inertia: { type: 'inertia' as const, velocity: 50 },
} as const;

// Easing functions (cubic-bezier format)
export const EASE = {
    // Fast-in, decelerate — entrance animations
    out: [0.16, 1, 0.3, 1] as const,
    // Accelerate — exit animations
    in: [0.7, 0, 0.84, 0] as const,
    // Symmetric — reversible states (hover, toggle)
    inOut: [0.83, 0, 0.17, 1] as const,
    // Recoil before move — anticipatory accent
    anticipate: [0.36, 0, 0.66, -0.56] as const,
    // Past target, snap back — elastic accent
    overshoot: [0.34, 1.56, 0.64, 1] as const,
} as const;

// Duration timings in seconds
// Maximum is 800ms — users must not feel UI is slow
export const DURATION = {
    instant: 0.08,      // Icon swaps, color changes, micro-interactions
    fast: 0.15,         // Hover states, toggles, badge updates
    normal: 0.2,        // Standard interactions, button actions
    moderate: 0.25,     // Cards, chips, badges revealed
    standard: 0.35,     // Panels, drawers, modals entering
    slow: 0.5,          // Page transitions, hero reveals
    dramatic: 0.8,      // Onboarding, empty states, special moments
} as const;

// Stagger delays for list items and animated groups
export const STAGGER = {
    fast: 0.04,         // Dense lists (audit log rows, file list)
    normal: 0.06,       // Card grids, service cards
    slow: 0.08,         // Hero sections, feature reveals
    dramatic: 0.12,     // Landing animations, onboarding sequences
} as const;

// Reusable motion variants for common animation patterns
export const VARIANTS = {
    // Fade + slide up entrance
    fadeUp: {
        hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
        visible: (i?: number) => ({
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: DURATION.standard,
                ease: EASE.out,
                delay: i ? i * STAGGER.normal : 0,
            },
        }),
        exit: {
            opacity: 0,
            y: -8,
            filter: 'blur(2px)',
            transition: { duration: DURATION.fast, ease: EASE.in },
        },
    },

    // Fade + slide down entrance
    fadeDown: {
        hidden: { opacity: 0, y: -16, filter: 'blur(4px)' },
        visible: (i?: number) => ({
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: DURATION.standard,
                ease: EASE.out,
                delay: i ? i * STAGGER.normal : 0,
            },
        }),
        exit: { opacity: 0, y: 8, filter: 'blur(2px)', transition: { duration: DURATION.fast, ease: EASE.in } },
    },

    // Fade + slide right entrance
    slideRight: {
        hidden: { opacity: 0, x: -24 },
        visible: (i?: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                ...SPRING.smooth,
                delay: i ? i * STAGGER.normal : 0,
            },
        }),
        exit: { opacity: 0, x: 24, transition: { duration: DURATION.moderate, ease: EASE.in } },
    },

    // Fade + slide left entrance
    slideLeft: {
        hidden: { opacity: 0, x: 24 },
        visible: (i?: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                ...SPRING.smooth,
                delay: i ? i * STAGGER.normal : 0,
            },
        }),
        exit: { opacity: 0, x: -24, transition: { duration: DURATION.moderate, ease: EASE.in } },
    },

    // Fade + scale entrance (popup, modal)
    scaleUp: {
        hidden: { opacity: 0, scale: 0.92 },
        visible: (i?: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                ...SPRING.smooth,
                delay: i ? i * STAGGER.fast : 0,
            },
        }),
        exit: { opacity: 0, scale: 0.96, transition: { duration: DURATION.fast, ease: EASE.in } },
    },

    // Fade + scale down exit
    scaleDown: {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1, transition: SPRING.smooth },
        exit: { opacity: 0, scale: 0.92, transition: { duration: DURATION.moderate, ease: EASE.in } },
    },

    // Container variant for staggering children
    staggerContainer: {
        hidden: { opacity: 1 },
        visible: (i?: number) => ({
            transition: {
                staggerChildren: STAGGER.normal,
                delayChildren: i ? i * 0.05 : 0,
            },
        }),
    },

    // Container with dense stagger
    staggerContainerFast: {
        hidden: { opacity: 1 },
        visible: {
            transition: {
                staggerChildren: STAGGER.fast,
            },
        },
    },

    // Rotate entrance
    rotateIn: {
        hidden: { opacity: 0, rotate: -8 },
        visible: { opacity: 1, rotate: 0, transition: SPRING.snappy },
        exit: { opacity: 0, rotate: 8, transition: { duration: DURATION.fast, ease: EASE.in } },
    },

    // X-axis flip
    flipX: {
        hidden: { opacity: 0, rotateY: -90 },
        visible: { opacity: 1, rotateY: 0, transition: SPRING.smooth },
    },

    // Swing entrance (anticipatory)
    swing: {
        hidden: { opacity: 0, rotateZ: -8 },
        visible: {
            opacity: 1,
            rotateZ: 0,
            transition: { ...SPRING.snappy, ease: EASE.anticipate },
        },
    },
} as const;

// Tap/interaction feedback
export const TAP = {
    scale: 0.97,
    transition: { duration: 0.08 },
} as const;

// Hover feedback — used with whileHover
export const HOVER = {
    scale: 1.02,
    transition: SPRING.snappy,
} as const;

// Loading shimmer animation keyframes
export const SHIMMER_KEYFRAMES = {
    animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
    backgroundSize: '200% 100%',
} as const;

// Export all motion constants as a single namespace
export const MOTION = {
    SPRING,
    EASE,
    DURATION,
    STAGGER,
    VARIANTS,
    TAP,
    HOVER,
    SHIMMER_KEYFRAMES,
} as const;
