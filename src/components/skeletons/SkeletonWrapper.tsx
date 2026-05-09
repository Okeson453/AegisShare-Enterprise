/**
 * SkeletonWrapper — Wrapper component for easy skeleton usage
 * Combines skeleton component selection with loading state management
 */

import React from 'react';
import { useSkeletonState } from '@/hooks/useSkeletonState';
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonList,
  SkeletonTable,
  SkeletonForm,
  SkeletonLine,
} from './Skeleton';

export type SkeletonVariant = 'skeleton' | 'text' | 'card' | 'avatar' | 'list' | 'table' | 'form' | 'line';

interface SkeletonWrapperProps {
  isLoading: boolean;
  variant?: SkeletonVariant;
  children?: React.ReactNode;
  minDuration?: number;
  [key: string]: any;
}

/**
 * Wrapper component that shows skeleton OR content based on loading state
 */
export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  isLoading,
  variant = 'skeleton',
  children,
  minDuration = 300,
  ...skeletonProps
}) => {
  const { isLoading: shouldShow } = useSkeletonState({ minDuration });

  if (!isLoading || !shouldShow) {
    return <>{children}</>;
  }

  const skeletonComponents = {
    skeleton: <Skeleton {...skeletonProps} />,
    text: <SkeletonText {...skeletonProps} />,
    card: <SkeletonCard {...skeletonProps} />,
    avatar: <SkeletonAvatar {...skeletonProps} />,
    list: <SkeletonList {...skeletonProps} />,
    table: <SkeletonTable {...skeletonProps} />,
    form: <SkeletonForm {...skeletonProps} />,
    line: <SkeletonLine {...skeletonProps} />,
  };

  return skeletonComponents[variant];
};

SkeletonWrapper.displayName = 'SkeletonWrapper';
