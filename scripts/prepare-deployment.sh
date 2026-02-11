#!/bin/bash
# =============================================================================
# HAIRVEN DEPLOYMENT PREPARATION SCRIPT
# =============================================================================
# This script prepares the application for production deployment
# Run this before deploying to ensure all configurations are correct
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Hairven by Elyn - Deployment Preparation           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo

ERRORS=0
WARNINGS=0

# -----------------------------------------------------------------------------
# Check Node.js version
# -----------------------------------------------------------------------------
echo -e "${BLUE}[CHECK]${NC} Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="20.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then 
    echo -e "${GREEN}  ✓${NC} Node.js $NODE_VERSION (>= $REQUIRED_VERSION)"
else
    echo -e "${RED}  ✗${NC} Node.js $NODE_VERSION (requires >= $REQUIRED_VERSION)"
    ((ERRORS++))
fi

# -----------------------------------------------------------------------------
# Check environment file
# -----------------------------------------------------------------------------
echo
echo -e "${BLUE}[CHECK]${NC} Environment configuration..."

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}  !${NC} .env file not found, copying from .env.production"
    cp .env.production .env
fi

# Required variables
declare -a REQUIRED_VARS=(
    "PUBLIC_SITE_URL"
    "ADMIN_EMAIL"
    "ADMIN_PASSWORD_HASH"
    "ADMIN_API_TOKEN"
)

for var in "${REQUIRED_VARS[@]}"; do
    value=$(grep "^${var}=" .env 2>/dev/null | cut -d'=' -f2- || echo "")
    if [ -z "$value" ]; then
        echo -e "${RED}  ✗${NC} $var is not set"
        ((ERRORS++))
    else
        echo -e "${GREEN}  ✓${NC} $var is set"
    fi
done

# -----------------------------------------------------------------------------
# Check database directory
# -----------------------------------------------------------------------------
echo
echo -e "${BLUE}[CHECK]${NC} Database directory..."

DB_PATH=$(grep "^DB_PATH=" .env 2>/dev/null | cut -d'=' -f2 || echo "/data/appointments.db")
DB_DIR=$(dirname "$DB_PATH")

if [ -d "$DB_DIR" ] || [ "$DB_DIR" = "/data" ]; then
    echo -e "${GREEN}  ✓${NC} Database directory configured ($DB_DIR)"
else
    echo -e "${YELLOW}  !${NC} Database directory will be created at runtime ($DB_DIR)"
    ((WARNINGS++))
fi

# -----------------------------------------------------------------------------
# Check SSL certificates for Caddy
# -----------------------------------------------------------------------------
echo
echo -e "${BLUE}[CHECK]${NC} SSL/Caddy configuration..."

if [ -f "Caddyfile" ]; then
    echo -e "${GREEN}  ✓${NC} Caddyfile exists"
    
    # Check if domain is configured
    if grep -q "sishairven.com" Caddyfile; then
        echo -e "${GREEN}  ✓${NC} Domain configured (sishairven.com)"
    else
        echo -e "${YELLOW}  !${NC} Domain not configured in Caddyfile"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}  !${NC} Caddyfile not found (optional, only needed for Caddy deployment)"
    ((WARNINGS++))
fi

# -----------------------------------------------------------------------------
# Check static assets
# -----------------------------------------------------------------------------
echo
echo -e "${BLUE}[CHECK]${NC} Static assets..."

if [ -d "static/bg" ]; then
    BG_COUNT=$(ls static/bg/*.webp 2>/dev/null | wc -l)
    if [ "$BG_COUNT" -ge 1 ]; then
        echo -e "${GREEN}  ✓${NC} Background images found ($BG_COUNT images)"
    else
        echo -e "${RED}  ✗${NC} No background images in static/bg/"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}  !${NC} Background images directory not found"
    ((WARNINGS++))
fi

if [ -f "static/hair.WEBP" ] && [ -f "static/nails.WEBP" ] && [ -f "static/skincare.WEBP" ]; then
    echo -e "${GREEN}  ✓${NC} Service images found"
else
    echo -e "${YELLOW}  !${NC} Some service images may be missing"
    ((WARNINGS++))
fi

# -----------------------------------------------------------------------------
# Check npm dependencies
# -----------------------------------------------------------------------------
echo
echo -e "${BLUE}[CHECK]${NC} NPM dependencies..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}  ✓${NC} node_modules exists"
else
    echo -e "${YELLOW}  !${NC} node_modules not found, running npm install..."
    npm ci
fi

# Check TypeScript compilation
echo
echo -e "${BLUE}[CHECK]${NC} TypeScript compilation..."
if npm run check > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓${NC} TypeScript check passed"
else
    echo -e "${RED}  ✗${NC} TypeScript check failed"
    ((ERRORS++))
fi

# -----------------------------------------------------------------------------
# Check for security vulnerabilities
# -----------------------------------------------------------------------------
echo
echo -e "${BLUE}[CHECK]${NC} Security audit..."
VULN_COUNT=$(npm audit --json 2>/dev/null | grep -o '"vulnerabilities":{[^}]*}' | grep -o '"[a-z]*":[0-9]*' | awk -F: '{sum+=$2} END {print sum}')

if [ -z "$VULN_COUNT" ] || [ "$VULN_COUNT" = "0" ]; then
    echo -e "${GREEN}  ✓${NC} No known vulnerabilities"
elif [ "$VULN_COUNT" -lt 5 ]; then
    echo -e "${YELLOW}  !${NC} $VULN_COUNT low-risk vulnerabilities found"
    ((WARNINGS++))
else
    echo -e "${YELLOW}  !${NC} $VULN_COUNT vulnerabilities found (run npm audit for details)"
    ((WARNINGS++))
fi

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   SUMMARY                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC} Ready for deployment."
    echo
    echo "Next steps:"
    echo "  1. Run: docker-compose up --build -d"
    echo "  2. Access: https://sishairven.com"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}! Deployment possible with warnings:${NC}"
    echo -e "   $WARNINGS warning(s) found"
    echo
    echo "Recommendations:"
    echo "  - Review warnings above"
    echo "  - Consider fixing before production"
    echo
    echo "To deploy anyway: docker-compose up --build -d"
    exit 0
else
    echo -e "${RED}✗ Deployment blocked:${NC}"
    echo -e "   $ERRORS error(s) found"
    echo -e "   $WARNINGS warning(s) found"
    echo
    echo "Please fix the errors above before deploying."
    exit 1
fi
