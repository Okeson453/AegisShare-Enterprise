import { motion } from 'framer-motion'
import { VARIANTS } from '@/styles/motion'

export const SkeletonDetailPanel = ({ animated = true }: { animated?: boolean }) => {
    const containerProps = animated ? { variants: VARIANTS.staggerContainer, initial: 'hidden', animate: 'visible' } : {}
    const itemProps = animated ? { variants: VARIANTS.fadeUp } : {}

    return (
        <motion.div {...containerProps} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
            {/* Header */}
            <motion.div {...itemProps}>
                <div className="skeleton" style={{ width: '45%', height: '20px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '85%', height: '14px' }} />
            </motion.div>

            {/* Section 1 */}
            <motion.div {...itemProps}>
                <div className="skeleton" style={{ width: '30%', height: '16px', marginBottom: '12px' }} />
                <div className="skeleton" style={{ width: '100%', height: '12px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '95%', height: '12px' }} />
            </motion.div>

            {/* Section 2 */}
            <motion.div {...itemProps}>
                <div className="skeleton" style={{ width: '25%', height: '16px', marginBottom: '12px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="skeleton" style={{ width: '100%', height: '12px' }} />
                    <div className="skeleton" style={{ width: '100%', height: '12px' }} />
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div {...itemProps} style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <div className="skeleton" style={{ flex: 1, height: '32px', borderRadius: '6px' }} />
                <div className="skeleton" style={{ flex: 1, height: '32px', borderRadius: '6px' }} />
            </motion.div>
        </motion.div>
    )
}
