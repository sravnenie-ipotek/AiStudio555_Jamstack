# 🚀 Complete Production Deployment Guide

## 📦 Package Contents

1. **frontend/** - All website files
2. **railway-database-export.sql** - Complete database export
3. **deploy-to-railway.sh** - Railway deployment script
4. **deploy-to-server.sh** - Server deployment script

## 🗄️ Step 1: Deploy Database to Railway

### Option A: Via Railway CLI
```bash
# Get your DATABASE_URL from Railway dashboard
export DATABASE_URL="postgresql://..."

# Import database
psql $DATABASE_URL < railway-database-export.sql

# Verify import
psql $DATABASE_URL -c "SELECT COUNT(*) FROM nd_courses;"
```

### Option B: Via Railway Dashboard
1. Go to Railway Dashboard
2. Select your PostgreSQL service
3. Click "Query" tab
4. Paste contents of `railway-database-export.sql`
5. Execute

## 🌐 Step 2: Deploy Frontend Files

### Option A: Manual Upload via FTP/SFTP
1. Connect to server: `194.87.92.16`
2. Navigate to: `/var/www/html/`
3. Upload all files from `frontend/` directory
4. Maintain directory structure

### Option B: Via cPanel/Control Panel
1. Login to your hosting control panel
2. Use File Manager
3. Upload files to public_html or www directory
4. Preserve folder structure

### Option C: Via SSH (if available)
```bash
# From the deployment package directory
scp -r frontend/* root@194.87.92.16:/var/www/html/
```

## ✅ Step 3: Verify Deployment

### Check Railway API:
```bash
curl "https://aistudio555jamstack-production.up.railway.app/api/nd/courses?locale=en"
```

### Check Website:
1. Visit: https://www.aistudio555.com/home.html
2. Test language switching: EN/RU/HE
3. Check courses page: https://www.aistudio555.com/courses.html
4. Clear browser cache: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

## 🔧 Troubleshooting

### If courses don't show:
- Verify `nd_courses` table exists in Railway
- Check browser console for errors
- Ensure API URL is correct in JS files

### If translations don't work:
- Clear browser cache completely
- Check that unified-language-manager.js is loaded
- Verify API endpoints are responding

## 📱 Important Files

### Core Translation System:
- `js/unified-language-manager.js` - Main translation engine
- `js/nd-*-integration.js` - Page-specific integrations

### Critical Pages:
- `home.html` - Main landing page
- `courses.html` - Course catalog
- `detail_courses.html` - Course details
- `pricing.html` - Pricing plans

## 🎯 Expected Results

After successful deployment:
- ✅ All pages load with proper translations
- ✅ Language switching works (EN/RU/HE)
- ✅ Courses display from database
- ✅ Navigation translations work
- ✅ RTL layout for Hebrew

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify database connection
3. Ensure all files uploaded correctly
4. Test API endpoints directly

---
*Generated on: $(date)*
