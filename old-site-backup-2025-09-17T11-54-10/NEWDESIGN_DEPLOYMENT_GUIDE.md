# 🚀 NewDesign Railway Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy the NewDesign application from `/backups/newDesign` to Railway, replacing the current home page while preserving all APIs and database connections.

## 📋 Pre-Deployment Checklist

### ✅ Prerequisites
- [ ] Node.js installed (v14+)
- [ ] Git configured
- [ ] Railway CLI installed (optional)
- [ ] Access to Railway dashboard
- [ ] Local testing environment ready

### ✅ Backup Verification
- [ ] Current site backed up
- [ ] Database backup created
- [ ] .env files secured
- [ ] Git repository up to date

## 🎯 Deployment Strategy

### Phase 1: Local Preparation
1. **Backup current site**
2. **Copy NewDesign files to root**
3. **Update server routes**
4. **Test locally**

### Phase 2: Railway Deployment
1. **Commit changes**
2. **Push to Railway**
3. **Verify deployment**
4. **Monitor logs**

## 📝 Step-by-Step Instructions

### Step 1: Run Deployment Preparation Script

```bash
# Navigate to project root
cd /Users/michaelmishayev/Desktop/newCode

# Run the preparation script
node prepare-newdesign-deployment.js
```

This script will:
- ✅ Create backup of current site
- ✅ Copy NewDesign files to root
- ✅ Update server.js routes
- ✅ Update package.json scripts
- ✅ Create deployment info file

### Step 2: Test Locally

```bash
# Start the server with NewDesign
npm run dev:newdesign

# Or run server and frontend separately
npm start  # API server on port 3000/1337
python3 -m http.server 3005  # Frontend server
```

Test URLs:
- http://localhost:3005/ - NewDesign home page
- http://localhost:3005/courses.html - Courses page
- http://localhost:3000/api/featured-courses - API endpoint

### Step 3: Verify Changes

Check these critical files:
```bash
# Verify home.html exists in root
ls -la home.html

# Check server.js serves home.html
grep "home.html" server.js

# Verify static assets
ls -la css/ js/ images/
```

### Step 4: Commit Changes

```bash
# Review changes
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Deploy NewDesign as main site - Replace old home page with new design"
```

### Step 5: Deploy to Railway

#### Option A: Via Git Push
```bash
# Push to main branch (Railway auto-deploys)
git push origin main
```

#### Option B: Via Railway CLI
```bash
# Deploy using Railway CLI
railway up
```

### Step 6: Monitor Deployment

1. **Check Railway Dashboard**
   - Go to https://railway.app/dashboard
   - Select your project
   - Monitor deployment logs

2. **Verify Live Site**
   - Visit: https://aistudio555jamstack-production.up.railway.app
   - Test all pages
   - Verify API endpoints

## 🔄 Rollback Instructions

If issues occur, rollback immediately:

### Quick Rollback (Local)
```bash
# Restore from backup
node restore-from-backup.js old-site-backup-[timestamp]

# Commit rollback
git add .
git commit -m "Rollback to previous version"
git push
```

### Git Rollback
```bash
# Revert to previous commit
git revert HEAD
git push
```

## 📁 File Structure After Deployment

```
/Users/michaelmishayev/Desktop/newCode/
├── home.html              # NewDesign home page (main)
├── courses.html           # NewDesign courses
├── about-us.html          # NewDesign about
├── css/                   # NewDesign styles
├── js/                    # NewDesign scripts
├── images/                # NewDesign images
├── shared/                # Shared components
│   └── services/
│       ├── emailService/
│       └── imageGenerationService/
├── server.js              # Updated server with new routes
├── package.json           # Updated with new scripts
├── old-site-backup-*/     # Backup of old site
└── backups/newDesign/     # Original NewDesign source

```

## 🔧 Server Configuration Updates

### Updated Routes in server.js
```javascript
// Root now serves NewDesign home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Static files served from root
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
```

### Preserved API Endpoints
- `/api/featured-courses` - Course data
- `/api/nd/home-page` - Home page content
- `/api/generate-image` - Image generation
- `/api/consultations` - Form submissions
- All other existing APIs remain unchanged

## ⚠️ Important Notes

### What's Preserved
- ✅ All API endpoints
- ✅ Database connections
- ✅ Authentication system
- ✅ Environment variables
- ✅ Node modules
- ✅ Git history

### What's Changed
- 🔄 Home page (index.html → home.html)
- 🔄 UI/UX design (old → NewDesign)
- 🔄 Static asset paths
- 🔄 Navigation structure

### Breaking Changes
- Old bookmarks to index.html will redirect to home.html
- Some deep links may need updating
- Custom integrations may need path adjustments

## 🐛 Troubleshooting

### Issue: Pages not loading
```bash
# Check static file serving
curl http://localhost:3005/css/normalize.css
curl http://localhost:3005/js/webflow.js
```

### Issue: API endpoints failing
```bash
# Test API endpoints
curl http://localhost:3000/api/featured-courses
curl http://localhost:3000/api/nd/home-page
```

### Issue: Database connection errors
```bash
# Check environment variables
echo $DATABASE_URL
echo $PORT

# Verify .env file
cat .env
```

### Issue: Railway deployment stuck
1. Check Railway logs
2. Verify build command in railway.json
3. Check environment variables in Railway dashboard
4. Restart deployment from Railway dashboard

## 📊 Post-Deployment Verification

### Functional Tests
- [ ] Home page loads correctly
- [ ] Navigation menu works
- [ ] Courses page displays courses
- [ ] Contact forms submit successfully
- [ ] Images load properly
- [ ] Responsive design works
- [ ] API endpoints respond

### Performance Checks
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] All resources load (no 404s)
- [ ] Mobile responsiveness

### SEO Verification
- [ ] Meta tags present
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Social media tags working

## 🎉 Success Criteria

The deployment is successful when:
1. ✅ NewDesign home page is live at root URL
2. ✅ All pages are accessible and functional
3. ✅ API endpoints return data
4. ✅ No console errors
5. ✅ Forms submit successfully
6. ✅ Images and assets load properly
7. ✅ Mobile responsive design works

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review Railway deployment logs
3. Check server logs: `railway logs`
4. Rollback if critical issues persist

## 🔐 Security Reminders

- Never commit `.env` files
- Keep API keys secure
- Update CORS settings for production
- Enable HTTPS on Railway
- Regular security audits

---

**Last Updated**: September 2024
**Version**: 1.0
**Status**: Ready for Deployment