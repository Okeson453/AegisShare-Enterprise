# 🚀 AegisShare Frontend - Production Deployment Guide

Complete guide for deploying AegisShare to production with enterprise-grade security, performance optimization, and monitoring.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Configuration Files](#configuration-files)
4. [Security Configuration](#security-configuration)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring & Logging](#monitoring--logging)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Deployment](#deployment)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js 20+ installed
- AWS Account with appropriate permissions
- Git and GitHub access
- Sentry project for error tracking
- Docker (for containerized deployment)

### 5-Minute Setup
```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Run local preview
npm run preview

# 4. Run tests
npm test
npm run test:e2e

# 5. Check bundle size
npm run bundle-analyze
```

---

## Infrastructure Setup

### AWS Resources Required

#### 1. **CloudFront CDN**
```bash
# Distribution settings:
- Origin: S3 bucket or ALB
- OAI: Enabled for S3 security
- Cache behaviors:
  - Static assets (/*): 1 year cache
  - HTML (index.html): Max 1 hour cache
  - API (/api/*): No cache, pass through
- Compression: Enabled for text/html, css, js, json
- HTTPS: Redirect HTTP to HTTPS
- HTTP/2: Enabled
- HTTP/3: Enabled (QUIC)
```

#### 2. **S3 Bucket (Frontend Hosting)**
```bash
# Bucket configuration:
- Static website hosting enabled
- Index document: index.html
- Error document: index.html (for SPA routing)
- Block public access: Enabled
- Versioning: Enabled
- Server-side encryption: AES-256
- Access logs: Enabled to another bucket
```

#### 3. **Application Load Balancer (ALB)**
```bash
# If using ALB instead of S3:
- HTTPS listener on port 443
- Security group: Only allow CloudFront IPs + admin IPs
- Health check: /health endpoint
- Target groups:
  - Main app (port 80)
  - Admin app (port 80)
- Sticky sessions: Enabled for 1 day
```

#### 4. **Auto Scaling Group**
```bash
# ASG configuration:
- Min instances: 2
- Max instances: 10
- Desired: 3
- Health check: ELB (300 second grace period)
- Termination policies: OldestInstance
- Update policy: Replace oldest
```

#### 5. **Secrets Manager**
Store sensitive data:
```json
{
  "REACT_APP_SENTRY_DSN": "https://xxx@xxx.ingest.sentry.io/xxx",
  "REACT_APP_API_URL": "https://api.aegisshare.local",
  "JWT_SECRET": "..." ,
  "API_KEYS": { "external-service": "..." },
  "COLORS_API_KEY": "..."
}
```

---

## Configuration Files

### 1. **Deployment Configuration** (`config/deployment.config.ts`)
Contains all server configuration for:
- **CSP Headers**: Content Security Policy with nonce support
- **CORS**: Cross-Origin Resource Sharing allowlist
- **Security Headers**: HSTS, X-Frame-Options, etc.
- **Performance Headers**: Cache control and compression

**Usage:**
```typescript
import { getServerConfig } from '@/config/deployment.config'

const config = getServerConfig('production')
// Apply config.csp.headers, config.cors, config.security, etc.
```

### 2. **SRI Configuration** (`config/sri-config.ts`)
Subresource Integrity hashes for CDN resources:
- Font resources (Google Fonts)
- Third-party libraries (Sentry SDK, analytics)
- External stylesheets

**Usage:**
```typescript
import { generateSRITag, CDN_RESOURCES } from '@/config/sri-config'

// In HTML template:
{generateSRITag('roboto-400')} // includes integrity hash
```

### 3. **CORS Configuration** (`config/cors-config.ts`)
Domain allowlist and request validation:
- Production domains (app.aegisshare.local, admin.aegisshare.local)
- Staging domains (app-staging, admin-staging)
- Development (localhost variations)
- Partner integration domains

**Usage:**
```typescript
import { EXPRESS_CORS_CONFIG } from '@/config/cors-config'

app.use(cors(EXPRESS_CORS_CONFIG.production))
```

### 4. **Monitoring Configuration** (`config/monitoring.config.ts`)
Performance monitoring and error tracking:
- Web Vitals tracking (LCP, INP, CLS, FCP, TTFB)
- Sentry integration for error reporting
- Custom event tracking
- Analytics backend submission

**Usage:**
```typescript
import { initializeWebVitalsTracking } from '@/config/monitoring.config'

React.useEffect(() => {
  initializeWebVitalsTracking()
}, [])
```

---

## Security Configuration

### 1. Content Security Policy (CSP)

**Why it matters:** Prevents XSS attacks by restricting resource loading.

**Production CSP Header:**
```
Content-Security-Policy: default-src 'self'; 
script-src 'self' 'nonce-UNIQUE_NONCE' https://cdn.jsdelivr.net;
style-src 'self' 'nonce-UNIQUE_NONCE' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.aegisshare.local;
frame-ancestors 'none';
form-action 'self';
base-uri 'self';
```

**Setup:**
```typescript
// server.ts
const nonce = generateSecureNonce()
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}' ...; ...`
  )
  res.locals.nonce = nonce
  next()
})
```

### 2. Subresource Integrity (SRI)

**Why it matters:** Verifies CDN resources haven't been compromised.

**Generated tags:**
```html
<link
  href="https://fonts.googleapis.com/css2?family=Roboto"
  rel="stylesheet"
  integrity="sha384-abcdef123456..." 
  crossorigin="anonymous"
