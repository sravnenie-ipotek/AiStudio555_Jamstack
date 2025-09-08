#!/bin/bash

echo "====================================="
echo "🔍 STRAPI SELF-QA MONITORING SYSTEM"
echo "====================================="
echo ""

ISSUES=0
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

# Check Node version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v)
if [[ $NODE_VERSION == v20* ]] || [[ $NODE_VERSION == v18* ]] || [[ $NODE_VERSION == v19* ]] || [[ $NODE_VERSION == v21* ]] || [[ $NODE_VERSION == v22* ]]; then
    echo "  ✅ Node version: $NODE_VERSION"
else
    echo "  ❌ Node version incompatible: $NODE_VERSION (needs 18-22)"
    ((ISSUES++))
fi

# Check PostgreSQL
echo ""
echo "✓ Checking PostgreSQL..."
if pg_isready -h localhost -p 5432 &>/dev/null; then
    echo "  ✅ PostgreSQL is running"
else
    echo "  ❌ PostgreSQL is not running"
    ((ISSUES++))
fi

# Check database connection
echo ""
echo "✓ Checking database connection..."
if PGPASSWORD=localpassword psql -h localhost -U projectdes -d strapi_admin -c "SELECT 1" -t &>/dev/null; then
    echo "  ✅ Database connection successful"
else
    echo "  ❌ Cannot connect to database"
    ((ISSUES++))
fi

# Check Strapi server
echo ""
echo "✓ Checking Strapi server..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/_health | grep -q "204\|200"; then
    echo "  ✅ Strapi server is running"
else
    echo "  ❌ Strapi server is not responding"
    ((ISSUES++))
fi

# Check Admin panel
echo ""
echo "✓ Checking Admin panel..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/admin)
if [ "$HTTP_STATUS" -lt "500" ]; then
    echo "  ✅ Admin panel is accessible (HTTP $HTTP_STATUS)"
else
    echo "  ❌ Admin panel error (HTTP $HTTP_STATUS)"
    ((ISSUES++))
fi

# Check API endpoints
echo ""
echo "✓ Checking API endpoints..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/api)
if [ "$API_STATUS" -lt "500" ]; then
    echo "  ✅ API is responding (HTTP $API_STATUS)"
else
    echo "  ❌ API error (HTTP $API_STATUS)"
    ((ISSUES++))
fi

# Check memory usage
echo ""
echo "✓ Checking memory usage..."
if pgrep -f "strapi develop" > /dev/null; then
    MEM_KB=$(ps aux | grep "strapi develop" | grep -v grep | awk '{print $6}' | head -1)
    MEM_MB=$((MEM_KB / 1024))
    if [ "$MEM_MB" -lt 1000 ]; then
        echo "  ✅ Memory usage: ${MEM_MB}MB (healthy)"
    else
        echo "  ⚠️  Memory usage: ${MEM_MB}MB (high)"
        ((ISSUES++))
    fi
else
    echo "  ⚠️  Strapi process not found"
fi

# Summary
echo ""
echo "====================================="
if [ $ISSUES -eq 0 ]; then
    echo "✅ SYSTEM HEALTH: EXCELLENT (Grade: A)"
    echo "All systems operational!"
else
    SCORE=$((100 - ISSUES * 15))
    if [ $SCORE -ge 85 ]; then
        GRADE="B"
        STATUS="GOOD"
    elif [ $SCORE -ge 70 ]; then
        GRADE="C"
        STATUS="FAIR"
    elif [ $SCORE -ge 55 ]; then
        GRADE="D"
        STATUS="DEGRADED"
    else
        GRADE="F"
        STATUS="CRITICAL"
    fi
    echo "⚠️  SYSTEM HEALTH: $STATUS (Grade: $GRADE)"
    echo "Issues found: $ISSUES"
fi

# Auto-healing recommendations
if [ $ISSUES -gt 0 ]; then
    echo ""
    echo "🔧 AUTO-HEALING RECOMMENDATIONS:"
    
    if ! pg_isready -h localhost -p 5432 &>/dev/null; then
        echo "  • Start PostgreSQL: brew services start postgresql"
    fi
    
    if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/_health | grep -q "204\|200"; then
        echo "  • Start Strapi: npm run develop"
    fi
    
    if [ "$MEM_MB" -gt 1000 ]; then
        echo "  • High memory usage - restart Strapi"
    fi
fi

echo "====================================="
echo ""

# Save report to file
REPORT_FILE="qa-report-$(date +%Y%m%d-%H%M%S).json"
cat > $REPORT_FILE << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "issues": $ISSUES,
  "score": $((100 - ISSUES * 15)),
  "grade": "${GRADE:-A}",
  "status": "${STATUS:-healthy}",
  "checks": {
    "node_version": "$NODE_VERSION",
    "postgresql": $(pg_isready -h localhost -p 5432 &>/dev/null && echo "true" || echo "false"),
    "database": $(PGPASSWORD=localpassword psql -h localhost -U projectdes -d strapi_admin -c "SELECT 1" -t &>/dev/null && echo "true" || echo "false"),
    "strapi_server": $(curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/_health | grep -q "204\|200" && echo "true" || echo "false"),
    "admin_panel": "$HTTP_STATUS",
    "api": "$API_STATUS",
    "memory_mb": ${MEM_MB:-0}
  }
}
EOF

echo "Report saved to: $REPORT_FILE"

exit $ISSUES