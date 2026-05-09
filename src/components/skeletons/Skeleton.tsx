// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { MOTION } from '@/styles/motion';

/**
 * Skeleton Loader Component
 * Animated placeholder for loading content with shimmer effect
 * WCAG: Uses role="status" aria-live="polite" for screen readers
 */

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    variant?: 'text' | 'circle' | 'rect' | 'button';
    className?: string;
    shimmer?: boolean;
    count?: number;
    spacing?: string;
    animated?: boolean;
    style?: React.CSSProperties;
}

export type { SkeletonProps };

/**
 * Base Skeleton component
 * Shows placeholder while content loads
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = '1rem',
    borderRadius = 'var(--radius-md)',
    variant = 'rect',
    className = '',
    shimmer = true,
    count = 1,
    spacing = 'var(--spacing-md)',
    animated = true,
}) => {
    // Variant sizes
    const variantStyles = {
        text: {
            height: '1rem',
            borderRadius: 'var(--radius-sm)',
            width: width || '100%',
        },
        circle: {
            width: width || '2rem',
            height: height || '2rem',
            borderRadius: '9999px',
        },
        rect: {
            width: width || '100%',
            height: height || '2rem',
            borderRadius: borderRadius,
        },
        button: {
            width: width || '80px',
            height: height || '2.5rem',
            borderRadius: 'var(--radius-md)',
        },
    };

    const style = variantStyles[variant];

    // Shimmer animation
    const animationStyle = shimmer
        ? {
            backgroundImage: `linear-gradient(
          90deg,
          var(--skeleton-base) 0%,
          var(--skeleton-shine) 50%,
          var(--skeleton-base) 100%
        )`,
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.8s infinite',
        }
        : {
            backgroundColor: 'var(--skeleton-base)',
        };

    const wrappedStyle = {
        ...style,
        ...animationStyle,
        display: 'block',
    };

    const skeletonElements = Array.from({ length: count }).map((_, i) => (
        <motion.div
            key={i}
            style={wrappedStyle}
            className={className}
            initial={animated ? { opacity: 0 } : {}}
            animate={animated ? { opacity: 1 } : {}}
            transition={{ duration: MOTION.DURATION.moderate / 1000 }}
            role="status"
            aria-live="polite"
            aria-label="Loading..."
        />
    ));

    if (count > 1) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
                {skeletonElements}
            </div>
        );
    }

    return skeletonElements[0];
};

Skeleton.displayName = 'Skeleton';

/**
 * Text Skeleton — Multiple lines of text
 */
interface SkeletonTextProps extends Omit<SkeletonProps, 'variant'> {
    lines?: number;
    lastLineWidth?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
    lines = 3,
    lastLineWidth = '70%',
    spacing = 'var(--spacing-sm)',
    ...props
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height="0.875rem"
                    width={i === lines - 1 ? lastLineWidth : '100%'}
                    variant="text"
                    {...props}
                />
            ))}
        </div>
    );
};

SkeletonText.displayName = 'SkeletonText';

/**
 * Card Skeleton — Full card with image, text, and button
 */
interface SkeletonCardProps extends Omit<SkeletonProps, 'variant' | 'width' | 'height'> {
    withImage?: boolean;
    withButton?: boolean;
    imageHeight?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
    withImage = true,
    withButton = true,
    imageHeight = '12rem',
    ...props
}) => {
    return (
        <motion.div
            style={{
                border: '1px solid var(--bd)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--s1)',
            }}
            initial="hidden"
            animate="visible"
            variants={MOTION.VARIANTS.fadeUp}
            transition={{ duration: MOTION.DURATION.moderate / 1000 }}
        >
            {withImage && (
                <Skeleton
                    height={imageHeight}
                    borderRadius="var(--radius-md)"
                    {...props}
                    style={{ marginBottom: 'var(--spacing-md)' }}
                />
            )}
            <SkeletonText lines={2} lastLineWidth="60%" {...props} />
            {withButton && (
                <Skeleton
                    variant="button"
                    height="2.5rem"
                    width="100%"
                    {...props}
                    style={{ marginTop: 'var(--spacing-lg)' }}
                />
            )}
        </motion.div>
    );
};