/>
```

**Update SRI hashes:**
```bash
npm run update-sri-hashes
# This validates all CDN resources and updates hashes
```

### 3. CORS Configuration

**Allowed origins (production):**
- `https://app.aegisshare.local`
- `https://admin.aegisshare.local`

**Expose headers:**
- `Content-Type`
- `Authorization`
- `X-Requested-With`
- `X-CSRF-Token`

**Setup:**
```typescript
// server.ts
import { EXPRESS_CORS_CONFIG } from '@/config/cors-config'

app.use(cors(EXPRESS_CORS_CONFIG.production))
```

### 4. Security Headers

**All configured headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Performance Optimization

### 1. **Bundle Size Optimization**
Target: < 150KB (main.js, gzipped)

```bash
# Analyze bundle
npm run bundle-analyze

# Check size
npm run build -- --debug   # See detailed breakdown
```

### 2. **Caching Strategy**

**Static assets (JS, CSS, fonts, images):**
```
Cache-Control: public, max-age=31536000, immutable
```

**HTML files:**
```
Cache-Control: public, max-age=3600, must-revalidate
```

**API responses:**
```
Cache-Control: no-cache, no-store, must-revalidate
```

### 3. **CDN Configuration**

**CloudFront settings:**
```
- Compression: Enabled
- HTTP/2 enabled
- HTTP/3 (QUIC) enabled
- Query string forwarding: None (for better caching)
- Origin Shield: Enabled (reduces origin load)
- Cache period: 1 year for immutable assets
```

### 4. **Image Optimization**

Use optimized formats:
```typescript
import { usePictureElement } from '@/hooks/useOptimizedImages'

// Automatically uses webp with jpg fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

### 5. **Font Optimization**

```css
/* font-display: swap for optimal text rendering */
@font-face {
  font-family: 'Roboto';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
  font-weight: 400;
  font-style: normal;
}
```

---

## Monitoring & Logging

### 1. **Web Vitals Tracking**

Real User Monitoring (RUM) of Core Web Vitals:

```typescript
import { trackWebVitals } from '@/config/monitoring.config'

trackWebVitals(({ name, value, rating }) => {
  // Send to Sentry
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(`${name}: ${value}ms (${rating})`)
  }
})
```

**Target thresholds:**
| Metric | Good | Moderate | Poor |
|--------|------|----------|------|
| LCP | ≤2.5s | ≤4s | >4s |
| INP | ≤200ms | ≤500ms | >500ms |
| CLS | ≤0.1 | ≤0.25 | >0.25 |
| FCP | ≤1.8s | ≤3s | >3s |
| TTFB | ≤800ms | ≤1.8s | >1.8s |

### 2. **Error Tracking with Sentry**

**Setup:**
```typescript
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

export default Sentry.withProfiler(App)
```

**Error Boundary:**
```typescript
<Sentry.ErrorBoundary>
  <App />
</Sentry.ErrorBoundary>
```

### 3. **CloudWatch Logs**

Configure logging:
```typescript
// Log to CloudWatch
const cloudWatchLogger = new CloudWatchTransport({
  logGroupName: '/aws/lambda/aegisshare-frontend',
  logStreamName: `${environment}-${new Date().toISOString()}`,
})
```

### 4. **Dashboard & Alerts**

**CloudWatch dashboard metrics:**
- Error rate (target: < 0.1%)
- API response times (p95: < 200ms)
- Web Vitals (LCP, INP, CLS)
- CDN cache hit ratio (target: > 95%)
- Origin response times

**PagerDuty alerts:**
```yaml
- Error rate > 1%: Page on-call engineer
- LCP > 5s: Critical alert
- Database connection > 90%: Warning
- 500 errors spike: Critical alert
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/deploy-production.yml`

**Pipeline stages:**
1. **Build & Test** (Ubuntu latest)
   - `npm ci` - Clean install
   - `npm run test -- --coverage` - Unit tests
   - `npm run build` - Production build
   - Upload coverage to Codecov

2. **Lighthouse Check** (PR only)
   - Start dev server
   - Run Lighthouse audit
   - Comment results on PR
   - Fail if Performance < 90

3. **Code Quality**
   - ESLint check
   - TypeScript type check
   - Bundle size analysis

4. **Security Scan**
   - Snyk security check
   - OWASP dependency check
   - License compliance

5. **E2E Tests**
   - Playwright tests
   - Critical user flows
   - Desktop + mobile viewports

6. **Deploy to Staging** (develop branch only)
   - Build production bundle
   - Upload to staging S3
   - Invalidate CloudFront cache
   - Run smoke tests
   - Notify Slack

7. **Deploy to Production** (main branch only)
   - Same as staging + additional validation
   - Health checks
   - Error rate monitoring
   - Deployment annotation to monitoring
   - Success/failure notifications

### Manual Deployment (if needed)

```bash
# Staging
npm run deploy:staging

