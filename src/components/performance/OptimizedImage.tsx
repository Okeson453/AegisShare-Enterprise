/**
 * Optimized image loading with lazy loading and responsive sizing
 * Supports srcset and automatic WebP format selection
 */
export const OptimizedImage = ({
    src,
    alt,
    srcSet,
    sizes,
    width,
    height,
    isPriority = false,
    className = '',
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
    srcSet?: string
    sizes?: string
    isPriority?: boolean
}) => {
    return (
        <picture>
            {/* WebP format for modern browsers */}
            {srcSet && (
                <source
                    srcSet={srcSet.replace(/\.jpg|\.png/g, '.webp')}
                    type="image/webp"
                    sizes={sizes}
                />
            )}

            {/* Fallback to original format */}
            <img
                src={src}
                alt={alt}
                srcSet={srcSet}
                sizes={sizes}
                width={width}
                height={height}
                loading={isPriority ? 'eager' : 'lazy'}
                decoding={isPriority ? 'auto' : 'async'}
                className={className}
                {...props}
            />
        </picture>
    )
}
