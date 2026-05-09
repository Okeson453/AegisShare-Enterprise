/**
 * Subresource Integrity (SRI) Hash Configuration
 * For verifying CDN resource integrity in production
 */

/**
 * SRI Hash Generator
 * Run: openssl dgst -sha384 -binary file.js | openssl enc -base64 -A
 */
export type SRIResource = {
    url: string
    hash: string
    algorithm: 'sha256' | 'sha384' | 'sha512'
    integrity: string // format: "sha384-xxxxx"
    crossorigin?: 'anonymous' | 'use-credentials'
    fallback?: string // local fallback path
}

/**
 * CDN Resources with SRI Hashes
 * Update hashes on each production deployment
 */
export const CDN_RESOURCES: Record<string, SRIResource> = {
    // Font resources
    'roboto-400': {
        url: 'https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5Q6-VItzpDKPAMw.woff2',
        hash: 'sha384-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz+ABC=',
        algorithm: 'sha384',
        integrity: 'sha384-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz+ABC=',
        crossorigin: 'anonymous',
        fallback: '/fonts/roboto-400.woff2',
    },

    'roboto-500': {
        url: 'https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmEU9vBBc9AIU.woff2',
        hash: 'sha384-def456ghi789jkl012mno345pqr678stu901vwx234yz+ABC=def456=',
        algorithm: 'sha384',
        integrity: 'sha384-def456ghi789jkl012mno345pqr678stu901vwx234yz+ABC=def456=',
        crossorigin: 'anonymous',
        fallback: '/fonts/roboto-500.woff2',
    },

    'roboto-700': {
        url: 'https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmWUlfBBc9AIU.woff2',
        hash: 'sha384-ghi789jkl012mno345pqr678stu901vwx234yz+ABC=ghi789=ghi789=',
        algorithm: 'sha384',
        integrity: 'sha384-ghi789jkl012mno345pqr678stu901vwx234yz+ABC=ghi789=ghi789=',
        crossorigin: 'anonymous',
        fallback: '/fonts/roboto-700.woff2',
    },

    // Icon font for Material Icons (if using)
    'material-icons': {
        url: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        hash: 'sha384-jkl012mno345pqr678stu901vwx234yz+ABC=jkl012=jkl012=jkl012=',
        algorithm: 'sha384',
        integrity: 'sha384-jkl012mno345pqr678stu901vwx234yz+ABC=jkl012=jkl012=jkl012=',
        crossorigin: 'anonymous',
        fallback: '/fonts/material-icons.css',
    },

    // Third-party script examples
    'sentry-sdk': {
        url: 'https://browser.sentry-cdn.com/7.84.0/bundle.tracing.min.js',
        hash: 'sha384-mno345pqr678stu901vwx234yz+ABC=mno345=mno345=mno345=mno345=',
        algorithm: 'sha384',
        integrity: 'sha384-mno345pqr678stu901vwx234yz+ABC=mno345=mno345=mno345=mno345=',
        crossorigin: 'anonymous',
        fallback: '/lib/sentry-sdk.min.js',
    },

    'analytics': {
        url: 'https://analyticscdn.example.com/v1/analytics.js',
        hash: 'sha384-pqr678stu901vwx234yz+ABC=pqr678=pqr678=pqr678=pqr678=pqr678=',
        algorithm: 'sha384',
        integrity: 'sha384-pqr678stu901vwx234yz+ABC=pqr678=pqr678=pqr678=pqr678=pqr678=',
        crossorigin: 'anonymous',
        fallback: '/lib/analytics.js',
    },
}

/**
 * Generate SRI script tag for HTML
 */
export const generateSRITag = (
    resourceKey: keyof typeof CDN_RESOURCES,
    attributes?: Record<string, string>
): string => {
    const resource = CDN_RESOURCES[resourceKey]
    if (!resource) {
        console.warn(`SRI resource not found: ${resourceKey}`)
        return ''
    }

    const attrs = [
        `src="${resource.url}"`,
        `integrity="${resource.integrity}"`,
        resource.crossorigin ? `crossorigin="${resource.crossorigin}"` : '',
        'defer',
        ...Object.entries(attributes || {}).map(([k, v]) => `${k}="${v}"`),
    ]
        .filter(Boolean)
        .join(' ')

    return `<script ${attrs}></script>`
}

/**
 * Generate SRI link tag for stylesheets
 */
export const generateSRILinkTag = (
    resourceKey: keyof typeof CDN_RESOURCES,
    attributes?: Record<string, string>
): string => {
    const resource = CDN_RESOURCES[resourceKey]
    if (!resource) {
        console.warn(`SRI resource not found: ${resourceKey}`)
        return ''
    }

    const attrs = [
        `href="${resource.url}"`,
        'rel="stylesheet"',
        `integrity="${resource.integrity}"`,
        resource.crossorigin ? `crossorigin="${resource.crossorigin}"` : '',
        ...Object.entries(attributes || {}).map(([k, v]) => `${k}="${v}"`),
    ]
        .filter(Boolean)
        .join(' ')

    return `<link ${attrs} />`
}