# Production
npm run deploy:prod
```

---

## Deployment

### 1. **Pre-Deployment Checklist**

```bash
# Run all validations
npm run pre-deploy

# This includes:
# - TypeScript compilation
# - All tests passing
# - Bundle size check
# - Security audit
# - Build verification
```

### 2. **Automatic Deployment (Recommended)**

```bash
# Commits to main branch trigger production deployment
git commit -m "feat: new feature"
git push origin main

# GitHub Actions automatically:
# 1. Runs all tests
# 2. Builds optimized bundle
# 3. Deploys to production
# 4. Invalidates cache
# 5. Monitors error rate
# 6. Sends Slack notification
```

### 3. **Manual Deployment**

```bash
# If GitHub Actions is unavailable:

# 1. Build
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://aegisshare-frontend-prod \
  --cache-control "public, max-age=3600" \
  --region us-east-1

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E123456ABCD \
  --paths "/*"

# 4. Verify deployment
npm run health-check
```

### 4. **Rollback Procedure**

```bash
# Quick rollback to previous version:

# 1. Get previous version
aws s3api list-object-versions \
  --bucket aegisshare-frontend-prod \
  --max-items 5

# 2. Restore previous version
aws s3 sync \
  s3://aegisshare-frontend-prod-backups/v1.2.3/ \
  s3://aegisshare-frontend-prod \
  --delete

# 3. Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id E123456ABCD \
  --paths "/*"

# 4. Verify
npm run health-check
```

---

## Post-Deployment

### 1. **Immediate Validation (First 30 minutes)**

```typescript
// Automated smoke tests
npm run test:smoke

// Manual checklist:
□ Homepage loads
□ Login works
□ Vault accessible
□ Search functional
□ Admin console works
□ Keyboard shortcuts active
□ No console errors
```

### 2. **Performance Validation**

Check Web Vitals dashboard:
- LCP under 2.5 seconds
- INP under 200ms
- CLS under 0.1
- Error rate normal

### 3. **Extended Monitoring (First 24 hours)**

- Monitor error rate trending
- Check for memory leaks
- Verify API response times
- Monitor database query performance
- Check CDN cache effectiveness

### 4. **Standard Operating Procedures**

**Daily:**
- Check error dashboard
- Review Web Vitals metrics
- Monitor CPU/memory usage
- Verify backups completed

**Weekly:**
- Generate performance report
- Review error trends
- Audit access logs
- Update SRI hashes if dependencies changed

**Monthly:**
- Full security audit
- Performance optimization review
- Capacity planning
- Update dependencies (with testing)

---

## Troubleshooting

### High Error Rate

```bash
# 1. Check error details in Sentry
# 2. Review recent deployments
git log --oneline -10

# 3. Check server logs
aws logs tail /aws/lambda/aegisshare-frontend --follow

# 4. If recent deployment:
npm run deploy:rollback
```

### Slow Performance

```bash
# 1. Check Web Vitals
open https://monitoring.internal/grafana

# 2. Check CDN cache
# CloudFront console → Cache Statistics

# 3. Check origin server
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name TargetResponseTime \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T01:00:00Z \
  --period 300 \
  --statistics Average
```

### CORS Errors

```typescript
// Check CORS config
import { validateCORSRequest } from '@/config/cors-config'

const valid = validateCORSRequest(
  window.location.origin,
  'POST',
  'production'
)

if (!valid) {
  console.error('CORS issue:', valid.reason)
}
```

### CSP Violations

```typescript
// Monitor CSP violations in console:
// Security & Privacy → Issues → Content Security Policy

// Add to CSP if needed (with security review):
// 1. Check source in error message
// 2. Add to appropriate directive in config/deployment.config.ts
// 3. Re-deploy
// 4. Clear browser cache
```

---

## Support & Resources

- **Sentry**: https://sentry.io/organizations/aegisshare
- **CloudWatch**: https://console.aws.amazon.com/cloudwatch
- **GitHub Actions**: https://github.com/aegisshare/frontend/actions
- **Status Page**: https://status.aegisshare.local
- **On-call**: PagerDuty integration

---

**Last Updated:** January 2024
**Maintained by:** Engineering Team
**Version:** 1.0.0
