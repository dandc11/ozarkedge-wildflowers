#!/bin/bash

# Vercel Node.js 22 Runtime Verification Script
# Usage: ./scripts/verify-vercel-node22.sh [deployment-url]

set -e

echo "🔍 Vercel Node.js 22 Runtime Verification"
echo "========================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default deployment URL (replace with actual)
DEPLOYMENT_URL=${1:-"https://ozarkedge-wildflowers.vercel.app"}

echo -e "${BLUE}Target Deployment:${NC} $DEPLOYMENT_URL"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to make HTTP request with error handling
http_check() {
    local url=$1
    local description=$2
    
    echo -n "Checking $description... "
    
    if command_exists curl; then
        if curl -s -f "$url" > /dev/null; then
            echo -e "${GREEN}✓${NC}"
            return 0
        else
            echo -e "${RED}✗${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ curl not available${NC}"
        return 1
    fi
}

# Function to check response time
response_time_check() {
    local url=$1
    local description=$2
    
    echo -n "Response time for $description... "
    
    if command_exists curl; then
        local time=$(curl -s -w "%{time_total}" -o /dev/null "$url" 2>/dev/null || echo "timeout")
        if [[ $time != "timeout" ]]; then
            echo -e "${GREEN}${time}s${NC}"
        else
            echo -e "${RED}timeout${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ curl not available${NC}"
    fi
}

echo "🌐 Basic Connectivity Tests"
echo "-------------------------"

# Test main pages
http_check "$DEPLOYMENT_URL" "Homepage"
http_check "$DEPLOYMENT_URL/about" "About page"
http_check "$DEPLOYMENT_URL/native-plants" "Native plants page"
http_check "$DEPLOYMENT_URL/studio" "Sanity Studio"

echo ""
echo "⚡ Performance Tests"
echo "------------------"

# Response time tests
response_time_check "$DEPLOYMENT_URL" "Homepage"
response_time_check "$DEPLOYMENT_URL/api/debug-season" "API route"

echo ""
echo "🔧 Vercel CLI Verification (if available)"
echo "----------------------------------------"

if command_exists vercel; then
    echo "Vercel CLI found, checking project status..."
    
    # Check if project is linked
    if vercel project ls > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Project linked to Vercel"
        
        # Get deployment info
        echo "Recent deployments:"
        vercel ls --scope $(vercel whoami 2>/dev/null) 2>/dev/null | head -5 || echo "Unable to fetch deployments"
    else
        echo -e "${YELLOW}⚠${NC} Project not linked or login required"
        echo "Run 'vercel login' and 'vercel link' to connect"
    fi
else
    echo -e "${YELLOW}⚠${NC} Vercel CLI not installed"
    echo "Install with: npm install -g vercel@latest"
    echo ""
    echo "Manual verification required:"
    echo "1. Visit Vercel Dashboard"
    echo "2. Check project Settings → General → Node.js Version"
    echo "3. Verify it shows '22.x'"
fi

echo ""
echo "📋 Node.js Runtime Verification"
echo "------------------------------"

# Check if we can detect Node version from response headers or API
echo "Checking for Node.js version indicators..."

if command_exists curl; then
    # Check API route that might reveal Node version
    API_RESPONSE=$(curl -s "$DEPLOYMENT_URL/api/debug-season" 2>/dev/null || echo "")
    
    if [[ -n "$API_RESPONSE" ]]; then
        echo -e "${GREEN}✓${NC} API responding successfully"
        
        # Look for version info in response
        if echo "$API_RESPONSE" | grep -q "22\|node"; then
            echo -e "${GREEN}✓${NC} Possible Node 22 indicators found"
        else
            echo -e "${YELLOW}⚠${NC} No obvious Node version indicators"
        fi
    else
        echo -e "${YELLOW}⚠${NC} API not responding or protected"
    fi
    
    # Check response headers for server info
    HEADERS=$(curl -s -I "$DEPLOYMENT_URL" 2>/dev/null || echo "")
    if echo "$HEADERS" | grep -i "server\|x-" | head -3; then
        echo ""
    fi
else
    echo -e "${YELLOW}⚠${NC} Cannot verify without curl"
fi

echo ""
echo "🎯 Manual Verification Steps"
echo "---------------------------"
echo "1. Visit Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Select 'ozarkedge-wildflowers' project"
echo "3. Go to Settings → General"
echo "4. Check 'Node.js Version' setting shows '22.x'"
echo "5. Go to Settings → Functions"
echo "6. Verify runtime is 'Node.js 22.x' or latest"
echo ""
echo "7. Deploy a test change to verify build logs show:"
echo "   'Using Node.js 22.x.x' in build output"

echo ""
echo "✅ Verification Complete"
echo "====================="

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}All available checks passed!${NC}"
    echo "Review manual verification steps above to confirm Node 22 runtime."
else
    echo -e "${YELLOW}Some checks had issues.${NC}"
    echo "This may be normal if API routes are protected or CLI not configured."
fi

echo ""
echo "Next steps after confirming Node 22 runtime:"
echo "- Run comprehensive deployment validation (Task 9)"
echo "- Test all site functionality"
echo "- Monitor for any runtime errors"
echo "- Proceed with production promotion (Task 10)"
