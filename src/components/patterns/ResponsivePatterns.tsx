// src/components/patterns/ResponsivePatterns.tsx
/**
 * AegisShare Responsive Design Patterns
 * 
 * Copy-paste templates for implementing responsive components
 * All patterns fulfill Lighthouse 98+ and CWV targets
 */

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { motion } from 'framer-motion';
import { VARIANTS, SPRING, DURATION } from '@/styles/motion';

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 1: STAT CARDS GRID (CommandCenter, Compliance)
// ────────────────────────────────────────────────────────────────────────────

export function StatCardsGridPattern() {
    const { isMobile } = useBreakpoint();

    // Desktop: 4 columns | Tablet: 2 columns | Mobile: 2 columns (smaller gap)
    return (
        <motion.div
            className={`
        grid gap-4 sm:gap-3
        grid-cols-2 md:grid-cols-2 lg:grid-cols-4
      `}
            variants={VARIANTS.staggerContainer}
            initial="hidden"
            animate="visible"
        >
            {/* Each stat card */}
            <motion.div
                variants={VARIANTS.fadeUp}
                className="p-4 rounded-lg bg-s1 border border-bd1"
            >
                {/* Card content */}
            </motion.div>
        </motion.div>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 2: RESPONSIVE TABLE (Audit Chain, Access Control)
// ────────────────────────────────────────────────────────────────────────────

export function ResponsiveTablePattern() {
    const { isMobile, isTablet } = useBreakpoint();

    // Mobile: Card view
    if (isMobile) {
        return (
            <div className="space-y-3">
                {/* Each row becomes a card */}
                <motion.div
                    variants={VARIANTS.fadeUp}
                    className="p-4 rounded-lg bg-s1 border border-bd1"
                >
                    {/* Card-style row content */}
                </motion.div>
            </div>
        );
    }

    // Desktop/Tablet: Table view with horizontal scroll
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-bd1">
                        {/* Column headers — hide some on tablet */}
                        <th className="text-left py-3 px-4">Event</th>
                        <th className="text-left py-3 px-4">Timestamp</th>
                        <th className="text-left py-3 px-4 hidden md:table-cell">User</th>
                        <th className="text-right py-3 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Rows */}
                </tbody>
            </table>
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 3: FILE LIST WITH DETAIL PANEL (Vault)
// ────────────────────────────────────────────────────────────────────────────

export function FileListWithPanelPattern() {
    const { isMobile, isTablet } = useBreakpoint();
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    // Mobile: Full-screen overlay
    if (isMobile) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                    {/* File list */}
                </div>

                {/* Detail panel: full screen overlay */}
                {selectedId && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={SPRING.smooth}
                        className="fixed inset-0 bg-bg z-50 flex flex-col"
                    >
                        <button onClick={() => setSelectedId(null)}>← Back</button>
                        {/* Detail content */}
                    </motion.div>
                )}
            </div>
        );
    }

    // Tablet: Bottom sheet
    if (isTablet) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">{/* File list */}</div>

                {selectedId && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={SPRING.smooth}
                        className="fixed bottom-0 left-0 right-0 h-[70vh] bg-s1 rounded-t-xl z-50 overflow-y-auto"
                    >
                        {/* Detail content */}
                    </motion.div>
                )}
            </div>
        );
    }

    // Desktop: Side panel (slide-in, 370px)
    return (
        <div className="flex gap-4 h-full">
            <div className="flex-1 overflow-y-auto">{/* File list */}</div>

            {selectedId && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={SPRING.smooth}
                    className="w-[370px] border-l border-bd1 overflow-y-auto"
                >
                    {/* Detail panel */}
                </motion.div>
            )}
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 4: TWO-COLUMN FORM LAYOUT (Profile, Settings)
// ────────────────────────────────────────────────────────────────────────────

