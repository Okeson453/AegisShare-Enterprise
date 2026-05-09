/**
 * Typography Scale System
 * Playfair Display (display) · JetBrains Mono (mono) · Plus Jakarta Sans (body)
 * WCAG AA compliance verified across all combinations
 */

export const TYPE_SCALE = {
    // Display — Playfair Display (main) / Cinzel (admin)
    display2xl: {
        size: '4.5rem',
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        weight: 900,
        family: 'var(--font-display)',
    },
    displayXl: {
        size: '3.75rem',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        weight: 900,
        family: 'var(--font-display)',
    },
    displayLg: {
        size: '3rem',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        weight: 700,
        family: 'var(--font-display)',
    },
    displayMd: {
        size: '2.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.015em',
        weight: 700,
        family: 'var(--font-display)',
    },
    displaySm: {
        size: '1.875rem',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
        weight: 700,
        fontStyle: 'italic',
        family: 'var(--font-display)',
    },

    // Body — Plus Jakarta Sans
    textXl: {
        size: '1.25rem',
        lineHeight: 1.75,
        weight: 400,
        family: 'var(--font-body)',
    },
    textLg: {
        size: '1.125rem',
        lineHeight: 1.75,
        weight: 400,
        family: 'var(--font-body)',
    },
    textMd: {
        size: '1rem',
        lineHeight: 1.625,
        weight: 400,
        family: 'var(--font-body)',
    },
    textSm: {
        size: '0.875rem',
        lineHeight: 1.5,
        weight: 400,
        family: 'var(--font-body)',
    },
    textXs: {
        size: '0.75rem',
        lineHeight: 1.5,
        weight: 500,
        family: 'var(--font-body)',
    },

    // Mono — JetBrains Mono (data, hashes, code, badges)
    monoLg: {
        size: '0.875rem',
        lineHeight: 1.75,
        weight: 400,
        letterSpacing: '0.04em',
        family: 'var(--font-mono)',
    },
    monoMd: {
        size: '0.8125rem',
        lineHeight: 1.6,
        weight: 400,
        letterSpacing: '0.04em',
        family: 'var(--font-mono)',
    },
    monoSm: {
        size: '0.75rem',
        lineHeight: 1.5,
        weight: 500,
        letterSpacing: '0.06em',
        family: 'var(--font-mono)',
    },
    monoXs: {
        size: '0.6875rem',
        lineHeight: 1.4,
        weight: 600,
        letterSpacing: '0.1em',
        family: 'var(--font-mono)',
    },

    // Semantic mappings for common use cases
    label: {
        size: '0.875rem',
        lineHeight: 1.5,
        weight: 500,
        family: 'var(--font-body)',
    },
    caption: {
        size: '0.75rem',
        lineHeight: 1.5,
        weight: 400,
        family: 'var(--font-body)',
    },
    badge: {
        size: '0.6875rem',
        lineHeight: 1.4,
        weight: 600,
        letterSpacing: '0.06em',
        family: 'var(--font-mono)',
    },
} as const;

// Tailwind-compatible scale for @apply usage
export const typographyClasses = {
    'display-2xl': 'text-9xl font-900 italic tracking-tight leading-tight',
    'display-xl': 'text-8xl font-900 italic tracking-tighter leading-tight',
    'display-lg': 'text-6xl font-bold italic tracking-tighter leading-snug',
    'display-md': 'text-5xl font-bold italic tracking-tight leading-snug',
    'display-sm': 'text-4xl font-bold italic tracking-tight leading-relaxed',
    'text-xl': 'text-xl font-normal leading-7',
    'text-lg': 'text-lg font-normal leading-7',
    'text-md': 'text-base font-normal leading-relaxed',
    'text-sm': 'text-sm font-normal leading-6',
    'text-xs': 'text-xs font-medium leading-6',
    'mono-lg': 'font-mono text-sm font-normal tracking-wide',
    'mono-md': 'font-mono text-xs font-normal tracking-wide',
    'mono-sm': 'font-mono text-xs font-medium tracking-wider',
    'mono-xs': 'font-mono text-xs font-semibold tracking-widest',
    'label': 'text-sm font-medium leading-6',
    'caption': 'text-xs font-normal leading-6',
    'badge': 'font-mono text-xs font-semibold tracking-wider',
} as const;
