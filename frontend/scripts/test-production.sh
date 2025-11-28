#!/bin/bash

# SAP Obake Production Build Test Script
# This script tests the production build locally before deployment

set -e

echo "🎃 SAP Obake Production Build Test"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo "ℹ $1"
}

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the frontend directory"
    exit 1
fi

# Step 1: Clean previous build
echo "Step 1: Cleaning previous build..."
if [ -d ".next" ]; then
    rm -rf .next
    print_success "Cleaned .next directory"
else
    print_info "No previous build found"
fi

# Step 2: Install dependencies
echo ""
echo "Step 2: Installing dependencies..."
pnpm install --frozen-lockfile
print_success "Dependencies installed"

# Step 3: Run linter
echo ""
echo "Step 3: Running linter..."
if pnpm lint; then
    print_success "Linting passed"
else
    print_error "Linting failed"
    exit 1
fi

# Step 4: Run tests
echo ""
echo "Step 4: Running tests..."
if pnpm test; then
    print_success "All tests passed"
else
    print_error "Tests failed"
    exit 1
fi

# Step 5: Build for production
echo ""
echo "Step 5: Building for production..."
if pnpm build; then
    print_success "Production build completed"
else
    print_error "Production build failed"
    exit 1
fi

# Step 6: Check build output
echo ""
echo "Step 6: Checking build output..."
if [ -d ".next" ]; then
    print_success ".next directory exists"
    
    # Check for static files
    if [ -d ".next/static" ]; then
        print_success "Static files generated"
    else
        print_warning "Static files directory not found"
    fi
    
    # Check for server files
    if [ -d ".next/server" ]; then
        print_success "Server files generated"
    else
        print_warning "Server files directory not found"
    fi
else
    print_error ".next directory not found"
    exit 1
fi

# Step 7: Check bundle size
echo ""
echo "Step 7: Checking bundle size..."
if [ -f ".next/build-manifest.json" ]; then
    print_success "Build manifest found"
    
    # Get the size of the main bundle
    BUNDLE_SIZE=$(du -sh .next/static | cut -f1)
    print_info "Static bundle size: $BUNDLE_SIZE"
    
    # Check if bundle analyzer is available
    if command -v npx &> /dev/null; then
        print_info "To analyze bundle size in detail, run: ANALYZE=true pnpm build"
    fi
else
    print_warning "Build manifest not found"
fi

# Step 8: Check environment variables
echo ""
echo "Step 8: Checking environment variables..."
if [ -f ".env.local" ]; then
    print_success ".env.local file exists"
else
    print_warning ".env.local file not found (using defaults)"
    print_info "Copy .env.example to .env.local if you need custom configuration"
fi

# Step 9: Check PWA files
echo ""
echo "Step 9: Checking PWA files..."
if [ -f "public/manifest.json" ]; then
    print_success "PWA manifest found"
else
    print_error "PWA manifest not found"
fi

if [ -d "public/icons" ]; then
    ICON_COUNT=$(ls -1 public/icons/*.png 2>/dev/null | wc -l)
    if [ "$ICON_COUNT" -gt 0 ]; then
        print_success "PWA icons found ($ICON_COUNT icons)"
    else
        print_warning "No PWA icons found in public/icons/"
        print_info "Generate icons using: https://www.pwabuilder.com/imageGenerator"
    fi
else
    print_warning "public/icons directory not found"
fi

# Step 10: Security check
echo ""
echo "Step 10: Running security audit..."
if pnpm audit --audit-level=high; then
    print_success "No high-severity vulnerabilities found"
else
    print_warning "Security vulnerabilities detected"
    print_info "Run 'pnpm audit' for details"
fi

# Summary
echo ""
echo "=================================="
echo "🎃 Production Build Test Complete"
echo "=================================="
echo ""
print_success "Build is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Start production server: pnpm start"
echo "2. Test in browser: http://localhost:3000"
echo "3. Run Lighthouse audit"
echo "4. Test on multiple browsers and devices"
echo "5. Deploy to your hosting platform"
echo ""
print_info "See DEPLOYMENT.md for detailed deployment instructions"
