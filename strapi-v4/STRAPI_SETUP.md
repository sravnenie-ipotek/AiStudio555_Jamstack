# Strapi v4 CMS with LibreTranslate Integration

## ✅ What's Been Set Up

### 1. **Strapi v4.25.23** - Working stable version
- Admin Panel: http://localhost:1337/admin
- API: http://localhost:1337/api

### 2. **Page Section Content Type**
Created with all fields from your original schema:
- 26 page types (home, how_it_works, who_we_are, etc.)
- Content fields (heading, subheading, content, buttons)
- SEO fields (seoTitle, seoDescription)
- Organization fields (order, isVisible)

### 3. **Translation Service**
- Integration with LibreTranslate for Russian/Hebrew
- Auto-translation API endpoints
- Bulk translation capabilities

## 🚀 Quick Start

### Start Strapi
```bash
cd /Users/michaelmishayev/Desktop/newCode/strapi-v4
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
npm run develop
```

### Start LibreTranslate (for translations)
```bash
docker-compose up -d libretranslate
# Will run on http://localhost:5001
```

## 📝 How to Use

### 1. Create Your First Admin User
- Go to http://localhost:1337/admin
- Fill in the registration form
- Create your admin account

### 2. Add Content
- Go to Content Manager → Page Sections
- Click "Create new entry"
- Fill in the fields for your section
- Save and Publish

### 3. Use Auto-Translation

#### Translate Single Section:
```bash
POST http://localhost:1337/api/page-sections/:id/translate
```

#### Bulk Translate Page:
```bash
GET http://localhost:1337/api/page-sections/bulk-translate?pageName=home
```

## 🔧 API Endpoints

### Page Sections
- `GET /api/page-sections` - List all sections
- `GET /api/page-sections/:id` - Get single section
- `POST /api/page-sections` - Create section
- `PUT /api/page-sections/:id` - Update section
- `DELETE /api/page-sections/:id` - Delete section

### Translation
- `POST /api/page-sections/:id/translate` - Auto-translate section
- `GET /api/page-sections/bulk-translate?pageName=:name` - Translate all sections for a page

### Section Management
- `POST /api/page-sections/:id/toggle-visibility` - Hide/show section
- `POST /admin/sync-frontend` - Sync frontend changes to Strapi
- `GET /admin/sync-status` - Get sync status and section overview

## 📁 Project Structure
```
strapi-v4/
├── src/
│   └── api/
│       └── page-section/
│           ├── content-types/
│           │   └── page-section/
│           │       └── schema.json    # Content type definition
│           ├── controllers/
│           │   └── page-section.js    # API logic + translation endpoints
│           ├── services/
│           │   ├── page-section.js    # Business logic
│           │   └── translation.js     # LibreTranslate integration
│           └── routes/
│               ├── page-section.js    # Core API routes
│               ├── custom.js          # Translation routes  
│               └── sync.js            # Frontend sync routes
├── docker-compose.yml                 # Docker services (PostgreSQL, LibreTranslate)
└── STRAPI_SETUP.md                   # This file
```

## 🌐 Translation Workflow

### Phase 1: Auto-Translation
- Use LibreTranslate API for initial bulk translation
- Automatically translates: heading, subheading, content, button text, SEO fields

### Phase 2: Manual Review
- Content managers review translations in Strapi admin
- Edit and improve translations directly

### Phase 3: Save Corrections
- All corrections saved in Strapi database
- Can export/import translations

## 🔒 Permissions
Remember to configure API permissions:
1. Go to Settings → Roles
2. Configure Public/Authenticated permissions for page-sections

## 🐳 Docker Services
```bash
# Start all services
docker-compose up

# Start only LibreTranslate
docker-compose up libretranslate

# Start only PostgreSQL (if needed)
docker-compose up postgres
```

## 📊 Database
Currently using SQLite for simplicity. To switch to PostgreSQL:
1. Update `config/database.js`
2. Set DATABASE_CLIENT=postgres in .env
3. Run `docker-compose up postgres`

## 🧪 Testing
Check if everything works:
```bash
# Test API
curl http://localhost:1337/api/page-sections

# Test LibreTranslate
curl -X POST http://localhost:5001/translate \
  -H "Content-Type: application/json" \
  -d '{"q":"Hello","source":"en","target":"ru"}'
```

## 🔄 Frontend-Strapi Sync System

### **How It Works:**
When programmer changes HTML components, the system automatically:
1. **Detects changes** via file watcher or git hooks
2. **Extracts section info** from `data-strapi-*` attributes  
3. **Auto-creates/updates** sections in Strapi
4. **Notifies content manager** of new/changed sections

### **Frontend Component Setup:**
```jsx
// components/Hero.jsx
<section 
  data-strapi-section="home-hero"
  data-strapi-page="home" 
  data-strapi-name="Hero Banner"
  data-strapi-order="1"
>
  <h1>{content.heading}</h1>
  <p>{content.subheading}</p>
</section>
```

### **Run Sync Manually:**
```bash
node scripts/sync-frontend.js
```

### **Content Manager Features:**
- ✅ **Page-first navigation** (mirrors website structure)
- ✅ **Section visibility toggle** (`isVisible` field) 
- ✅ **Auto-sync notifications** when frontend changes
- ✅ **Translation status tracking** (🟢🟡🔴 system)
- 📸 **Screenshots** (coming soon with live preview)

## 🎯 **Visual Content Organization:**

```
📱 CMS shows exactly like website:
├── 🏠 Homepage
│   ├── 🎯 Hero Banner     [🟢EN 🟡RU 🔴HE] [👁️][✏️][🔄]
│   ├── ✨ Features        [🟢EN 🟢RU 🔴HE] [👁️][✏️][🔄]  
│   └── 📞 Call-to-Action  [🟢EN 🟢RU 🟢HE] [👁️][✏️][🔄]
├── 👥 About
│   ├── 📖 Our Story       [🟢EN 🟡RU 🔴HE] [👁️][✏️][🔄]
│   └── 🏢 Team Section    [🟢EN 🔴RU 🔴HE] [👁️][✏️][🔄]
```

**Legend:**
- 🟢 = Complete/Approved  
- 🟡 = Pending SuperAdmin approval
- 🔴 = Missing/Needs work
- 👁️ = Toggle visibility
- ✏️ = Edit content  
- 🔄 = Auto-translate

## 📝 Next Steps
1. ✅ Create admin user
2. ✅ Add sample content
3. ✅ Test translation features
4. ✅ Configure section visibility
5. Configure API permissions
6. Set up frontend sync workflow
7. Add screenshot capture system