import { motion } from 'framer-motion'
import { VARIANTS } from '@/styles/motion'

export const SkeletonServiceCard = ({ animated = true }: { animated?: boolean }) => {
    const itemProps = animated ? { variants: VARIANTS.fadeUp } : {}

    return (
        <motion.div
            {...itemProps}
            style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--s1)',
                border: '1px solid var(--bd)',
            }}
        >
            {/* Service name */}
            <div className="skeleton" style={{ width: '70%', height: '16px', marginBottom: '12px' }} />

            {/* Status line */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div className="skeleton" style={{ width: '50px', height: '20px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '4px' }} />
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <div className="skeleton" style={{ width: '50px', height: '11px', marginBottom: '4px' }} />
                    <div className="skeleton" style={{ width: '80px', height: '14px' }} />
                </div>
                <div>
                    <div className="skeleton" style={{ width: '50px', height: '11px', marginBottom: '4px' }} />
                    <div className="skeleton" style={{ width: '80px', height: '14px' }} />
                </div>
            </div>
        </motion.div>
    )
}
