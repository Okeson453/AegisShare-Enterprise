import { motion } from 'framer-motion'
import { VARIANTS, STAGGER } from '@/styles/motion'

export const SkeletonUserRow = ({ animated = true }: { animated?: boolean }) => {
    const containerProps = animated ? { variants: VARIANTS.staggerContainer, initial: 'hidden', animate: 'visible' } : {}
    const itemProps = animated ? { variants: VARIANTS.fadeUp } : {}

    return (
        <motion.div {...containerProps} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
            {/* Avatar */}
            <motion.div
                {...itemProps}
                className="skeleton"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                }}
            />

            {/* User info */}
            <motion.div {...itemProps} style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '75%', height: '14px', marginBottom: '6px' }} />
                <div className="skeleton" style={{ width: '60%', height: '12px' }} />
            </motion.div>

            {/* Role badge */}
            <motion.div
                {...itemProps}
                className="skeleton"
                style={{
                    width: '100px',
                    height: '24px',
                    borderRadius: '12px',
                }}
            />

            {/* Status */}
            <motion.div
                {...itemProps}
                className="skeleton"
                style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                }}
            />
        </motion.div>
    )
}