/**
 * Validate SRI hash after resource update
 * Usage: node scripts/validate-sri.js
 * Note: This function requires Node.js crypto module (server-side only)
 */
export const validateSRIHash = async (url: string, expectedHash: string): Promise<boolean> => {
    try {
        // Skip validation in browser environment
        if (typeof window !== 'undefined' && typeof (globalThis as any).require === 'undefined') {
            console.warn('⚠️ SRI validation requires Node.js environment')
            return false
        }

        const response = await fetch(url)
        const buffer = await response.arrayBuffer()

        // Type assertion for Node.js crypto
        const crypto = (globalThis as any).require?.('crypto')
        if (!crypto) {
            console.error('❌ Crypto module not available')
            return false
        }

        const hash = crypto
            .createHash('sha384')
            .update((globalThis as any).Buffer?.from(buffer) || new Uint8Array(buffer))
            .digest('base64')

        const actual = `sha384-${hash}`
        const expected = expectedHash

        if (actual !== expected) {
            console.error(`❌ SRI mismatch for ${url}`)
            console.error(`   Expected: ${expected}`)
            console.error(`   Actual:   ${actual}`)
            return false
        }

        console.log(`✅ SRI verified for ${url}`)
        return true
    } catch (error) {
        console.error(`❌ Failed to validate SRI for ${url}:`, error)
        return false
    }
}

/**
 * Update all SRI hashes from live CDN
 * Usage: npm run update-sri-hashes (Node.js script only)
 * Note: This function requires Node.js crypto module (server-side only)
 */
export const updateAllSRIHashes = async (): Promise<Record<string, string>> => {
    const results: Record<string, string> = {}

    // Skip in browser environment
    if (typeof window !== 'undefined') {
        console.warn('⚠️ SRI hash updates require Node.js environment')
        return results
    }

    for (const [key, resource] of Object.entries(CDN_RESOURCES)) {
        try {
            const response = await fetch(resource.url)
            const buffer = await response.arrayBuffer()

            // Type assertion for Node.js
            const crypto = (globalThis as any).require?.('crypto')
            if (!crypto) {
                console.error(`❌ Crypto module not available for ${key}`)
                continue
            }

            const hash = crypto
                .createHash('sha384')
                .update((globalThis as any).Buffer?.from(buffer) || new Uint8Array(buffer))
                .digest('base64')

            results[key] = `sha384-${hash}`
            console.log(`✅ Updated SRI hash for ${key}`)
        } catch (error) {
            console.error(`❌ Failed to update SRI hash for ${key}:`, error)
        }
    }

    return results
}

/**
 * HTML template with SRI resources
 */
export const generateHTMLWithSRI = (env: string = 'production'): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AegisShare Admin</title>

    <!-- Roboto Font with SRI -->
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
        integrity="sha384-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz+ABC="
        crossorigin="anonymous"
    />

    <!-- Material Icons with SRI -->
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        integrity="sha384-jkl012mno345pqr678stu901vwx234yz+ABC=jkl012=jkl012=jkl012="
        crossorigin="anonymous"
    />

    <!-- App styles (built, no SRI needed for app.css is generated) -->
    <link rel="stylesheet" href="/app.css" />
</head>
<body>
    <div id="root"></div>

    <!-- Sentry for error tracking with SRI -->
    <script
        src="https://browser.sentry-cdn.com/7.84.0/bundle.tracing.min.js"
        integrity="sha384-mno345pqr678stu901vwx234yz+ABC=mno345=mno345=mno345=mno345="
        crossorigin="anonymous"
        defer
    ></script>

    <!-- Initialize Sentry -->
    <script>
        if (window.Sentry) {
            Sentry.init({
                dsn: 'https://xxx@xxx.ingest.sentry.io/xxx',
                tracesSampleRate: 0.1,
                environment: '${env}',
            })
        }
    </script>

    <!-- App bundle (generated by Vite, no SRI) -->
    <script type="module" src="/app.js" defer></script>
</body>
</html>
`
}

/**
 * SRI Hash Update Schedule
 * - Automatically validate all hashes weekly
 * - Update on dependency updates
 * - Test in staging before production deployment
 */
export const SRI_UPDATE_SCHEDULE = {
    validation: 'weekly',
    onDependencyUpdate: true,
    stagingTest: true,
    productionDeployment: true,
}

/**
 * Fallback strategy for SRI failures
 * If CDN is unavailable, load from local fallback
 */
export const SRI_FALLBACK_STRATEGY = `
// In index.html before loading scripts
<script>
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('cdn')) {
      console.warn('CDN resource failed to load, using fallback...');

      // Create fallback link/script
      const fallback = document.createElement('script');
      const resourceMap = {
        'https://cdn.example.com/lib.js': '/fallback/lib.js',
        'https://fonts.googleapis.com/...': '/fallback/fonts.css',
      };

      const fallbackUrl = resourceMap[event.filename];
      if (fallbackUrl) {
        fallback.src = fallbackUrl;
        document.head.appendChild(fallback);
      }
    }
  }, true);
</script>
`
