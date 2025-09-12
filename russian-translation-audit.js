#!/usr/bin/env node

/**
 * ULTRATHINK RUSSIAN TRANSLATION AUDIT
 * Systematic audit of all pages following screen2table methodology
 * Excludes footer as per user request
 */

const fs = require('fs');
const path = require('path');

// Page categories based on screen2table.md
const PAGES_WITH_DATABASE = {
  'Home': {
    files: ['index.html', 'home.html'],
    table: 'home_pages',
    api: '/api/home-page',
    keyPhrases: ['Learn', 'Welcome', 'Start', 'AI Studio', 'Get Started']
  },
  'Courses': {
    files: ['courses.html'],
    table: 'courses', 
    api: '/api/courses',
    keyPhrases: ['Courses', 'Browse', 'Learn', 'Enroll', 'Programming']
  },
  'Course Detail': {
    files: ['detail_courses.html'],
    table: 'courses',
    api: '/api/courses/:id',
    keyPhrases: ['Course Details', 'Duration', 'Curriculum', 'Instructor']
  },
  'Teachers': {
    files: ['teachers.html'],
    table: 'teachers',
    api: '/api/teachers',
    keyPhrases: ['Teachers', 'Learn from', 'Industry Experts', 'Instructors']
  },
  'Blog': {
    files: ['blog.html'],
    table: 'blog_posts',
    api: '/api/blog-posts',
    keyPhrases: ['Blog', 'Articles', 'Latest', 'Read More']
  },
  'Career Center': {
    files: ['career-center.html'],
    table: 'career_center_pages',
    api: '/api/career-center-page',
    keyPhrases: ['Career', 'Services', 'Resume', 'Interview', 'Job']
  },
  'Career Orientation': {
    files: ['career-orientation.html'],
    table: 'career_orientation_pages',
    api: '/api/career-orientation-page',
    keyPhrases: ['Career', 'Assessment', 'Guidance', 'Path', 'Future']
  },
  'About': {
    files: ['about.html'],
    table: 'about_pages',
    api: '/api/about-page',
    keyPhrases: ['About', 'Mission', 'Vision', 'Team', 'Story']
  }
};

// Russian translations for key phrases
const RUSSIAN_TRANSLATIONS = {
  'Learn': 'Изучайте|Изучать|Обучение',
  'Teachers': 'Преподаватели|Учителя',
  'Industry Experts': 'Эксперты Индустрии|экспертов индустрии',
  'Courses': 'Курсы',
  'Career': 'Карьера|Карьерные',
  'About': 'О нас|О компании',
  'Blog': 'Блог',
  'Welcome': 'Добро пожаловать',
  'Start': 'Начать|Начало',
  'Browse': 'Просмотр|Просмотреть',
  'Services': 'Услуги|Сервисы'
};

class RussianTranslationAuditor {
  constructor() {
    this.results = {
      audited: [],
      issues: [],
      summary: {
        total: 0,
        translated: 0,
        needsWork: 0,
        missing: 0
      }
    };
  }

  async auditAllPages() {
    console.log('🔍 ULTRATHINK RUSSIAN TRANSLATION AUDIT');
    console.log('=========================================');
    console.log('Following screen2table.md methodology (excluding footer)\n');

    for (const [pageType, config] of Object.entries(PAGES_WITH_DATABASE)) {
      await this.auditPageType(pageType, config);
    }

    this.generateReport();
  }

  async auditPageType(pageType, config) {
    console.log(`\n📋 Auditing: ${pageType}`);
    console.log(`   Table: ${config.table} | API: ${config.api}`);

    for (const filename of config.files) {
      await this.auditPage(pageType, filename, config);
    }
  }

  async auditPage(pageType, filename, config) {
    const ruPath = path.join(__dirname, 'ru', filename);
    const distRuPath = path.join(__dirname, 'dist', 'ru', filename);
    
    // Check which files exist
    const ruExists = fs.existsSync(ruPath);
    const distRuExists = fs.existsSync(distRuPath);

    console.log(`\n   📄 ${filename}:`);
    console.log(`      ru/${filename}: ${ruExists ? '✅' : '❌'}`);
    console.log(`      dist/ru/${filename}: ${distRuExists ? '✅' : '❌'}`);

    if (!ruExists && !distRuExists) {
      this.addIssue(pageType, filename, 'MISSING', 'No Russian version exists');
      return;
    }

    // Check content of existing files
    const filesToCheck = [];
    if (ruExists) filesToCheck.push({ path: ruPath, type: 'ru' });
    if (distRuExists) filesToCheck.push({ path: distRuPath, type: 'dist/ru' });

    for (const file of filesToCheck) {
      await this.analyzeFileContent(pageType, filename, file, config);
    }
  }

  async analyzeFileContent(pageType, filename, file, config) {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      
      // Check HTML lang attribute
      const langMatch = content.match(/lang="([^"]+)"/);
      const htmlLang = langMatch ? langMatch[1] : 'unknown';
      
      console.log(`      ${file.type} lang="${htmlLang}"`);

