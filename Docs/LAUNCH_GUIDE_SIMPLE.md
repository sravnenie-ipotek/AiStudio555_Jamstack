# 🚀 SUPER SIMPLE LAUNCH GUIDE - FOR HUMANS

## Step 1: Kill Everything First (Clean Start)
Open Terminal and copy-paste these commands one by one:

```bash
# Kill Python servers
pkill -f "python3 -m http.server"

# Kill Node servers  
pkill -f node

# Kill Strapi
pkill -f strapi
```

## Step 2: Build Your Website (Create the Files)
```bash
# Go to your project folder
cd /Users/michaelmishayev/Desktop/newCode

# Build the website files
npm run build
```

**What this does:** Creates 3 websites in different languages (English, Russian, Hebrew)

## Step 3: Start Your Local Server
```bash
# Start the server
npm run preview
```

**What this does:** Starts a server on your computer so you can see the website

## Step 4: Open Your Website
Click these links or type them in your browser:

- **English:** http://localhost:8000/en/
- **Russian:** http://localhost:8000/ru/  
- **Hebrew:** http://localhost:8000/he/

## ✅ HOW TO KNOW IT'S WORKING

You should see:
1. A website with "AI Studio" at the top
2. Beautiful animations when you scroll
3. A language switcher in the top-right corner
4. Forms for capturing leads (name, email, phone)

## ❌ IF IT'S NOT WORKING

### Problem: "Port 8000 already in use"
**Fix:**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill it (replace 12345 with the PID number you see)
kill -9 12345

# Try starting again
npm run preview
```

### Problem: "Cannot find module"
**Fix:**
```bash
# Install everything fresh
npm install

# Try building again
npm run build
```

### Problem: "Command not found: npm"
**Fix:** You need to install Node.js first
1. Go to https://nodejs.org
2. Download and install Node.js
3. Restart Terminal
4. Try again

### Problem: "Permission denied"
**Fix:**
```bash
# Add sudo (you'll need to enter your computer password)
sudo npm run build
sudo npm run preview
```

## 🌍 TO PUT ON THE INTERNET (GitHub Pages)

```bash
# Step 1: Add your changes
git add .

# Step 2: Save your changes
git commit -m "Deploy website"

# Step 3: Upload to GitHub
git push
```

Then wait 5-10 minutes and visit:
https://sravnenie-ipotek.github.io/AiStudio555_Jamstack/

## 📱 QUICK TEST CHECKLIST

After starting, check these:

- [ ] Can you see the English site? http://localhost:8000/en/
- [ ] Can you switch languages using the dropdown?
- [ ] Do animations work when you scroll?
- [ ] Can you fill out a form (it won't save yet, that's OK)?

## 🆘 EMERGENCY RESET

If everything is broken, do this:

```bash
# Go to project
cd /Users/michaelmishayev/Desktop/newCode

# Kill everything
pkill -f python3
pkill -f node
pkill -f strapi

# Clean install
rm -rf node_modules
npm install

# Build fresh
npm run build

# Start fresh
npm run preview
```

## 📞 WHAT TO TELL A DEVELOPER IF YOU NEED HELP

"I have a JAMstack site with:
- Static HTML files built with Node.js
- 3 language versions (EN/RU/HE)
- Trying to run locally on port 8000
- Using npm run preview to start"

---

## 🎨 CONTENT MANAGEMENT SYSTEM (STRAPI)

### How to Start Strapi CMS

```bash
# 1. Open new Terminal tab/window
# 2. Go to project folder
cd /Users/michaelmishayev/Desktop/newCode/strapi-fresh

# 3. Start Strapi
npm run develop
```

### Access Strapi Admin Panel

1. **Open browser:** http://localhost:1337/admin
2. **Login with:**
   - Email: admin@example.com  
   - Password: Admin123!
   
   (If these don't work, you need to create an admin account first)

### Creating Your First Admin Account

If you've never logged in before:
1. Go to http://localhost:1337/admin
2. Click "Create your first administrator"
3. Fill in:
   - First name: Your Name
   - Email: your@email.com
   - Password: YourPassword123!
4. Click "Let's start"

### How Content Management Works

**Current Status:**
- **Static Sites:** Your website shows the SAME content in all languages (just translated UI)
- **Dynamic Content:** Needs to be created in Strapi first

**To Add Dynamic Content:**

1. **In Strapi Admin (http://localhost:1337/admin):**
   - Go to Content Manager
   - Create content types (Courses, Instructors, etc.)
   - Add your content in different languages

2. **Connect Frontend to Strapi:**
   - The site will fetch content from Strapi API
   - Different content for each language
   - Real-time updates when you change content

### Why You See Same Content in All Languages

Right now your site is STATIC - it uses the HTML files directly.

To see different content per language, you need:
1. Create content in Strapi (Courses, About Us, etc.)
2. Enable the Internationalization plugin
3. Add content in EN, RU, HE languages
4. The JavaScript will fetch from Strapi API

### Quick Test if Strapi is Working

Open these URLs:
- **API:** http://localhost:1337/api
- **Admin:** http://localhost:1337/admin

If you see JSON data at /api, Strapi is working!

---

**THE MOST IMPORTANT THING:** 
The site currently shows static HTML. To manage content dynamically, you need to:
1. Create content in Strapi Admin
2. The JavaScript code will fetch it automatically