#!/bin/bash

# ─────────────────────────────────────────────────────
# ShopKit Smoke Test Suite
# Usage:
#   ./tests/smoke-test.sh http://localhost:3000
#   ./tests/smoke-test.sh https://shopkit-production.up.railway.app
# ─────────────────────────────────────────────────────

set -u

# ─── Config ───
BASE_URL="${1:-}"
if [ -z "$BASE_URL" ]; then
  echo "❌ Usage: $0 <base-url>"
  echo "   Example: $0 http://localhost:3000"
  exit 1
fi

API="$BASE_URL/api/v1"
TEST_EMAIL="smoke-$(date +%s)@example.com"
TEST_PASSWORD="secret123"

# ─── Colors ───
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ─── Counters ───
PASS=0
FAIL=0
SKIP=0

# ─── Helpers ───
pass() { echo -e "  ${GREEN}✅ PASS${NC} — $1"; PASS=$((PASS+1)); }
fail() { echo -e "  ${RED}❌ FAIL${NC} — $1"; FAIL=$((FAIL+1)); }
skip() { echo -e "  ${YELLOW}⏭️  SKIP${NC} — $1"; SKIP=$((SKIP+1)); }
section() { echo ""; echo -e "${BLUE}${BOLD}▶ $1${NC}"; }

# Extract a value from JSON without jq (simple grep)
extract() {
  local key="$1"
  local json="$2"
  echo "$json" | grep -o "\"$key\":\"[^\"]*\"" | head -1 | cut -d'"' -f4
}

# ─── Start ───
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   ShopKit Smoke Test Suite                   ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════╝${NC}"
echo -e "  Target: ${BOLD}$BASE_URL${NC}"
echo -e "  Time:   $(date)"
echo ""

# ─────────────────────────────────────────────────────
section "1. Health Check"
# ─────────────────────────────────────────────────────

HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$HEALTH" = "200" ]; then
  pass "GET /health returns 200"
else
  fail "GET /health returned $HEALTH (expected 200)"
fi

HEALTH_BODY=$(curl -s "$BASE_URL/health")
if echo "$HEALTH_BODY" | grep -q '"status":"ok"'; then
  pass "Health status is 'ok'"
else
  fail "Health status is not 'ok' — body: $HEALTH_BODY"
fi

# ─────────────────────────────────────────────────────
section "2. Templates (Public)"
# ─────────────────────────────────────────────────────

TEMPLATES=$(curl -s "$API/templates")
TEMPLATES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/templates")

if [ "$TEMPLATES_STATUS" = "200" ]; then
  pass "GET /templates returns 200"
else
  fail "GET /templates returned $TEMPLATES_STATUS"
fi

TEMPLATES_COUNT=$(echo "$TEMPLATES" | grep -o '"slug"' | wc -l)
if [ "$TEMPLATES_COUNT" -ge 6 ]; then
  pass "Templates list has $TEMPLATES_COUNT templates"
else
  fail "Expected >= 6 templates, found $TEMPLATES_COUNT"
fi

TEMPLATE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/templates/modern-cafe")
if [ "$TEMPLATE_STATUS" = "200" ]; then
  pass "GET /templates/modern-cafe returns 200"
else
  fail "GET /templates/modern-cafe returned $TEMPLATE_STATUS"
fi

TEMPLATE_404=$(curl -s -o /dev/null -w "%{http_code}" "$API/templates/does-not-exist")
if [ "$TEMPLATE_404" = "404" ]; then
  pass "GET /templates/does-not-exist returns 404"
else
  fail "Expected 404 for missing template, got $TEMPLATE_404"
fi

# ─────────────────────────────────────────────────────
section "3. Auth — Register"
# ─────────────────────────────────────────────────────

REGISTER=$(curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Smoke Test\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"store_name\":\"Smoke Store\"}")

