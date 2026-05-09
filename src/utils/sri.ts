/**
 * Subresource Integrity (SRI) for external resources
 * Ensures CDN resources haven't been tampered with
 */

interface SRIResource {
    url: string
    integrity: string
    crossOrigin: 'anonymous' | 'use-credentials'
}

/**
 * SRI hashes for common external libraries
 * Update hashes when upgrading dependencies
 * Generate hashes at: https://www.srihash.org/
 */
export const SRI_RESOURCES: Record<string, SRIResource> = {
    // Example: Tailwind CSS via CDN
    'tailwind-css': {
        url: 'https://cdn.tailwindcss.com',
        integrity:
            'sha384-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        crossOrigin: 'anonymous',
    },

    // Example: Font Awesome
    'font-awesome': {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        integrity:
            'sha384-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        crossOrigin: 'anonymous',
    },
}

/**
 * Inject SRI-protected script tag
 */
export const loadExternalScript = (resourceKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const resource = SRI_RESOURCES[resourceKey]
        if (!resource) {
            reject(new Error(`Resource "${resourceKey}" not found in SRI registry`))
            return
        }

        const script = document.createElement('script')
        script.src = resource.url
        script.integrity = resource.integrity
        script.crossOrigin = resource.crossOrigin

        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load ${resourceKey} from ${resource.url}`))

        document.head.appendChild(script)
    })
}

/**
 * Inject SRI-protected stylesheet
 */
export const loadExternalStylesheet = (resourceKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const resource = SRI_RESOURCES[resourceKey]
        if (!resource) {
            reject(new Error(`Resource "${resourceKey}" not found in SRI registry`))
            return
        }

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = resource.url
        link.integrity = resource.integrity
        link.crossOrigin = resource.crossOrigin

        link.onload = () => resolve()
        link.onerror = () => reject(new Error(`Failed to load ${resourceKey} from ${resource.url}`))

        document.head.appendChild(link)
    })
}
