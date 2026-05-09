/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * Production domain allowlist and security settings
 */

export type CORSOrigin = {
  domain: string
  name: string
  environment: 'development' | 'staging' | 'production'
  methods: string[]
  allowedHeaders: string[]
  credentials: boolean
}

/**
 * Approved CORS Origins for AegisShare
 * Add new domains here when expanding to new environments
 */
export const APPROVED_CORS_ORIGINS: CORSOrigin[] = [
  // Production
  {
    domain: 'https://app.aegisshare.local',
    name: 'AegisShare Main Application',
    environment: 'production',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-API-Key',
    ],
    credentials: true,
  },

  {
    domain: 'https://admin.aegisshare.local',
    name: 'AegisShare Admin Console',
    environment: 'production',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-API-Key',
    ],
    credentials: true,
  },

  // Staging
  {
    domain: 'https://app-staging.aegisshare.local',
    name: 'AegisShare Staging App',
    environment: 'staging',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-API-Key',
    ],
    credentials: true,
  },

  {
    domain: 'https://admin-staging.aegisshare.local',
    name: 'AegisShare Staging Admin',
    environment: 'staging',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-API-Key',
    ],
    credentials: true,
  },

  // Development (localhost variations)
  {
    domain: 'http://localhost:3000',
    name: 'Local Development Port 3000',
    environment: 'development',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-API-Key',
    ],
    credentials: true,
  },

  {
    domain: 'http://localhost:5173',
    name: 'Vite Development Port 5173',
    environment: 'development',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-API-Key',
    ],
    credentials: true,
  },

  {
    domain: 'http://127.0.0.1:3000',
    name: 'Localhost IP Port 3000',
    environment: 'development',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-API-Key',
    ],
    credentials: true,
  },

  // Partner/Integration origins (if applicable)
  {
    domain: 'https://partners.aegisshare.local',
    name: 'Partner Portal',
    environment: 'production',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: false, // Partner integrations don't use cookies
  },
]

/**
 * Get CORS configuration for current environment
 */
export const getCORSConfig = (
  environment: 'development' | 'staging' | 'production'
) => {
  const origins = APPROVED_CORS_ORIGINS.filter((o) => o.environment === environment)

  return {
    origins,
    originUrls: origins.map((o) => o.domain),
  }
}

/**
 * Express.js CORS middleware configuration
 */
export const EXPRESS_CORS_CONFIG = {
  development: {
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'X-API-Key'],
    maxAge: 86400,
  },

  staging: {
    origin: ['https://app-staging.aegisshare.local', 'https://admin-staging.aegisshare.local'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'X-API-Key'],
    maxAge: 86400,
  },

  production: {
    origin: [
      'https://app.aegisshare.local',
      'https://admin.aegisshare.local',
      'https://partners.aegisshare.local',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'X-API-Key'],
    maxAge: 86400,
  },
}

/**
 * Express.js implementation
 */
export const EXAMPLE_EXPRESS_CORS = `
import cors from 'cors';
import { EXPRESS_CORS_CONFIG } from './cors-config';

const environment = process.env.NODE_ENV || 'development';
const corsOptions = EXPRESS_CORS_CONFIG[environment];

app.use(cors(corsOptions));

// Custom CORS error handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS policy violation',
      origin: req.headers.origin,
      requestedMethod: req.method,
    });
  } else {
    next(err);
  }
});
`

/**
 * Fastify implementation
 */
export const EXAMPLE_FASTIFY_CORS = `
import fastifyCors from '@fastify/cors';
import { EXPRESS_CORS_CONFIG } from './cors-config';

const environment = process.env.NODE_ENV || 'development';
const corsOptions = EXPRESS_CORS_CONFIG[environment];

await fastify.register(fastifyCors, corsOptions);
`

/**
 * Nginx implementation
 */
export const EXAMPLE_NGINX_CORS = `
server {
    listen 443 ssl http2;
    server_name api.aegisshare.local;

    # Handle preflight requests
    location = /api {
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' \$http_origin;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, X-API-Key';
            add_header 'Access-Control-Max-Age' '86400';
            return 204;
        }
    }

    location ~ ^/api {
        # Validate origin
        if (\$http_origin ~ ^https://(app|admin|partners)\\.aegisshare\\.local\$) {
            add_header 'Access-Control-Allow-Origin' \$http_origin;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, X-API-Key';
            add_header 'Access-Control-Allow-Credentials' 'true';
        }

        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
`

/**
 * Preflight request handler
 * For servers without built-in CORS support
 */
export const handleCORSPreflight = (
  origin: string,
  method: string,
  allowedOrigins: string[]
): Record<string, string> => {
  const headers: Record<string, string> = {}

  // Check if origin is allowed
  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, X-API-Key'
    headers['Access-Control-Max-Age'] = '86400'
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  return headers
}

/**
 * Add new CORS origin
 * Call this when adding new domain/subdomain
 */
export const addCORSOrigin = (origin: CORSOrigin): CORSOrigin[] => {
  // Check for duplicates
  const exists = APPROVED_CORS_ORIGINS.find((o) => o.domain === origin.domain)
  if (exists) {
    console.warn(`CORS origin already exists: ${origin.domain}`)
    return APPROVED_CORS_ORIGINS
  }

  APPROVED_CORS_ORIGINS.push(origin)
  console.log(`✅ Added CORS origin: ${origin.domain}`)
  return APPROVED_CORS_ORIGINS
}

/**
 * Remove CORS origin
 * Call this when decommissioning domain/subdomain
 */
export const removeCORSOrigin = (domain: string): CORSOrigin[] => {
  const index = APPROVED_CORS_ORIGINS.findIndex((o) => o.domain === domain)
  if (index === -1) {
    console.warn(`CORS origin not found: ${domain}`)
    return APPROVED_CORS_ORIGINS
  }

  APPROVED_CORS_ORIGINS.splice(index, 1)
  console.log(`✅ Removed CORS origin: ${domain}`)
  return APPROVED_CORS_ORIGINS
}

/**
 * Validate CORS request
 * Use this to manually validate origin if needed
 */
export const validateCORSRequest = (
  origin: string,
  method: string,
  environment: 'development' | 'staging' | 'production'
): { valid: boolean; reason?: string } => {
  const allowedOrigins = EXPRESS_CORS_CONFIG[environment].origin as string[]

  if (!origin || !allowedOrigins.includes(origin)) {
    return {
      valid: false,
      reason: `Origin ${origin} not allowed in ${environment} environment`,
    }
  }

  if (!EXPRESS_CORS_CONFIG[environment].methods.includes(method)) {
    return {
      valid: false,
      reason: `Method ${method} not allowed for ${origin}`,
    }
  }

  return { valid: true }
}