SkeletonCard.displayName = 'SkeletonCard';

/**
 * Avatar Skeleton — Circular placeholder
 */
export const SkeletonAvatar: React.FC<SkeletonProps> = (props) => (
    <Skeleton variant="circle" width="2.5rem" height="2.5rem" {...props} />
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

/**
 * List Skeleton — Multiple list items with avatar and text
 */
interface SkeletonListProps extends Omit<SkeletonProps, 'variant' | 'count'> {
    itemCount?: number;
    withAvatar?: boolean;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
    itemCount = 5,
    withAvatar = true,
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: MOTION.DURATION.moderate / 1000 }}
        >
            {Array.from({ length: itemCount }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        borderBottom: '1px solid var(--bd)',
                    }}
                >
                    {withAvatar && <SkeletonAvatar {...props} />}
                    <div style={{ flex: 1 }}>
                        <SkeletonText lines={1} {...props} />
                    </div>
                </div>
            ))}
        </motion.div>
    );
};

SkeletonList.displayName = 'SkeletonList';

/**
 * Table Skeleton — Loading state for table
 */
interface SkeletonTableProps extends Omit<SkeletonProps, 'variant'> {
    rows?: number;
    columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, columns = 4, ...props }) => {
    return (
        <motion.table
            style={{ width: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: MOTION.DURATION.moderate / 1000 }}
        >
            <thead>
                <tr>
                    {Array.from({ length: columns }).map((_, i) => (
                        <th
                            key={i}
                            style={{
                                padding: 'var(--spacing-md)',
                                textAlign: 'left',
                                borderBottom: '1px solid var(--bd)',
                            }}
                        >
                            <Skeleton height="0.875rem" width="100%" {...props} />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rows }).map((_, rowIdx) => (
                    <motion.tr
                        key={rowIdx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: MOTION.DURATION.moderate / 1000,
                            delay: rowIdx * (MOTION.STAGGER.normal / 1000),
                        }}
                    >
                        {Array.from({ length: columns }).map((_, colIdx) => (
                            <td
                                key={colIdx}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    borderBottom: '1px solid var(--bd)',
                                }}
                            >
                                <Skeleton height="0.875rem" width="100%" {...props} />
                            </td>
                        ))}
                    </motion.tr>
                ))}
            </tbody>
        </motion.table>
    );
};

SkeletonTable.displayName = 'SkeletonTable';

/**
 * Form Skeleton — Loading state for form inputs
 */
interface SkeletonFormProps extends Omit<SkeletonProps, 'variant'> {
    fieldCount?: number;
    withLabel?: boolean;
}

export const SkeletonForm: React.FC<SkeletonFormProps> = ({
    fieldCount = 3,
    withLabel = true,
    ...props
}) => {
    return (
        <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: MOTION.DURATION.moderate / 1000 }}
        >
            {Array.from({ length: fieldCount }).map((_, i) => (
                <div key={i}>
                    {withLabel && (
                        <Skeleton height="0.75rem" width="30%" {...props} style={{ marginBottom: 'var(--spacing-sm)' }} />
                    )}
                    <Skeleton variant="button" height="2.5rem" width="100%" {...props} />
                </div>
            ))}
        </motion.div>
    );
};

SkeletonForm.displayName = 'SkeletonForm';

/**
 * Line Skeleton — Simple horizontal line
 */
export const SkeletonLine: React.FC<SkeletonProps> = (props) => (
    <Skeleton height="var(--spacing-xs)" borderRadius="var(--radius-sm)" {...props} />
);

SkeletonLine.displayName = 'SkeletonLine';
