import { useState, ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION } from '@/styles/motion'

interface NavItem {
    path: string | null
    icon: string
    label: string
    badge?: number
    isMore?: boolean
}

const NAV_ITEMS: NavItem[] = [
    { path: '/overview', icon: '◉', label: 'Overview' },
    { path: '/vault', icon: '🔒', label: 'Vault' },
    { path: '/compliance', icon: '✓', label: 'Compliance' },
    { path: '/audit', icon: '⚠', label: 'Audit' },
    { path: null, icon: '⋯', label: 'More', isMore: true },
]

// Secondary items shown in "More" bottom sheet
const SECONDARY_ITEMS: NavItem[] = [
    { path: '/policy', icon: '📋', label: 'Policy' },
    { path: '/threat', icon: '🛡', label: 'Threats' },
    { path: '/keys', icon: '🔑', label: 'Keys' },
    { path: '/access', icon: '👤', label: 'Access' },
    { path: '/settings', icon: '⚙', label: 'Settings' },
]

/**
 * BottomNav — Mobile bottom navigation (5 main tabs + More menu)
 *
 * Layout (56px):
 *   ┌───────────────────────────────────────────┐
 *   │ [Overview] [Vault] [Compliance] [More →] │
 *   │    ↓        ↓      ↓                      │
 *   │  Tabs with cyan active + scale animation │
 *   └───────────────────────────────────────────┘
 *   Height: 56px + env(safe-area-inset-bottom)
 *   Background: blur + semi-transparent overlay
 *   Icons: 22px, labels: 10px JetBrains Mono
 *
 * "More" opens bottom sheet with secondary navigation
 */

export default function BottomNav() {
    const location = useLocation()
    const navigate = useNavigate()
    const [moreOpen, setMoreOpen] = useState(false)

    return (
        <>
            {/* Bottom Navigation Bar */}
            <nav
                className={`
          fixed bottom-0 left-0 right-0 z-40
          border-t border-bd
          bg-gradient-to-t from-s1/80 via-s1/70 to-s1/60
          backdrop-blur-sm
          safe-area-padding-bottom
        `}
                style={{
                    paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
                }}
            >
                {/* Nav Items Container */}
                <div className="flex items-center justify-around h-14">
                    {NAV_ITEMS.map((item) => (
                        <NavButton
                            key={item.label}
                            item={item}
                            isActive={item.path ? location.pathname.startsWith(item.path) : false}
                            onClick={() => {
                                if (item.isMore) {
                                    setMoreOpen(true)
                                } else if (item.path) {
                                    navigate(item.path)
                                }
                            }}
                        />
                    ))}
                </div>
            </nav>

            {/* More Menu — Bottom Sheet */}
            <AnimatePresence mode="wait">
                {moreOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-45 bg-black/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMoreOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 z-50 bg-s1 rounded-t-2xl border-t border-bd overflow-hidden"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                        >
                            {/* Handle bar */}
                            <div className="flex justify-center pt-3 pb-2">
                                <div className="w-12 h-1 rounded-full bg-bd2" />
                            </div>

                            {/* Sheet Header */}
                            <h2 className="px-4 py-3 text-sm font-semibold text-t0 border-b border-bd">
                                More Navigation
                            </h2>

                            {/* Secondary Items Grid */}
                            <div className="grid grid-cols-2 gap-2 p-4">
                                {SECONDARY_ITEMS.map((item) => (
                                    <motion.button
                                        key={item.label}
                                        onClick={() => {
                                            if (item.path) {
                                                navigate(item.path)
                                                setMoreOpen(false)
                                            }
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                      flex flex-col items-center gap-2 p-4 rounded-lg
                      transition-colors duration-200
                      ${item.path &&
                                                location.pathname.startsWith(item.path)
                                                ? 'bg-cy/20 text-cy'
                                                : 'bg-s2 text-t1 hover:bg-s3'
                                            }
                    `}
                                    >
                                        <span className="text-lg leading-none">{item.icon}</span>
                                        <span className="text-xs text-center font-mono">
                                            {item.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Close button */}
                            <div className="flex justify-center pb-6 pt-2">
                                <motion.button
                                    onClick={() => setMoreOpen(false)}
                                    className="px-6 py-2 rounded-lg bg-s2 text-t1 text-sm"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

/**
 * NavButton — Individual bottom nav item
 */
interface NavButtonProps {
    item: NavItem
    isActive: boolean
    onClick: () => void
}

function NavButton({ item, isActive, onClick }: NavButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`
        flex flex-col items-center gap-1 px-3 py-2 relative
        transition-colors duration-200
        ${isActive ? 'text-cy' : 'text-t2 hover:text-t1'}
      `}
            whileTap={{
                scale: 0.9,
            }}
            whileHover={{
                scale: isActive ? 1.05 : 1.02,
            }}
        >
            {/* Active indicator glow */}
            {isActive && (
                <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-lg bg-cy/10"
                    initial={false}
                    transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                    }}
                />
            )}

            {/* Icon */}
            <div className="relative z-10 text-base leading-none">{item.icon}</div>
            {/* Label */}
            <span className="text-9px font-mono text-center leading-tight relative z-10">
                {item.label}
            </span>

            {/* Badge (if any) */}
            {item.badge && item.badge > 0 && (
                <motion.span
                    className="absolute top-0 right-0 w-4 h-4 rounded-full bg-em text-white text-9px flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                    }}
                >
                    {item.badge < 10 ? item.badge : '9+'}
                </motion.span>
            )}
        </motion.button>
    )
}
