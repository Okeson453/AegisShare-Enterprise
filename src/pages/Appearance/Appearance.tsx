import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

type Theme = 'dark' | 'light' | 'system'

const colorSchemes = [
    { name: 'Cyan-Ember', primary: 'from-cy to-em', accent: 'cyan' },
    { name: 'Blue-Purple', primary: 'from-blue-500 to-purple-500', accent: 'blue' },
    { name: 'Green-Teal', primary: 'from-green-500 to-teal-500', accent: 'green' },
    { name: 'Orange-Red', primary: 'from-orange-500 to-red-500', accent: 'orange' },
    { name: 'Monochrome', primary: 'from-gray-400 to-gray-600', accent: 'gray' },
]

/**
 * Appearance Page — Theme and visual customization
 *
 * Features:
 * - Light/Dark/System theme selector
 * - Color scheme previewer
 * - Font selection
 * - Accent color customization
 * - Live preview
 * - Responsive layout adapts to mobile/tablet/desktop
 */
export default function Appearance() {
    const { isMobile, isTablet } = useBreakpoint()
    const [theme, setTheme] = useState<Theme>('dark')
    const [colorScheme, setColorScheme] = useState(0)
    const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal')

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-bold text-t0">Appearance</h1>
                <p className="text-sm text-t2">Customize how AegisShare looks and feels</p>
            </motion.div>

            {/* Theme Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-3"
            >
                <h2 className="text-lg font-bold text-t0">Theme</h2>
                <div
                    className={`
            grid gap-3
            ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}
          `}
                >
                    {(['dark', 'light', 'system'] as const).map((t) => (
                        <motion.button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`
                p-4 rounded-lg border-2 transition-colors
                ${theme === t ? 'border-cy bg-cy/10' : 'border-bd bg-s2 hover:border-bd2'}
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`text-2xl mb-2 ${t === 'dark' ? '🌙' : t === 'light' ? '☀️' : '🔄'}`} />
                            <p className="font-semibold text-t0 text-sm capitalize">{t}</p>
                            <p className="text-xs text-t2 mt-1">
                                {t === 'dark'
                                    ? 'Always dark'
                                    : t === 'light'
                                        ? 'Always light'
                                        : 'Follow system'}
                            </p>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Color Scheme Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="space-y-3"
            >
                <h2 className="text-lg font-bold text-t0">Color Scheme</h2>
                <div
                    className={`
            grid gap-3
            ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-5'}
          `}
                >
                    {colorSchemes.map((scheme, idx) => (
                        <motion.button
                            key={scheme.name}
                            onClick={() => setColorScheme(idx)}
                            className={`
                p-3 rounded-lg border-2 text-center transition-colors
                ${colorScheme === idx ? 'border-cy' : 'border-bd hover:border-bd2'}
              `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div
                                className={`
                  w-full h-8 rounded mb-2 bg-gradient-to-r ${scheme.primary}
                `}
                            />
                            <p className="font-semibold text-t0 text-xs">{scheme.name}</p>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Font Size Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-3"
            >
                <h2 className="text-lg font-bold text-t0">Font Size</h2>
                <div
                    className={`
            grid gap-3
            ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}
          `}
                >
                    {(['small', 'normal', 'large'] as const).map((size) => (
                        <motion.button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`
                p-4 rounded-lg border-2 text-center transition-colors
                ${fontSize === size ? 'border-cy bg-cy/10' : 'border-bd bg-s2 hover:border-bd2'}
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <p
                                className={`font-semibold text-t0 mb-2 ${size === 'small' ? 'text-sm' : size === 'normal' ? 'text-base' : 'text-lg'
                                    }`}
                            >
                                Preview text
                            </p>
                            <p className="text-xs text-t2 capitalize">{size}</p>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Accent Color */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="bg-s2 border border-bd rounded-lg p-6 space-y-4"
            >
                <h2 className="font-bold text-t0">Accent Color</h2>
                <p className="text-sm text-t2">
                    Current: <span className="text-cy font-semibold">Cyan</span> (default)
                </p>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-cy text-white text-sm font-semibold hover:bg-cy/90 transition-colors"
                >
                    Customize Accent Color
                </motion.button>
                <p className="text-xs text-t2">
                    💡 Changes will apply to buttons, links, active states, and badges throughout the application
                </p>
            </motion.div>

            {/* Font Family */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-s2 border border-bd rounded-lg p-6 space-y-4"
            >
                <h2 className="font-bold text-t0">Typography</h2>
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    <div>
                        <label className="text-xs text-t2 uppercase font-mono block mb-2">Body Font</label>
                        <select className="w-full px-3 py-2 bg-s1 border border-bd rounded text-t0 text-sm">
                            <option>Plus Jakarta Sans</option>
                            <option>Inter</option>
                            <option>Roboto</option>
                            <option>System Font</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-t2 uppercase font-mono block mb-2">Monospace Font</label>
                        <select className="w-full px-3 py-2 bg-s1 border border-bd rounded text-t0 text-sm">
                            <option>JetBrains Mono</option>
                            <option>Fira Code</option>
                            <option>IBM Plex Mono</option>
                            <option>Courier New</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Contrast & Accessibility */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="bg-s2 border border-bd rounded-lg p-6 space-y-4"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-t0">Reduce Motion</h3>
                        <p className="text-xs text-t2 mt-1">Minimize animations and transitions</p>
                    </div>
                    <motion.button
                        className="flex-shrink-0 w-12 h-6 rounded-full bg-bd relative"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute w-5 h-5 rounded-full bg-white left-1 top-0.5" />
                    </motion.button>
                </div>
            </motion.div>

            {/* Preview Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-bd/20 border border-bd2 rounded-lg p-4 text-sm text-t2"
            >
                <p className="font-mono">
                    ℹ️ Changes are saved automatically. Some themes may require a page refresh to fully apply.
                </p>
            </motion.div>
        </div>
    )
}
