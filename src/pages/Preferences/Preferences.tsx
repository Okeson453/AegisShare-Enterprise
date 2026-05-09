import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const preferenceGroups = [
    {
        title: 'Interface Preferences',
        items: [
            { id: 'compact-ui', label: 'Compact UI', description: 'Reduce spacing and font sizes', enabled: false },
            { id: 'animations', label: 'Animations', description: 'Spring and transition effects', enabled: true },
            { id: 'tooltips', label: 'Tooltips', description: 'Show helpful hints on hover', enabled: true },
            { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', description: 'Enable global keyboard shortcuts', enabled: true },
        ],
    },
    {
        title: 'Data & Privacy',
        items: [
            { id: 'analytics', label: 'Analytics', description: 'Send anonymous usage data to improve AegisShare', enabled: true },
            { id: 'crash-reports', label: 'Crash Reports', description: 'Automatically report errors', enabled: true },
            { id: 'search-indexing', label: 'Local Search Indexing', description: 'Index files locally for faster search', enabled: true },
            { id: 'auto-backup', label: 'Auto-Backup Settings', description: 'Backup user settings daily', enabled: false },
        ],
    },
    {
        title: 'Accessibility',
        items: [
            { id: 'high-contrast', label: 'High Contrast Mode', description: 'Enhanced readability', enabled: false },
            { id: 'reduced-motion', label: 'Reduce Motion', description: 'Minimize animations for visual comfort', enabled: false },
            { id: 'large-text', label: 'Large Text', description: 'Increase default font size globally', enabled: false },
            { id: 'screen-reader', label: 'Screen Reader Help', description: 'Enhance ARIA labels and descriptions', enabled: true },
        ],
    },
]

/**
 * Preferences Page — User preferences and feature toggles
 *
 * Layout: Grouped preference toggles
 * - Organized by category (Interface, Data, Accessibility)
 * - Descriptions for each setting
 * - Real-time toggle feedback
 */
export default function Preferences() {
    const { isMobile } = useBreakpoint()
    const [groups, setGroups] = useState(preferenceGroups)

    const togglePreference = (groupIdx: number, itemIdx: number) => {
        setGroups((prev) => {
            const newGroups = prev.map((group, gIdx) => {
                if (gIdx !== groupIdx) return group
                return {
                    ...group,
                    items: group.items.map((item, iIdx) => {
                        if (iIdx !== itemIdx) return item
                        return { ...item, enabled: !item.enabled }
                    }),
                }
            })
            return newGroups
        })
    }

    return (
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                >
                    <h1 className="text-3xl font-bold text-t0">Preferences</h1>
                    <p className="text-sm text-t2">Customize your AegisShare experience</p>
                </motion.div>

                {/* Preference Groups */}
                {groups.map((group, groupIdx) => (
                    <motion.div
                        key={group.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: groupIdx * 0.1 }}
                        className="space-y-3"
                    >
                        {/* Group Title */}
                        <h2 className="text-lg font-bold text-t0">{group.title}</h2>

                        {/* Items */}
                        <div className="space-y-2">
                            {group.items.map((item, itemIdx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: groupIdx * 0.1 + itemIdx * 0.03 }}
                                    className={`
                  bg-s2 border border-bd rounded-lg p-4
                  flex items-center justify-between
                  hover:border-bd2 transition-colors
                  ${isMobile ? 'flex-col items-start gap-3' : ''}
                `}
                                >
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-t0 text-sm">{item.label}</p>
                                        <p className="text-xs text-t2 mt-1">{item.description}</p>
                                    </div>

                                    {/* Toggle */}
                                    <motion.button
                                        onClick={() => togglePreference(groupIdx, itemIdx)}
                                        className={`
                    flex-shrink-0 w-12 h-6 rounded-full transition-colors relative
                    ${item.enabled ? 'bg-cy' : 'bg-bd'}
                  `}
                                        whileTap={{ scale: 0.95 }}
                                        role="switch"
                                        aria-checked={item.enabled}
                                        aria-label={`${item.label}: ${item.enabled ? 'enabled' : 'disabled'}`}
                                    >
                                        <motion.div
                                            className="absolute w-5 h-5 rounded-full bg-white"
                                            initial={false}
                                            animate={{
                                                left: item.enabled ? '6px' : '1px',
                                            }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            style={{ top: '2px' }}
                                        />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* Default Settings Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="bg-s2 border border-bd rounded-lg p-6 space-y-3"
                >
                    <h3 className="font-bold text-t0">Reset to Defaults</h3>
                    <p className="text-xs text-t2">
                        Restore all preferences to AegisShare defaults. This action cannot be undone.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 rounded-lg bg-em/20 text-em text-sm font-semibold hover:bg-em/30 transition-colors"
                    >
                        Reset Preferences
                    </motion.button>
                </motion.div>
            </div>
        )
    }

