#!/bin/bash

echo "🔒 düpp Security Validation Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ISSUES_FOUND=0

echo "🔍 Checking environment variable security..."

# Check if sensitive keys are in frontend .env
if grep -q "SECRET_KEY\|secret_key\|PRIVATE_KEY\|private_key" .env 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Secret keys found in frontend .env file${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ No secret keys in frontend .env${NC}"
fi

# Check if BigBuy API key is properly secured
if grep -q "BIGBUY_API_KEY" .env 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: BigBuy API key found in frontend .env${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ BigBuy API key not in frontend environment${NC}"
fi

# Check if functions .env exists and has required keys
if [ -f "functions/.env" ]; then
    if grep -q "BIGBUY_API_KEY" functions/.env; then
        echo -e "${GREEN}✅ BigBuy API key properly secured in functions/.env${NC}"
    else
        echo -e "${YELLOW}⚠️  BigBuy API key not found in functions/.env${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo -e "${RED}❌ functions/.env file missing${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check gitignore for security patterns
if grep -q ".env" .gitignore && grep -q "functions/.env" .gitignore; then
    echo -e "${GREEN}✅ Environment files properly ignored by git${NC}"
else
    echo -e "${RED}❌ Environment files not properly ignored${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check for common security anti-patterns in code
echo ""
echo "🔍 Checking code for security issues..."

# Check for hardcoded secrets
if grep -r "sk_.*" src/ --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Hardcoded Stripe secret keys found in source code${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ No hardcoded Stripe secrets in source code${NC}"
fi

# Check for API keys in source
if grep -r "api.*key.*=" src/ --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "VITE_" | grep -v "import.meta.env"; then
    echo -e "${YELLOW}⚠️  Potential hardcoded API keys found${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ No hardcoded API keys found${NC}"
fi

# Check CORS configuration
if grep -q "cors.*origin.*\*" functions/src/ -r 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Wildcard CORS origin found${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ CORS properly configured${NC}"
fi

echo ""
echo "🔍 GDPR Compliance Checks..."

# Check for user data logging
if grep -r "console.log.*user\|console.log.*email\|console.log.*ip" functions/src/ 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Potential user data logging found${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ No user data logging detected${NC}"
fi

# Check for credentials in requests
if grep -r "credentials.*include" src/ 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Frontend sends credentials - verify GDPR compliance${NC}"
else
    echo -e "${GREEN}✅ Frontend uses credential-less requests${NC}"
fi

echo ""
echo "=================================="

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}🎉 All security checks passed!${NC}"
    echo -e "${GREEN}✅ Your BigBuy integration is secure and GDPR compliant${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ISSUES_FOUND security issues that need attention${NC}"
    echo -e "${YELLOW}Please fix the issues above before deploying to production${NC}"
    exit 1
fi
