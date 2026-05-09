/**
 * Content Security Policy (CSP) Headers
 * Define and validate CSP headers for the application
 */

export const CSP_HEADERS = {
  // Restrict all content to same origin by default
  'default-src': ["'self'"],

  // Scripts: Allow inline scripts with nonce, self, and trusted CDNs
  'script-src': [
    "'self'",
    "'nonce-NONCE_PLACEHOLDER'", // Replace with actual nonce value
    'https://cdn.jsdelivr.net', // For external libraries
  ],

  // Styles: Allow inline styles with nonce and self
  'style-src': ["'self'", "'nonce-NONCE_PLACEHOLDER'", 'https://fonts.googleapis.com'],

  // Fonts: Allow from Google Fonts
  'font-src': ["'self'", 'https://fonts.gstatic.com'],

  // Images: Allow from same origin and data URIs
  'img-src': ["'self'", 'data:', 'https:'],

  // Connections: Allow XHR/fetch to same origin and API endpoints
  'connect-src': ["'self'", 'https://api.aegisshare.local'],

  // Frames: Disallow embedding in frames
  'frame-ancestors': ["'none'"],

  // Form submissions: Only to same origin
  'form-action': ["'self'"],

  // Base URI: Restrict to same origin
  'base-uri': ["'self'"],

  // Prefetch/DNS prefetch: Only same origin
  'prefetch-src': ["'self'"],
}

/**
 * Generate CSP header string for server response
 * Server should replace NONCE_PLACEHOLDER with actual nonce value
 */
export const generateCSPHeader = (): string => {
  return Object.entries(CSP_HEADERS)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

/**
 * Validate that a resource URL complies with CSP
 */
export const isCSSCompliant = (url: string, directiveValues: string[]): boolean => {
  // This is a simplified check - real validation happens server-side
  if (directiveValues.includes("'self'") || directiveValues.includes("'none'")) {
    return new URL(url).origin === window.location.origin
  }
  return directiveValues.some((value) => url.startsWith(value))
}
