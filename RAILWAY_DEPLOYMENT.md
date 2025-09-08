# Railway Deployment Guide - ALL-IN-ONE

## 🚀 EVERYTHING IN RAILWAY - NO EXTERNAL DEPENDENCIES!

### What's Included:
✅ **Frontend** - Static HTML/CSS/JS  
✅ **Custom APIs** - Bypass Strapi v5 bug  
✅ **PostgreSQL** - Railway's own database  
✅ **Data Migration** - Automatic from SQLite  

## 📋 Prerequisites

1. **Railway Account**: Create at https://railway.app
2. **GitHub Repository**: Already connected
3. **Railway Token**: Saved in `.env.railway`

## 🏗️ Architecture

Due to the **Strapi v5 Critical API Bug** (all endpoints return 404), we're deploying a custom solution:

```
Railway Server (server.js)
├── Static Frontend (HTML/CSS/JS)
├── Admin Panel (content-admin-comprehensive.html)
└── Custom Live API (bypasses broken Strapi)
    ├── Read Operations (/api/*)
    └── CRUD Operations (PUT/POST/DELETE)
```

## 🔧 How to Deploy

### Step 1: Add PostgreSQL to Railway
```bash
# In Railway dashboard:
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway automatically provides DATABASE_URL
3. No configuration needed!
```

### Step 2: Environment Variables (Automatic!)
Railway automatically sets:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port
- `NODE_ENV=production` - Production mode

You don't need to set anything!

## 📦 Deployment Steps

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Link Project
```bash
railway link
```

### 4. Set Environment Variables
```bash
railway variables set DATABASE_URL="your-strapi-cloud-url"
railway variables set NODE_ENV="production"
```

### 5. Deploy
```bash
railway up
```

## 🌐 Production URLs

- **Website**: `https://your-app.railway.app`
- **Admin Panel**: `https://your-app.railway.app/admin`
- **API Status**: `https://your-app.railway.app/api/status`

## 📊 API Endpoints

### Read Operations
- `GET /api/home-page` - All 123 home fields
- `GET /api/courses` - Course catalog
- `GET /api/blog-posts` - Blog content
- `GET /api/teachers` - Instructors
- `GET /api/status` - System health

### CRUD Operations
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `PUT /api/home-page/:id` - Update home content

## 🗄️ Database Migration

If using Strapi Cloud PostgreSQL:

1. Export SQLite data:
```bash
sqlite3 strapi-fresh/.tmp/data.db .dump > backup.sql
```

2. Convert to PostgreSQL format
3. Import to Strapi Cloud database

## ⚠️ Important Notes

### Strapi v5 Bug
- **Problem**: All Strapi `/api/*` endpoints return 404
- **Solution**: Custom Live API in `server.js`
- **Documentation**: `/Docs/architecture/strapi/PROBLEM/bugInStrapi.md`

### Why This Architecture?
1. Strapi's REST API is completely broken
2. Can't use GraphQL (depends on REST)
3. Custom API reads directly from database
4. Maintains Strapi response structure

## 🔍 Monitoring

Check deployment status:
```bash
railway logs
railway status
```

Test API:
```bash
curl https://your-app.railway.app/api/status
```

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL format
railway variables

# Test connection
railway run node -e "console.log(process.env.DATABASE_URL)"
```

### Port Issues
Railway automatically assigns PORT. Don't hardcode it.

### CORS Errors
Ensure `CORS_ORIGIN` is set to `*` or your domain.

## 📝 Maintenance

### Update Content
Use admin panel at `/admin` to manage all content visually.

### Update Code
```bash
git add .
git commit -m "Update"
git push
railway up
```

### View Logs
```bash
railway logs -f
```

## 🎯 Success Checklist

- [ ] Railway CLI installed
- [ ] Project linked to Railway
- [ ] Environment variables set
- [ ] Database connected (Strapi Cloud)
- [ ] Deployment successful
- [ ] Admin panel accessible
- [ ] API endpoints working
- [ ] Content updates reflecting

## 💡 Tips

1. **Use Railway's free tier** for testing ($5 credit)
2. **Monitor usage** in Railway dashboard
3. **Set up alerts** for errors
4. **Use custom domain** for production
5. **Enable auto-deploy** from GitHub

## 🆘 Support

- **Railway Docs**: https://docs.railway.app
- **Our Bug Report**: `/Docs/architecture/strapi/PROBLEM/bugInStrapi.md`
- **Custom API Code**: `server.js`, `strapi-live-api-*.js`

---

**Last Updated**: September 2025
**Status**: Ready for deployment
**Note**: Using workaround for Strapi v5 critical API bug