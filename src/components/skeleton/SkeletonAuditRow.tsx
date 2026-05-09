import { motion } from 'framer-motion'
import { VARIANTS } from '@/styles/motion'

export const SkeletonAuditRow = ({ animated = true }: { animated?: boolean }) => {
    const itemProps = animated ? { variants: VARIANTS.fadeUp } : {}

    return (
        <motion.div
            {...itemProps}
            style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 150px 100px 80px',
                gap: '16px',
                padding: '12px 16px',
                alignItems: 'center',
            }}
        >
            {/* Event type badge */}
            <div
                className="skeleton"
                style={{
                    width: '80px',
                    height: '20px',
                    borderRadius: '4px',
                }}
            />

            {/* Action description */}
            <div>
                <div className="skeleton" style={{ width: '85%', height: '14px', marginBottom: '6px' }} />
                <div className="skeleton" style={{ width: '60%', height: '12px' }} />
            </div>

            {/* User */}
            <div className="skeleton" style={{ width: '100%', height: '14px' }} />

            {/* Timestamp */}
            <div className="skeleton" style={{ width: '95px', height: '14px' }} />

            {/* Status badge */}
            <div className="skeleton" style={{ width: '65px', height: '20px', borderRadius: '4px' }} />
        </motion.div>
    )
}
