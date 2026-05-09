import { motion } from 'framer-motion'
import { DURATION } from '@/styles/motion'
import { SkeletonFileRow } from '@/components/skeleton'

interface FetchingIndicatorProps {
    count?: number
    showMessage?: boolean
}

export const FetchingIndicator = ({ count = 3, showMessage = true }: FetchingIndicatorProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            style={{
                marginTop: '20px',
            }}
        >
            {/* Loading skeletons */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                {Array.from({ length: count }).map((_, i) => (
                    <SkeletonFileRow key={`loading-${i}`} animated={i === 0} />
                ))}
            </div>

            {/* Loading message */}
            {showMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: DURATION.fast }}
                    style={{
                        marginTop: '16px',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: 'var(--t2)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.5px',
                    }}
                >
                    Loading more records...
                </motion.div>
            )}
        </motion.div>
    )
}
