/**
 * Server Configuration for Production Deployment
 * Express.js / Node.js middleware setup
 */

/**
 * Content Security Policy Headers Configuration
 * Add to your server's middleware
 */
export const CSP_MIDDLEWARE_CONFIG = {
  // Express example:
  // const csp = require('helmet').contentSecurityPolicy;
  // app.use(csp({
  //   directives: {
  //     defaultSrc: ["'self'"],
  //     scriptSrc: ["'self'", `'nonce-${generateNonce()}'`, "https://cdn.jsdelivr.net"],
  //     styleSrc: ["'self'", `'nonce-${generateNonce()}'`, "https://fonts.googleapis.com"],
  //     fontSrc: ["'self'", "https://fonts.gstatic.com"],
  //     imgSrc: ["'self'", "data:", "https:"],
  //     connectSrc: ["'self'", "https://api.aegisshare.local"],
  //     frameAncestors: ["'none'"],
  //     formAction: ["'self'"],
  //     baseUri: ["'self'"],
  //   },
  // }));

  // Alternative: Manual headers for other frameworks
  headers: {
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'nonce-NONCE_PLACEHOLDER' https://cdn.jsdelivr.net; style-src 'self' 'nonce-NONCE_PLACEHOLDER' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.aegisshare.local; frame-ancestors 'none'; form-action 'self'; base-uri 'self';",
  },
}

/**
 * CORS Configuration
 */
export const CORS_MIDDLEWARE_CONFIG = {
  // Express example:
  // const cors = require('cors');
  // app.use(cors({
  //   origin: ['https://app.aegisshare.local', 'https://admin.aegisshare.local'],
  //   credentials: true,
  //   optionsSuccessStatus: 200,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  //   maxAge: 86400,
  // }));

  headers: {
    'Access-Control-Allow-Origin': 'https://app.aegisshare.local',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
    'Access-Control-Max-Age': '86400',
  },
}

/**
 * Security Headers Configuration
 */
export const SECURITY_HEADERS_CONFIG = {
  headers: {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Enable XSS protection in older browsers
    'X-XSS-Protection': '1; mode=block',

    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',

    // HSTS - require HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Disable browser features
    'X-Permitted-Cross-Domain-Policies': 'none',
  },
}

/**
 * Performance Headers Configuration
 */
export const PERFORMANCE_HEADERS_CONFIG = {
  headers: {
    // Enable HTTP/2 Server Push
    'Link': '</banner.js>; rel=preload; as=script, </style.css>; rel=preload; as=style',

    // Enable compression
    'Content-Encoding': 'gzip',

    // Cache configuration
    'Cache-Control': 'public, max-age=31536000, immutable',

    // ETag for cache validation
    'ETag': 'W/"123456789"',
  },
}

/**
 * Complete Server Configuration
 * Pass to Express/Fastify/Node.js server middleware
 */
export const getServerConfig = (environment: 'development' | 'production') => {
  const isDev = environment === 'development'

  return {
    csp: isDev ? null : CSP_MIDDLEWARE_CONFIG,
    cors: CORS_MIDDLEWARE_CONFIG,
    security: SECURITY_HEADERS_CONFIG,
    performance: PERFORMANCE_HEADERS_CONFIG,
    // Add nonce generation for CSP
    generateNonce: () => {
      return Math.random().toString(36).substring(2, 15)
    },
  }
}

/**
 * Express.js Server Setup Example
 */
export const EXAMPLE_EXPRESS_SETUP = `
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { getServerConfig } from './deploymentConfig';

const app = express();
const env = process.env.NODE_ENV || 'development';
const config = getServerConfig(env as any);

// Middleware
app.use(compression());
app.use(helmet());
app.use(cors(config.cors));

// Custom CSP with nonce
app.use((req, res, next) => {
  const nonce = config.generateNonce();
  res.setHeader(
    'Content-Security-Policy',
    \`default-src 'self'; script-src 'self' 'nonce-\${nonce}' https://cdn.jsdelivr.net; ...\`
  );
  res.locals.nonce = nonce;
  next();
});

// Serve static files with cache headers
app.use(express.static('dist', {
  maxAge: env === 'production' ? '1y' : '0',
  etag: true,
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile('dist/index.html');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
`

/**
 * Nginx Configuration Example
 */
export const EXAMPLE_NGINX_CONFIG = `
server {
    listen 443 ssl http2;
    server_name app.aegisshare.local admin.aegisshare.local;

    # SSL
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # CSP Header
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-\$nonce' https://cdn.jsdelivr.net; style-src 'self' 'nonce-\$nonce' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.aegisshare.local; frame-ancestors 'none'; form-action 'self'; base-uri 'self';" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
    gzip_min_length 1000;

    # Cache for immutable assets
    location ~* \\\\.(?:js|css|woff2|ttf|otf|eot|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        root /var/www/html;
        try_files \$uri \$uri/ /index.html;
        expires -1;
    }

    # API proxy
    location /api {
        proxy_pass https://api.aegisshare.local;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name app.aegisshare.local admin.aegisshare.local;
    return 301 https://\$server_name\$request_uri;
}
`

/**
 * GitHub Actions CI/CD Configuration Example
 */
export const EXAMPLE_GH_ACTIONS_DEPLOY = `
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Build
      - name: Build app
        run: npm run build

      # Security checks
      - name: Run lighthouse
        run: npm run lighthouse

      - name: Check bundle size
        run: npm run bundle-analyze

      # Deploy
      - name: Deploy to production
        run: |
          npm run deploy:prod
          # Purge CDN cache
          curl -X POST https://cdn.example.com/purge \\
            -H "Authorization: Bearer \${{ secrets.CDN_TOKEN }}"
`
