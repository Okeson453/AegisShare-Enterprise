/**
 * CX (Cross-Cutting) - Global UI/UX Enhancements for AegisShare Dashboard
 * 
 * This module exports all cross-cutting concerns:
 * - Shimmer loading states
 * - Toast notifications
 * - Keyboard navigation
 * - Modal glassmorphism
 */

// ===== Shimmer Loading States =====
export { Shimmer, ShimmerGroup } from './Shimmer'
export type { } from './Shimmer'

// ===== Toast Notifications =====
export { ToastProvider } from '../toast/ToastProvider'
export { useToast } from '../hooks/useToast'
export type { Toast, ToastVariant } from '@/store/toastStore'

// ===== Keyboard Navigation =====
export {
    useKeyboardShortcut,
    useKeyboardShortcuts,
    useArrowKeyNavigation,
    useEnterEscapeKeys,
    useSearchKeyNavigation,
    DASHBOARD_SHORTCUTS,
} from '../hooks/useKeyboardNavigation'
export type { KeyboardShortcut, KeyboardHandler } from '../hooks/useKeyboardNavigation'


export const CX_STYLES = [
    '@/styles/cx-shimmer.css',
    '@/styles/cx-toast.css',
    '@/styles/cx-modal-glassmorphism.css',
] as const

/**
 * CX Usage Examples:
 * 
 * 1. Shimmer Loading:
 *    import { Shimmer, ShimmerGroup } from '@/components/ui/CX'
 *    <Shimmer variant="card" />
 *    <ShimmerGroup variant="user-list" count={5} />
 * 
 * 2. Toast Notifications:
 *    import { useToast } from '@/components/ui/CX'
 *    const { addToast } = useToast()
 *    addToast({ message: 'Success!', type: 'success' })
 * 
 * 3. Keyboard Navigation:
 *    import { useKeyboardShortcut, DASHBOARD_SHORTCUTS } from '@/components/ui/CX'
 *    useKeyboardShortcut(DASHBOARD_SHORTCUTS.SAVE, () => handleSave())
 * 
 * 4. Modal Glassmorphism:
 *    <div className="cx-modal-overlay">
 *      <div className="cx-modal">
 *        <div className="cx-modal-header">
 *          <h2 className="cx-modal-title">Title</h2>
 *          <button className="cx-modal-close">×</button>
 *        </div>
 *        <div className="cx-modal-body">Content</div>
 *        <div className="cx-modal-footer">
 *          <button className="cx-modal-action-btn primary">OK</button>
 *        </div>
 *      </div>
 *    </div>
 */
