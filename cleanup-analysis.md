# Cleanup Analysis Report

## Files to Delete (Safe to Remove)

### 1. Duplicate Files (with "2" suffix)
- add-all-content-fields 2.sql
- add-all-home-content 2.sql

### 2. Old Railway Backup SQL Files (keeping only the latest)
- railway_BACKUP_20250925_085229.sql
- railway_BACKUP_20250925_085305.sql
- railway_BACKUP_20250925_085321.sql
- railway_BACKUP_20250925_085338.sql
- railway_BACKUP_20250925_085355.sql
- railway_BACKUP_20250925_085455.sql

### 3. Temporary Migration/Test Files
- temp-migration.sql
- temp-railway-migration.sql
- URGENT-FOOTER-FIX.sql (appears to be a hotfix, likely applied)

### 4. Old Test Report Markdown Files
- FINAL-RUSSIAN-MENU-ANALYSIS-REPORT.md
- FINAL-RUSSIAN-MENU-ANALYSIS-SUMMARY.md
- CORRECTED_TRANSLATION_BUGS_REPORT.md
- translation-analysis-corrected-report.md
- russian-menu-focused-report.md
- teacher-cards-test-report.md
- qa-system-readiness-report.md
- COMPREHENSIVE_QA_REPORT.md
- CAREER_ORIENTATION_COMPLIANCE_REPORT.md
- TRANSLATION-FIX-SUMMARY.md
- COURSE_DETAILS_TRANSLATION_SUMMARY.md
- manual-hebrew-validation.md
- permanent-translation-fix.md

### 5. Old Deployment/Setup Documentation
- NEWDESIGN_DEPLOYMENT_GUIDE.md
- DEPLOYMENT-SECURITY-CHECKLIST.md
- COMPLETE_DATABASE_IMPORT_GUIDE.md
- migration-plan.md
- multilingual-page-schema.md
- page-based-database-schema.md
- database-tables-analysis.md

### 6. One-time Fix/Apply Scripts (JS)
All "apply-" prefixed scripts that were one-time fixes:
- apply-*.js files (after verification they're no longer needed)

### 7. One-time Add Scripts (JS)
All "add-" prefixed scripts for one-time data additions:
- add-*.js files (after verification they're no longer needed)

### 8. Old Test Scripts
All test scripts that are outdated or replaced:
- *-test.js files in root (should be in tests/ folder)
- *-test-*.js files

### 9. Debug and Diagnostic Scripts
- diagnose-*.js files
- debug-*.js files
- check-*.js files

### 10. Fix Scripts (Already Applied)
- fix-*.js files (one-time fixes that have been applied)
- hardcode-*.js files
- patch-*.js files

## Files to Keep

### Critical Files
- server.js
- server.local.js
- migrate-to-railway.js
- package.json
- package-lock.json
- .gitignore
- CLAUDE.md
- Dockerfile
- docker-compose.yml

### Active HTML Pages
- All .html files (home.html, courses.html, etc.)

### Active Integration Scripts
- js/ folder contents (active frontend scripts)
- css/ folder contents (styles)
- images/ folder (assets)

### Protected Folders
- /Users/michaelmishayev/Desktop/newCode/backups/newDesign/docs (DO NOT TOUCH)
- automation/ folder (newly created, keep)
- dist/ folder (production builds)
- migrations/ folder (database migrations)
- scripts/ folder (build scripts)

## Estimated Cleanup Impact
- **Files to delete**: ~600+ files
- **Space to recover**: Estimated 50-100 MB
- **Project clarity**: Significantly improved

## Cleanup Order
1. Delete duplicate files (safest)
2. Remove old backup SQL files
3. Delete test report markdown files
4. Remove one-time migration scripts
5. Clean up test files
6. Remove debug/diagnostic scripts