      // Count Russian vs English key phrases
      const analysis = this.analyzeTranslationStatus(content, config.keyPhrases);
      
      console.log(`      Translation Status: ${analysis.status}`);
      console.log(`      Russian phrases: ${analysis.russianCount}`);
      console.log(`      English phrases: ${analysis.englishCount}`);

      // Record results
      this.results.audited.push({
        pageType,
        filename,
        filePath: file.type,
        htmlLang,
        translationStatus: analysis.status,
        russianCount: analysis.russianCount,
        englishCount: analysis.englishCount,
        issues: analysis.issues
      });

      this.results.summary.total++;

      if (analysis.status === 'FULLY_TRANSLATED') {
        this.results.summary.translated++;
      } else if (analysis.status === 'PARTIALLY_TRANSLATED') {
        this.results.summary.needsWork++;
        this.addIssue(pageType, filename, 'PARTIAL', `${file.type}: ${analysis.issues.join(', ')}`);
      } else {
        this.results.summary.needsWork++;
        this.addIssue(pageType, filename, 'NOT_TRANSLATED', `${file.type}: Still in English`);
      }

    } catch (error) {
      console.log(`      ❌ Error reading file: ${error.message}`);
      this.addIssue(pageType, filename, 'ERROR', `Cannot read ${file.type}: ${error.message}`);
    }
  }

  analyzeTranslationStatus(content, keyPhrases) {
    let russianCount = 0;
    let englishCount = 0;
    const issues = [];

    // Check for Russian text patterns (Cyrillic)
    const cyrillicMatches = content.match(/[а-яА-Я]/g);
    const hasCyrillic = cyrillicMatches && cyrillicMatches.length > 100; // Significant Russian content

    // Check specific key phrases
    for (const phrase of keyPhrases) {
      const englishRegex = new RegExp(phrase, 'gi');
      const englishMatches = content.match(englishRegex);
      
      if (englishMatches) {
        englishCount += englishMatches.length;
        
        // Check if there's a Russian equivalent nearby
        const russianEquivalent = RUSSIAN_TRANSLATIONS[phrase];
        if (russianEquivalent) {
          const russianRegex = new RegExp(russianEquivalent, 'gi');
          const russianMatches = content.match(russianRegex);
          if (russianMatches) {
            russianCount += russianMatches.length;
          } else {
            issues.push(`"${phrase}" not translated`);
          }
        }
      }
    }

    // Determine overall status
    let status;
    if (russianCount > 0 && englishCount === 0) {
      status = 'FULLY_TRANSLATED';
    } else if (russianCount > 0 && englishCount > 0) {
      status = 'PARTIALLY_TRANSLATED';
    } else if (hasCyrillic && russianCount === 0) {
      status = 'PARTIALLY_TRANSLATED'; // Has some Russian but not key phrases
    } else {
      status = 'NOT_TRANSLATED';
    }

    return {
      status,
      russianCount,
      englishCount,
      issues,
      hasCyrillic
    };
  }

  addIssue(pageType, filename, severity, description) {
    this.results.issues.push({
      pageType,
      filename,
      severity,
      description
    });
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RUSSIAN TRANSLATION AUDIT REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`   Total pages audited: ${this.results.summary.total}`);
    console.log(`   Fully translated: ${this.results.summary.translated}`);
    console.log(`   Need work: ${this.results.summary.needsWork}`);
    console.log(`   Missing files: ${this.results.summary.missing}`);

    console.log(`\n🚨 ISSUES FOUND (${this.results.issues.length}):`);
    
    // Group issues by severity
    const critical = this.results.issues.filter(i => i.severity === 'MISSING');
    const major = this.results.issues.filter(i => i.severity === 'NOT_TRANSLATED');
    const minor = this.results.issues.filter(i => i.severity === 'PARTIAL');

    if (critical.length > 0) {
      console.log(`\n   🔴 CRITICAL - Missing Files (${critical.length}):`);
      critical.forEach(issue => {
        console.log(`      ${issue.pageType}/${issue.filename}: ${issue.description}`);
      });
    }

    if (major.length > 0) {
      console.log(`\n   🟡 MAJOR - Not Translated (${major.length}):`);
      major.forEach(issue => {
        console.log(`      ${issue.pageType}/${issue.filename}: ${issue.description}`);
      });
    }

    if (minor.length > 0) {
      console.log(`\n   🟢 MINOR - Partially Translated (${minor.length}):`);
      minor.forEach(issue => {
        console.log(`      ${issue.pageType}/${issue.filename}: ${issue.description}`);
      });
    }

    // Save detailed report
    const reportPath = path.join(__dirname, 'russian-translation-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved: ${reportPath}`);

    console.log('\n='.repeat(60));
    console.log('🎯 AUDIT COMPLETE - Ready for ULTRATHINK fixes!');
    console.log('='.repeat(60));
  }
}

// Run audit
const auditor = new RussianTranslationAuditor();
auditor.auditAllPages().catch(console.error);