TOKEN=$(extract "accessToken" "$REGISTER")
TENANT_SLUG=$(echo "$REGISTER" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  pass "POST /auth/register returned an access token"
else
  fail "POST /auth/register did not return a token — body: $REGISTER"
fi

if [ -n "$TENANT_SLUG" ]; then
  pass "Tenant created with slug: $TENANT_SLUG"
else
  fail "No tenant slug in register response"
fi

# ─────────────────────────────────────────────────────
section "4. Auth — Login"
# ─────────────────────────────────────────────────────

LOGIN=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

LOGIN_TOKEN=$(extract "accessToken" "$LOGIN")

if [ -n "$LOGIN_TOKEN" ]; then
  pass "POST /auth/login returned a token"
  TOKEN="$LOGIN_TOKEN"
else
  fail "POST /auth/login did not return a token — body: $LOGIN"
fi

# ─────────────────────────────────────────────────────
section "5. Auth — Me"
# ─────────────────────────────────────────────────────

ME=$(curl -s "$API/auth/me" -H "Authorization: Bearer $TOKEN")
ME_EMAIL=$(extract "email" "$ME")

if [ "$ME_EMAIL" = "$TEST_EMAIL" ]; then
  pass "GET /auth/me returns correct user"
else
  fail "GET /auth/me returned wrong user — body: $ME"
fi

# ─────────────────────────────────────────────────────
section "6. Auth — Protected Route Without Token"
# ─────────────────────────────────────────────────────

NO_AUTH=$(curl -s -o /dev/null -w "%{http_code}" "$API/auth/me")
if [ "$NO_AUTH" = "401" ]; then
  pass "Protected route without token returns 401"
else
  fail "Protected route without token returned $NO_AUTH (expected 401)"
fi

# ─────────────────────────────────────────────────────
section "7. Products CRUD"
# ─────────────────────────────────────────────────────

# Create
CREATE_PROD=$(curl -s -X POST "$API/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke Test Product","price":499,"category":"Test"}')

PROD_ID=$(extract "id" "$CREATE_PROD")

if [ -n "$PROD_ID" ]; then
  pass "POST /products created a product ($PROD_ID)"
else
  fail "POST /products did not return an ID — body: $CREATE_PROD"
fi

# List
LIST_PROD=$(curl -s "$API/products" -H "Authorization: Bearer $TOKEN")
if echo "$LIST_PROD" | grep -q "$PROD_ID"; then
  pass "GET /products includes the new product"
else
  fail "GET /products does not include the new product"
fi

# Update
UPDATE_PROD=$(curl -s -X PUT "$API/products/$PROD_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":599}')

if echo "$UPDATE_PROD" | grep -qE '"price":(")?599'; then
  pass "PUT /products/:id updated the price"
else
  fail "PUT /products/:id did not update — body: $UPDATE_PROD"
fi

# Delete
DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API/products/$PROD_ID" \
  -H "Authorization: Bearer $TOKEN")

if [ "$DELETE_STATUS" = "200" ]; then
  pass "DELETE /products/:id returns 200"
else
  fail "DELETE /products/:id returned $DELETE_STATUS"
fi

# Verify deleted
VERIFY_DELETE=$(curl -s -o /dev/null -w "%{http_code}" "$API/products/$PROD_ID" \
  -H "Authorization: Bearer $TOKEN")

if [ "$VERIFY_DELETE" = "404" ]; then
  pass "Deleted product returns 404"
else
  fail "Deleted product returned $VERIFY_DELETE (expected 404)"
fi

# ─────────────────────────────────────────────────────
section "8. Blocks"
# ─────────────────────────────────────────────────────

BLOCKS=$(curl -s "$API/blocks" -H "Authorization: Bearer $TOKEN")
BLOCKS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/blocks" -H "Authorization: Bearer $TOKEN")

if [ "$BLOCKS_STATUS" = "200" ]; then
  pass "GET /blocks returns 200"
else
  fail "GET /blocks returned $BLOCKS_STATUS"
fi

# Apply a template then verify blocks exist
APPLY=$(curl -s -X POST "$API/tenants/me/apply-template" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"template_slug":"modern-cafe"}')

if echo "$APPLY" | grep -q '"success":true'; then
  pass "POST /tenants/me/apply-template succeeded"
else
  fail "POST /tenants/me/apply-template failed — body: $APPLY"
fi

BLOCKS_AFTER=$(curl -s "$API/blocks" -H "Authorization: Bearer $TOKEN")
BLOCKS_COUNT=$(echo "$BLOCKS_AFTER" | grep -o '"type"' | wc -l)

if [ "$BLOCKS_COUNT" -ge 5 ]; then
  pass "Blocks created after template apply: $BLOCKS_COUNT"
else
  fail "Expected >= 5 blocks, found $BLOCKS_COUNT"
fi

# ─────────────────────────────────────────────────────
section "9. Uploads — Presign"
# ─────────────────────────────────────────────────────

PRESIGN=$(curl -s -X POST "$API/uploads/presign" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filename":"smoke-test.jpg","contentType":"image/jpeg","purpose":"product-image"}')

PRESIGN_URL=$(extract "uploadUrl" "$PRESIGN")
PRESIGN_PATH=$(extract "path" "$PRESIGN")
PRESIGN_PUBLIC=$(extract "publicUrl" "$PRESIGN")

if [ -n "$PRESIGN_URL" ] && [ -n "$PRESIGN_PATH" ] && [ -n "$PRESIGN_PUBLIC" ]; then
  pass "POST /uploads/presign returned uploadUrl, path, publicUrl"
else
  fail "POST /uploads/presign incomplete — body: $PRESIGN"
fi

# ─────────────────────────────────────────────────────
section "10. Public Storefront"
# ─────────────────────────────────────────────────────

if [ -n "$TENANT_SLUG" ]; then
  PUB_TENANT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/public/tenant?slug=$TENANT_SLUG")
  if [ "$PUB_TENANT_STATUS" = "200" ]; then
    pass "GET /public/tenant?slug=$TENANT_SLUG returns 200"
  else
    fail "GET /public/tenant returned $PUB_TENANT_STATUS"
  fi

  PUB_BLOCKS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/public/blocks?slug=$TENANT_SLUG")
  if [ "$PUB_BLOCKS_STATUS" = "200" ]; then
    pass "GET /public/blocks returns 200"
  else
    fail "GET /public/blocks returned $PUB_BLOCKS_STATUS"
  fi

  PUB_PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/public/products?slug=$TENANT_SLUG")
  if [ "$PUB_PROD_STATUS" = "200" ]; then
    pass "GET /public/products returns 200"
  else
    fail "GET /public/products returned $PUB_PROD_STATUS"
  fi
else
  skip "Public storefront tests (no tenant slug from register)"
fi

# ─────────────────────────────────────────────────────
section "11. Rate Limiting — Global Headers"
# ─────────────────────────────────────────────────────

HEADERS=$(curl -s -i "$API/templates" 2>&1)
if echo "$HEADERS" | grep -q "RateLimit:"; then
  pass "Global limiter sends RateLimit header"
else
  fail "Global limiter header missing"
fi

# ─────────────────────────────────────────────────────
section "12. Rate Limiting — Login Limit"
# ─────────────────────────────────────────────────────

# Send 7 failed login attempts
LOGIN_429_COUNT=0
for i in $(seq 1 7); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"ratelimit-test@example.com","password":"wrong"}')
  if [ "$STATUS" = "429" ]; then
    LOGIN_429_COUNT=$((LOGIN_429_COUNT+1))
  fi
done

if [ "$LOGIN_429_COUNT" -ge 2 ]; then
  pass "Login limiter blocked $LOGIN_429_COUNT of 7 attempts (limit hit)"
else
  fail "Login limiter did not block enough attempts (only $LOGIN_429_COUNT)"
fi

# ─────────────────────────────────────────────────────
section "13. Logout"
# ─────────────────────────────────────────────────────

LOGOUT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API/auth/logout")
if [ "$LOGOUT_STATUS" = "200" ]; then
  pass "POST /auth/logout returns 200"
else
  fail "POST /auth/logout returned $LOGOUT_STATUS"
fi

# ─────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}══════════════════════════════════════════════${NC}"
echo -e "${BOLD}  Summary${NC}"
echo -e "${BOLD}══════════════════════════════════════════════${NC}"
echo -e "  ${GREEN}PASS:${NC} $PASS"
echo -e "  ${RED}FAIL:${NC} $FAIL"
echo -e "  ${YELLOW}SKIP:${NC} $SKIP"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}${BOLD}❌ Smoke tests FAILED${NC}"
  exit 1
else
  echo -e "${GREEN}${BOLD}✅ All smoke tests passed${NC}"
  exit 0
fi