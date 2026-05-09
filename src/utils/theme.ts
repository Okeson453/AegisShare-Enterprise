/**
 * Theme System - Dynamic theming utilities for AegisShare v4
 * Supports runtime theme switching without CSS recompilation
 */

export type ThemeName = 'dark' | 'light' | 'noir' | 'cyber' | 'forest' | 'ocean'

export interface ThemeTokens {
    // Primary Colors
    cy: string
    em: string
    am: string
    rd: string
    vl: string

    // Surface Colors
    s1: string
    s2: string
    s3: string

    // Text Colors
    t0: string
    t1: string
    t2: string
    t3: string

    // Borders
    bd: string
    bd1: string

    // Glass
    glass1: string
    glass2: string
    glassBd: string

    // Special GodMode Colors
    go: string
    ice: string
    bl: string
    nv: string
    gs: string
}

const themes: Record<ThemeName, ThemeTokens> = {
    dark: {
        cy: '#22D3EE',
        em: '#4CAF50',
        am: '#FFC107',
        rd: '#F44336',
        vl: '#2196F3',
        s1: '#1E1E2E',
        s2: '#2A2A3E',
        s3: '#0F0F1E',
        t0: '#F5F5F5',
        t1: '#D0D0D0',
        t2: '#808080',
        t3: '#505050',
        bd: '#404050',
        bd1: '#505060',
        glass1: 'rgba(30, 30, 46, 0.8)',
        glass2: 'rgba(42, 42, 62, 0.8)',
        glassBd: 'rgba(64, 64, 80, 0.4)',
        go: '#FFD700',
        ice: '#E0F7FA',
        bl: '#1A237E',
        nv: '#0D47A1',
        gs: '#424242',
    },
    light: {
        cy: '#0891B2',
        em: '#16A34A',
        am: '#EA580C',
        rd: '#DC2626',
        vl: '#2563EB',
        s1: '#F8F8F8',
        s2: '#EFEFEF',
        s3: '#E8E8E8',
        t0: '#1F1F1F',
        t1: '#505050',
        t2: '#808080',
        t3: '#A0A0A0',
        bd: '#D0D0D0',
        bd1: '#C0C0C0',
        glass1: 'rgba(248, 248, 248, 0.9)',
        glass2: 'rgba(239, 239, 239, 0.9)',
        glassBd: 'rgba(192, 192, 192, 0.4)',
        go: '#FFA500',
        ice: '#B3E5FC',
        bl: '#E3F2FD',
        nv: '#BBDEFB',
        gs: '#BDBDBD',
    },
    noir: {
        cy: '#00FF00',
        em: '#00CC00',
        am: '#FFAA00',
        rd: '#FF0000',
        vl: '#0099FF',
        s1: '#0A0A0A',
        s2: '#1A1A1A',
        s3: '#000000',
        t0: '#FFFFFF',
        t1: '#CCCCCC',
        t2: '#888888',
        t3: '#444444',
        bd: '#333333',
        bd1: '#444444',
        glass1: 'rgba(10, 10, 10, 0.95)',
        glass2: 'rgba(26, 26, 26, 0.95)',
        glassBd: 'rgba(51, 51, 51, 0.5)',
        go: '#FFFF00',
        ice: '#00FFFF',
        bl: '#000080',
        nv: '#000066',
        gs: '#333333',
    },
    cyber: {
        cy: '#00FF41',
        em: '#00FF00',
        am: '#FF006E',
        rd: '#FF0055',
        vl: '#00D9FF',
        s1: '#0D0221',
        s2: '#1A0033',
        s3: '#050012',
        t0: '#00FF41',
        t1: '#00CC33',
        t2: '#008800',
        t3: '#005500',
        bd: '#00FF41',
        bd1: '#00CC33',
        glass1: 'rgba(13, 2, 33, 0.9)',
        glass2: 'rgba(26, 0, 51, 0.9)',
        glassBd: 'rgba(0, 255, 65, 0.2)',
        go: '#FFD700',
        ice: '#00FFFF',
        bl: '#001A4D',
        nv: '#0033CC',
        gs: '#00AA00',
    },
    forest: {
        cy: '#7FFFD4',
        em: '#90EE90',
        am: '#FFD700',
        rd: '#FF6347',
        vl: '#87CEEB',
        s1: '#1B3A1B',
        s2: '#2D5A2D',
        s3: '#0F2410',
        t0: '#E8F5E9',
        t1: '#C8E6C9',
        t2: '#81C784',
        t3: '#558B2F',
        bd: '#558B2F',
        bd1: '#7CB342',
        glass1: 'rgba(27, 58, 27, 0.9)',
        glass2: 'rgba(45, 90, 45, 0.9)',
        glassBd: 'rgba(85, 139, 47, 0.3)',
        go: '#FFD700',
        ice: '#B2EBF2',
        bl: '#1B5E20',
        nv: '#2E7D32',
        gs: '#558B2F',
    },
    ocean: {
        cy: '#00BCD4',
        em: '#4DD0E1',
        am: '#FFCA28',
        rd: '#EF5350',
        vl: '#29B6F6',
        s1: '#01579B',
        s2: '#0277BD',
        s3: '#004C7A',
        t0: '#E1F5FE',
        t1: '#B3E5FC',
        t2: '#4FC3F7',
        t3: '#0288D1',
        bd: '#0288D1',
        bd1: '#039BE5',
        glass1: 'rgba(1, 87, 155, 0.9)',
        glass2: 'rgba(2, 119, 189, 0.9)',
        glassBd: 'rgba(2, 136, 209, 0.3)',
        go: '#FFEB3B',
        ice: '#E0F2F1',
        bl: '#005A87',
        nv: '#0277BD',
        gs: '#546E7A',
    },
}

/**
 * Apply theme to document root element
 * @param themeName - Name of the theme to apply
 */
export function applyTheme(themeName: ThemeName) {
    const theme = themes[themeName]
    if (!theme) {
        console.error(`Theme "${themeName}" not found`)
        return
    }

    const root = document.documentElement
    Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
    })

    // Store preference in localStorage
    localStorage.setItem('aegisshare-theme', themeName)
}

/**
 * Get current theme name
 */
export function getCurrentTheme(): ThemeName {
    return (localStorage.getItem('aegisshare-theme') as ThemeName) || 'dark'
}

/**
 * Initialize theme on app load
 */
export function initializeTheme() {
    const saved = getCurrentTheme()
    applyTheme(saved)
}

/**
 * Get list of available themes
 */
export function getAvailableThemes(): ThemeName[] {
    return Object.keys(themes) as ThemeName[]
}

/**
 * Get theme tokens
 */
export function getThemeTokens(themeName: ThemeName): ThemeTokens {
    return themes[themeName] || themes.dark
}

/**
 * Create CSS variable string for theme
 */
export function createThemeCSS(themeName: ThemeName): string {
    const theme = themes[themeName]
    if (!theme) return ''

    return `:root {\n${Object.entries(theme)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join('\n')}\n}`
}
