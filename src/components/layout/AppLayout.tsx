import { useState, useEffect, ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BottomNav from './BottomNav'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { lockScroll, unlockScroll } from '@/utils/scrollLock'

/**
 * AppLayout — Responsive master layout for authenticated views
 *
 * DESKTOP (lg+):
 *   ┌─────────────────────────────────────────┐
 *   │ TOPBAR (56px, full width, sticky)       │
 *   ├─────┬───────────────────────────────────┤
 *   │ SID │                                   │
 *   │ BAR │ MAIN CONTENT (scrollable)         │
 *   │ 230 │                                   │
 *   │ px  │                                   │
 *   └─────┴───────────────────────────────────┘
 *
 * TABLET (md - 1023px):
 *   ┌─────────────────────────────────────────┐
 *   │ TOPBAR (hamburger visible)              │
 *   ├──┬───────────────────────────────────────┤
 *   │SB│ MAIN CONTENT (full width)            │
 *   │60│                                      │
 *   │px│                                      │
 *   └──┴───────────────────────────────────────┘
 *   Sidebar collapses to icons only
 *
 * MOBILE (< 768px):
 *   ┌───────────────────────────────────────┐
 *   │ TOPBAR (hamburger, logo)              │
 *   ├───────────────────────────────────────┤
 *   │                                       │
 *   │ MAIN CONTENT (full width)             │
 *   │                                       │
 *   ├───────────────────────────────────────┤
 *   │ BOTTOM NAV (56px + safe area)         │
 *   └───────────────────────────────────────┘
 *   Sidebar: off-canvas drawer (slides from left)
 */

export default function AppLayout() {
    const { isMobile, isTablet, isDesktop } = useBreakpoint()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Auto-close drawer when route changes
    useEffect(() => {
        setSidebarOpen(false)
    }, [location.pathname])

    // Prevent body scroll when drawer open on mobile
    useEffect(() => {
        if (isMobile && sidebarOpen) {
            lockScroll('sidebar-drawer')
        } else {
            unlockScroll('sidebar-drawer')
        }
        return () => unlockScroll('sidebar-drawer')
    }, [isMobile, sidebarOpen])

    // Auto-collapse sidebar on tablet, auto-expand on larger screens
    useEffect(() => {
        if (isTablet) {
            setSidebarCollapsed(true)
        } else if (isDesktop) {
            setSidebarCollapsed(false)
        }
    }, [isTablet, isDesktop])

    return (
        <div
            className={`
        layout-root h-dvh flex flex-col bg-bg overflow-hidden
        ${isMobile ? 'flex-col' : 'flex-row'}
      `}
        >
            {/* TOPBAR — Fixed sticky header */}
            <Topbar
                onMenuClick={() => setSidebarOpen(true)}
                sidebarOpen={sidebarOpen}
            />

            {/* LAYOUT MAIN */}
            <div
                className={`
          layout-main flex flex-1 min-w-0 min-h-0 relative
          ${isMobile ? 'flex-col' : 'flex-row'}
          ${!isMobile ? 'ml-0 lg:ml-[250px]' : ''}
          ${!isMobile && sidebarCollapsed ? 'lg:ml-[56px]' : ''}
        `}
                style={!isMobile ? { marginLeft: sidebarCollapsed ? '56px' : '250px' } : {}}
            >
                {/* DESKTOP/TABLET SIDEBAR — Always visible (full or collapsed) */}
                {!isMobile && (
                    <Sidebar
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                )}

                {/* MOBILE SIDEBAR — Off-canvas drawer */}
                {isMobile && (
                    <AnimatePresence mode="wait">
                        {sidebarOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    className="fixed inset-0 bg-black/60 z-40"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setSidebarOpen(false)}
                                    aria-hidden="true"
                                />

                                {/* Drawer */}
                                <motion.div
                                    className="fixed left-0 top-0 bottom-0 w-72 z-50 overflow-hidden"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <Sidebar
                                        collapsed={false}
                                        onClose={() => setSidebarOpen(false)}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                )}

                {/* MAIN CONTENT AREA */}
                <main
                    id="main-content"
                    className={`
            flex-1 flex flex-col overflow-hidden
            ${isMobile ? 'min-h-0' : 'min-h-0 min-w-0'}
          `}
                >
                    {/* Content with scroll */}
                    <div
                        className={`
              flex-1 overflow-y-auto overscroll-contain
              ${isMobile ? 'pb-20' : 'pb-0'}
            `}
                        style={{ scrollbarGutter: 'stable' }}
                    >
                        {/* Gradient background overlay */}
                        <div className="fixed inset-0 -z-10 pointer-events-none">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cy/5 via-transparent to-transparent blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-em/5 via-transparent to-transparent blur-3xl" />
                        </div>

                        {/* Page content */}
                        <div
                            className={`
                px-2 py-2           /* xs mobile */
                sm:px-4 sm:py-4     /* sm tablet */
                md:px-5 md:py-5     /* md small desktop */
                lg:px-6 lg:py-6     /* lg desktop */
                xl:px-7 xl:py-7     /* xl large desktop */
                2xl:px-8 2xl:py-8   /* 2xl extra large */
                max-w-screen-4k mx-auto
                w-full
              `}
                        >
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>

            {/* MOBILE BOTTOM NAVIGATION */}
            {isMobile && <BottomNav />}

            {/* PORTAL ANCHORS */}
            <div id="modal-portal" className="z-modal" />
            <div id="toast-stack-portal" className="fixed top-4 right-4 z-notification space-y-2 pointer-events-none" />
            <div id="context-drawer-portal" className="z-fixed" />
        </div>
    )
}
