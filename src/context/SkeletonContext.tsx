import React from 'react';

/**
 * SkeletonProvider — Global skeleton configuration and theming
 * Allows customization of skeleton appearance across the entire app
 */

interface SkeletonContextType {
    minLoadingDuration: number;
    shimmerEnabled: boolean;
    animatedEnabled: boolean;
    customColors?: {
        base?: string;
        shine?: string;
    };
}

const SkeletonContext = React.createContext<SkeletonContextType>({
    minLoadingDuration: 300,
    shimmerEnabled: true,
    animatedEnabled: true,
});

interface SkeletonProviderProps {
    children: React.ReactNode;
    minLoadingDuration?: number;
    shimmerEnabled?: boolean;
    animatedEnabled?: boolean;
    customColors?: {
        base?: string;
        shine?: string;
    };
}

/**
 * Provider component for global skeleton configuration
 */
export const SkeletonProvider: React.FC<SkeletonProviderProps> = ({
    children,
    minLoadingDuration = 300,
    shimmerEnabled = true,
    animatedEnabled = true,
    customColors,
}) => {
    const value: SkeletonContextType = {
        minLoadingDuration,
        shimmerEnabled,
        animatedEnabled,
        customColors,
    };

    // Apply custom skeleton colors to CSS variables if provided
    React.useEffect(() => {
        if (customColors) {
            if (customColors.base) {
                document.documentElement.style.setProperty('--skeleton-base', customColors.base);
            }
            if (customColors.shine) {
                document.documentElement.style.setProperty('--skeleton-shine', customColors.shine);
            }
        }
    }, [customColors]);

    return (
        <SkeletonContext.Provider value={value}>
            {children}
        </SkeletonContext.Provider>
    );
};

SkeletonProvider.displayName = 'SkeletonProvider';

/**
 * Hook to access skeleton context configuration
 */
export function useSkeletonConfig(): SkeletonContextType {
    const context = React.useContext(SkeletonContext);

    if (!context) {
        return {
            minLoadingDuration: 300,
            shimmerEnabled: true,
            animatedEnabled: true,
        };
    }

    return context;
}

/**
 * Higher-order component to inject skeleton config
 */
export function withSkeletonConfig<P extends object>(
    Component: React.ComponentType<P & SkeletonContextType>
): React.FC<P> {
    const WrappedComponent: React.FC<P> = (props) => {
        const config = useSkeletonConfig();
        return <Component {...props} {...config} />;
    };

    WrappedComponent.displayName = `withSkeletonConfig(${Component.displayName || Component.name})`;

    return WrappedComponent;
}
