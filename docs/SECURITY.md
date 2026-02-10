# Security Checklist

Security measures implemented in the Hairven Salon website.

## Table of Contents

- [Security Headers](#security-headers)
- [Content Security Policy](#content-security-policy)
- [Rate Limiting](#rate-limiting)
- [Input Validation](#input-validation)
- [Authentication](#authentication)
- [HTTPS/TLS](#httpstls)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)

## Security Headers

All security headers are set in `src/hooks.server.ts`:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforce HTTPS |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `Permissions-Policy` | `camera=(), microphone=(), ...` | Restrict browser features |

### Verification

```bash
# Check security headers
curl -I https://sishairven.com | grep -i "strict-transport\|x-frame\|x-content\|x-xss\|referrer\|permissions"

# Full security scan
nmap --script http-security-headers -p 443 sishairven.com
```

## Content Security Policy

CSP is configured in `src/lib/security/headers.ts`:

```javascript
'default-src': ["'self'"],
'script-src': ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', ...],
'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
'img-src': ["'self'", 'data:', 'https://m.media-amazon.com', ...],
```

### CSP Nonce

Each request generates a unique nonce for inline scripts:

```typescript
const nonce = generateNonce();
response.headers.set('Content-Security-Policy', `script-src 'nonce-${nonce}' ...`);
```

### Testing CSP

```bash
# Check CSP header
curl -I https://sishairven.com | grep -i "content-security-policy"

# Report-only mode (for testing)
# Change 'Content-Security-Policy' to 'Content-Security-Policy-Report-Only' in hooks.server.ts
```

## Rate Limiting

Rate limiting is implemented in `src/lib/security/rate-limit.ts`:

### Default Limits

| Endpoint Type | Requests | Window | Burst |
|--------------|----------|--------|-------|
| Public API | 60 | 1 minute | 10 |
| Admin API | 10 | 1 minute | 2 |
| Forms (booking) | 5 | 5 minutes | 1 |

### Configuration

```bash
# Adjust rate limits in .env
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_BURST=10
```

### Testing

```bash
# Test rate limiting
for i in {1..70}; do curl -s -o /dev/null -w "%{http_code}\n" https://sishairven.com/api/book; done
```

## Input Validation

All user inputs are validated using `src/lib/security/validation.ts`:

### Validation Functions

- `validateEmail()` - RFC 5322 compliant email validation
- `validatePhone()` - International phone format
- `validateName()` - Name with injection protection
- `validateMessage()` - Text content with XSS prevention
- `validateASIN()` - Amazon product ID validation
- `validateURL()` - URL with protocol whitelist

### Sanitization

```typescript
// XSS prevention
export function sanitizeHTML(input: string): string {
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=/gi, '');
}
```

## Authentication

### Current State

The site uses a simple session system. Admin endpoints require authentication:

```typescript
// Check authentication in API routes
if (!locals.user?.isAdmin) {
    throw error(401, 'Authentication required');
}
```

### Future Improvements

- [ ] JWT-based authentication
- [ ] Multi-factor authentication
- [ ] Session management
- [ ] Password policies

## HTTPS/TLS

### Certificate Configuration

Caddy automatically manages Let's Encrypt certificates:

```
# Caddyfile
https://sishairven.com {
    header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
}
```

### HSTS Preload

To submit for HSTS preload:

1. Verify HTTPS is working correctly
2. Add `preload` directive to HSTS header
3. Submit at https://hstspreload.org/

### SSL Testing

```bash
# SSL Labs test
https://www.ssllabs.com/ssltest/analyze.html?d=sishairven.com

# Command line test
openssl s_client -connect sishairven.com:443 -servername sishairven.com
```

## Dependencies

### Security Auditing

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Check for updates
npm outdated
```

### Automated Scanning

GitHub Dependabot is configured to scan for vulnerabilities.

## Environment Variables

### Security Practices

1. **Never commit `.env`** - It's in `.gitignore`
2. **Use different values per environment**
3. **Rotate secrets regularly**
4. **Use strong secrets** - Generate with `openssl rand -hex 32`

### Sensitive Variables

| Variable | Sensitivity | Storage |
|----------|-------------|---------|
| `CLIKA_API_KEY` | High | Server only |
| `SENTRY_DSN` | Medium | Server only |
| `CSP_NONCE_SECRET` | High | Server only |
| `HEALTH_CHECK_TOKEN` | Medium | Server only |

### Environment Segregation

```
.env.development  # Local development
.env.staging      # Staging server
.env.production   # Production template (committed)
.env              # Production values (not committed)
```

## Security Checklist

### Pre-Deployment

- [ ] All environment variables set
- [ ] CSP configured and tested
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] Security headers verified
- [ ] HTTPS configured
- [ ] Dependencies audited
- [ ] Secrets are strong/random

### Post-Deployment

- [ ] SSL Labs A+ rating
- [ ] Security headers present
- [ ] CSP report-only mode tested
- [ ] Rate limiting working
- [ ] No mixed content warnings
- [ ] HSTS header present

### Regular Maintenance

- [ ] Weekly dependency audits
- [ ] Monthly secret rotation
- [ ] Quarterly penetration testing
- [ ] Annual security review

## Incident Response

### Security Incident Checklist

1. **Assess** - Determine scope and impact
2. **Contain** - Isolate affected systems
3. **Eradicate** - Remove threat
4. **Recover** - Restore normal operations
5. **Learn** - Document and improve

### Emergency Contacts

- Server provider: DigitalOcean
- DNS/SSL: Cloudflare
- Monitoring: Sentry (if configured)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
