import { motion } from 'framer-motion'
import { VARIANTS } from '@/styles/motion'

export const SkeletonStatCard = ({ animated = true }: { animated?: boolean }) => {
    const itemProps = animated ? { variants: VARIANTS.fadeUp } : {}

    return (
        <motion.div
            {...itemProps}
            style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: 'var(--s1)',
                border: '1px solid var(--bd)',
            }}
        >
            {/* Icon */}
            <div
                className="skeleton"
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                }}
            />

            {/* Large number */}
            <div className="skeleton" style={{ width: '80%', height: '32px', marginBottom: '8px' }} />

            {/* Label */}
            <div className="skeleton" style={{ width: '70%', height: '14px', marginBottom: '12px' }} />

            {/* Sub-label */}
            <div className="skeleton" style={{ width: '55%', height: '12px', marginBottom: '12px' }} />

            {/* Delta chip */}
            <div className="skeleton" style={{ width: '120px', height: '18px', borderRadius: '4px' }} />
        </motion.div>
    )
}