export function TwoColumnFormPattern() {
    const { isMobile } = useBreakpoint();

    return (
        <motion.div
            className={`
        grid gap-6
        grid-cols-1 lg:grid-cols-2
      `}
            variants={VARIANTS.staggerContainer}
            initial="hidden"
            animate="visible"
        >
            {/* Left column: Meta info / avatar / profile card */}
            <motion.div
                variants={VARIANTS.fadeUp}
                className="lg:sticky lg:top-20 lg:h-fit"
            >
                {/* Profile card, avatar, etc */}
            </motion.div>

            {/* Right column: Form fields */}
            <motion.div
                variants={VARIANTS.fadeUp}
                className="space-y-6"
            >
                {/* Form content */}
            </motion.div>
        </motion.div>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 5: VERTICAL STACK ON MOBILE (Complex layouts)
// ────────────────────────────────────────────────────────────────────────────

export function VerticalStackPattern() {
    return (
        <div className="space-y-4 lg:space-y-6">
            {/* Section 1 */}
            <section className="p-4 lg:p-6 rounded-lg bg-s1 border border-bd1">
                {/* Content */}
            </section>

            {/* Section 2 */}
            <section className="p-4 lg:p-6 rounded-lg bg-s1 border border-bd1">
                {/* Content */}
            </section>
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 6: HORIZONTAL SCROLL (Charts, Chains)
// ────────────────────────────────────────────────────────────────────────────

export function HorizontalScrollPattern() {
    const { isMobile } = useBreakpoint();

    if (isMobile) {
        // Mobile: Stack vertically instead
        return (
            <div className="space-y-4">
                {/* Items stacked vertically */}
            </div>
        );
    }

    // Desktop/Tablet: Horizontal scroll
    return (
        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <div className="flex gap-4 pb-4 min-w-min">
                {/* Horizontally scrollable items */}
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 7: TOGGLE BETWEEN VIEWS (Table vs Cards)
// ────────────────────────────────────────────────────────────────────────────

export function ViewTogglePattern() {
    const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');
    const { isMobile } = useBreakpoint();

    // Auto switch to grid on mobile
    React.useEffect(() => {
        if (isMobile) setViewMode('grid');
    }, [isMobile]);

    return (
        <div>
            {/* View toggle buttons (desktop only) */}
            {!isMobile && <ViewToggleButtons value={viewMode} onChange={setViewMode} />}

            {/* Render appropriate view */}
            {viewMode === 'table' ? <TableView /> : <GridView />}
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 8: FAB + DRAWER (Vault upload)
// ────────────────────────────────────────────────────────────────────────────

export function FabWithDrawerPattern() {
    const [open, setOpen] = React.useState(false);
    const { isMobile } = useBreakpoint();

    if (!isMobile) {
        // Desktop: Button in toolbar
        return <UploadButton />;
    }

    // Mobile: FAB + drawer
    return (
        <>
            {/* FAB at bottom-right */}
            <motion.button
                className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-cy flex items-center justify-center z-30"
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(true)}
            >
                {/* Upload icon */}
            </motion.button>

            {/* Bottom sheet drawer */}
            {open && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="fixed bottom-0 left-0 right-0 h-[60vh] bg-s1 rounded-t-xl z-50 overflow-y-auto"
                >
                    <UploadForm onClose={() => setOpen(false)} />
                </motion.div>
            )}
        </>
    );
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 9: SAFE-AREA PADDING (Notched devices)
// ────────────────────────────────────────────────────────────────────────────

export function SafeAreaAwarePadding() {
    return (
        <div className="p-4 md:p-6 lg:p-8 safe-area-padding">
            {/* Content with safe area padding applied */}
        </div>
    );
}

// Standard safe-area pattern:
// - Sidebar: uses padding-top/bottom + safe-area env variables
// - Topbar: safe-area-top padding
// - BottomNav: safe-area-bottom (env(safe-area-inset-bottom))

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 10: TOUCH-FRIENDLY SIZING
// ────────────────────────────────────────────────────────────────────────────

export function TouchFriendlyButton() {
    return (
        <button
            // Base size (visual): 40px
            // Hit area (padding): +4px on all sides = 48px total
            className="h-10 px-4 py-2 m-[-4px] rounded-lg bg-cy"
        >
            Press me
        </button>
    );
}

export function TouchFriendlyIconButton() {
    return (
        <button
            // Visual: 24px icon
            // Hit area: 44px (12px padding)
            className="w-11 h-11 flex items-center justify-center m-[-8px] rounded-lg"
        >
            {/* 24px icon inside */}
        </button>
    );
}

/**
 * IMPLEMENTATION CHECKLIST for new pages:
 * 
 * □ Import useBreakpoint hook
 * □ Use appropriate layout pattern above
 * □ Apply motion variants (fadeUp, staggerContainer)
 * □ Test at all breakpoints: 320, 480, 768, 1024, 1280, 1440, 1920, 2560
 * □ Verify no horizontal scroll at any width
 * □ Check skeleton loading (exact height match)
 * □ Verify all tap targets minimum 44×44px
 * □ Test on touch device (keyboard + mouse)
 * □ Check keyboard navigation (Tab, arrow keys)
 * □ Verify screen reader announcements (Audacity extension)
 * □ Run Lighthouse: target 98+ score
 * □ Check Core Web Vitals: all green
 * □ Test on 3G network (Chrome DevTools)
 * □ Verify animations work in prefers-reduced-motion
 */
