/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * Strictest allowed CORS policy for security
 */

export interface CORSConfig {
  origin: string[]
  allowedMethods: string[]
  allowedHeaders: string[]
  credentials: boolean
  maxAge: number
}

/**
 * Production CORS configuration
 * Only allow requests from trusted origins
 */
export const CORS_CONFIG: CORSConfig = {
  // Production origins only - no localhost
  origin: ['https://app.aegisshare.local', 'https://admin.aegisshare.local'],

  // Only allow necessary HTTP methods
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allow only security-critical headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Accept',
  ],

  // Allow credentials (cookies, auth headers)
  credentials: true,

  // Cache preflight for 86400 seconds (24 hours)
  maxAge: 86400,
}

/**
 * Development CORS configuration (if needed)
 */
export const CORS_CONFIG_DEV: CORSConfig = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Accept',
  ],
  credentials: true,
  maxAge: 3600,
}

/**
 * Validate that a request origin is allowed
 */
export const isOriginAllowed = (origin: string, allowedOrigins: string[]): boolean => {
  return allowedOrigins.some((allowed) => {
    if (allowed === '*') return true
    if (allowed.startsWith('http://') || allowed.startsWith('https://')) {
      return origin === allowed
    }
    // Regex pattern support (e.g., "https://*.aegisshare.local")
    const pattern = allowed.replace(/\*/g, '.*')
    return new RegExp(`^${pattern}$`).test(origin)
  })
}
