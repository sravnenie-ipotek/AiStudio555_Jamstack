#!/usr/bin/env node

/**
 * COMPREHENSIVE RUSSIAN TRANSLATION CHECKER
 * ULTRATHINK approach - check everything twice, be thorough not fast
 * Follow screen2table.md methodology (EXCEPT footer)
 */

const fs = require('fs');
const path = require('path');

// Based on screen2table.md - pages that need database-backed translations
const CRITICAL_PAGES = {
  'HOME': {
    files: ['index.html', 'home.html'], 
    priority: 1,
    expectedPhrases: ['Welcome', 'Learn', 'Start', 'Get Started', 'AI Studio', 'Sign Up', 'Browse', 'Courses'],
    russianEquivalents: {
      'Welcome': 'Добро пожаловать',
      'Learn': 'Изучайте|Изучать|Обучение',
      'Start': 'Начать|Начало',
      'Get Started': 'Начать обучение|Приступить',
      'Sign Up': 'Записаться|Регистрация',
      'Browse': 'Просмотреть|Обзор',
      'Courses': 'Курсы'
    }
  },
  'COURSES': {
    files: ['courses.html'],
    priority: 2, 
    expectedPhrases: ['Courses', 'Browse', 'Learn', 'Enroll', 'Programming', 'Duration', 'Level'],
    russianEquivalents: {
      'Courses': 'Курсы',
      'Browse': 'Просмотреть|Обзор', 
      'Learn': 'Изучайте|Изучать|Обучение',
      'Enroll': 'Записаться|Зарегистрироваться',
      'Programming': 'Программирование',
      'Duration': 'Продолжительность',
      'Level': 'Уровень'
    }
  },
  'TEACHERS': {
    files: ['teachers.html'],
    priority: 2,
    expectedPhrases: ['Teachers', 'Learn from', 'Industry Experts', 'Instructors', 'Meet'],
    russianEquivalents: {
      'Teachers': 'Преподаватели|Учителя',
      'Learn from': 'Изучайте у|Обучайтесь у',
      'Industry Experts': 'Эксперты Индустрии|экспертов индустрии',
      'Instructors': 'Преподаватели|Инструкторы',
      'Meet': 'Познакомьтесь'
    }
  },
  'CAREER_CENTER': {
    files: ['career-center.html'],
    priority: 3,
    expectedPhrases: ['Career', 'Services', 'Resume', 'Interview', 'Job', 'Professional'],
    russianEquivalents: {
      'Career': 'Карьера|Карьерные',
      'Services': 'Услуги|Сервисы',
      'Resume': 'Резюме',
      'Interview': 'Собеседование',
      'Job': 'Работа|Вакансия',
      'Professional': 'Профессиональный'
    }
  },
  'CAREER_ORIENTATION': {
    files: ['career-orientation.html'],
    priority: 3,
    expectedPhrases: ['Career', 'Assessment', 'Guidance', 'Path', 'Future', 'Orientation'],
    russianEquivalents: {
      'Career': 'Карьера|Карьерные',
      'Assessment': 'Оценка|Тестирование',
      'Guidance': 'Руководство|Наставничество',
      'Path': 'Путь|Направление',
      'Future': 'Будущее',
      'Orientation': 'Ориентация'
    }
  },
  'BLOG': {
    files: ['blog.html'],
    priority: 4,
    expectedPhrases: ['Blog', 'Articles', 'Latest', 'Read More', 'News'],
    russianEquivalents: {
      'Blog': 'Блог',
      'Articles': 'Статьи',
      'Latest': 'Последние|Новые',
      'Read More': 'Читать далее|Подробнее',
      'News': 'Новости'
    }
  },
  'ABOUT': {
    files: ['about.html'],
    priority: 4,
    expectedPhrases: ['About', 'Mission', 'Vision', 'Team', 'Story', 'Company'],
    russianEquivalents: {
      'About': 'О нас|О компании',
      'Mission': 'Миссия',
      'Vision': 'Видение',
      'Team': 'Команда',
      'Story': 'История',
      'Company': 'Компания'
    }
  },
  'COURSE_DETAIL': {
    files: ['detail_courses.html'],
    priority: 5,
    expectedPhrases: ['Course Details', 'Duration', 'Curriculum', 'Instructor', 'Enroll'],
    russianEquivalents: {
      'Course Details': 'Детали курса|О курсе',
      'Duration': 'Продолжительность',
      'Curriculum': 'Программа|Учебный план',
      'Instructor': 'Преподаватель',
      'Enroll': 'Записаться'
    }
  }
};

class ComprehensiveTranslationChecker {
  constructor() {
    this.results = {
      firstPass: {},
      secondPass: {},
      issues: [],
      summary: {
        totalFiles: 0,
        needsTranslation: [],
        missingFiles: [],
        partiallyDone: [],
        complete: []
      }
    };
    this.passNumber = 1;
  }

  async runComprehensiveCheck() {
    console.log('🎯 ULTRATHINK RUSSIAN TRANSLATION - COMPREHENSIVE CHECK');
    console.log('====================================================');
    console.log('Following screen2table.md methodology (EXCEPT footer)');
    console.log('Checking ALL pages TWICE - being thorough not fast\n');

    // FIRST PASS - Detailed analysis
    console.log('🔍 FIRST PASS - Initial Analysis');
    console.log('='.repeat(40));
    this.passNumber = 1;
    await this.checkAllPages();
    this.results.firstPass = JSON.parse(JSON.stringify(this.results.summary));

    // SECOND PASS - Verification 
    console.log('\n🔍 SECOND PASS - Verification & Double-Check');
    console.log('='.repeat(40));
    this.passNumber = 2;
    this.results.summary = {
      totalFiles: 0,
      needsTranslation: [],
      missingFiles: [],
      partiallyDone: [],
      complete: []
    };
    this.results.issues = [];
    
    await this.checkAllPages();
    this.results.secondPass = JSON.parse(JSON.stringify(this.results.summary));

    this.generateComprehensiveReport();
  }

  async checkAllPages() {
    // Sort by priority - most critical first
    const sortedPages = Object.entries(CRITICAL_PAGES)
      .sort(([,a], [,b]) => a.priority - b.priority);

    for (const [pageType, config] of sortedPages) {
      console.log(`\n📋 [PASS ${this.passNumber}] Checking: ${pageType} (Priority ${config.priority})`);
      await this.checkPageType(pageType, config);
    }
  }

  async checkPageType(pageType, config) {
    for (const filename of config.files) {
      await this.checkFile(pageType, filename, config);
    }
  }

  async checkFile(pageType, filename, config) {
    console.log(`\n   📄 ${filename}:`);
    
    // Check both locations
    const locations = [
      { path: path.join(__dirname, 'ru', filename), type: 'ru' },
      { path: path.join(__dirname, 'dist', 'ru', filename), type: 'dist/ru' }
    ];

    let hasRussianVersion = false;
    let bestTranslationStatus = 'MISSING';

    for (const location of locations) {
      const exists = fs.existsSync(location.path);
      console.log(`      ${location.type}/${filename}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
      
      this.results.summary.totalFiles++;

      if (!exists) {
        this.results.summary.missingFiles.push(`${pageType}/${location.type}/${filename}`);
        this.addIssue('CRITICAL', pageType, filename, `Missing ${location.type}/${filename}`);
        continue;
      }

      hasRussianVersion = true;
      const analysis = await this.analyzeFileTranslation(location.path, filename, config);
      console.log(`      ${location.type} Status: ${analysis.status}`);
      console.log(`      ${location.type} Lang: ${analysis.htmlLang}`);
      console.log(`      ${location.type} Russian Phrases: ${analysis.russianPhrases}`);
      console.log(`      ${location.type} English Phrases: ${analysis.englishPhrases}`);

      if (analysis.issues.length > 0) {
        console.log(`      ${location.type} Issues: ${analysis.issues.slice(0, 3).join(', ')}${analysis.issues.length > 3 ? '...' : ''}`);
      }

      // Track best status for this file
      if (analysis.status === 'FULLY_TRANSLATED') {
        bestTranslationStatus = 'FULLY_TRANSLATED';
      } else if (analysis.status === 'PARTIALLY_TRANSLATED' && bestTranslationStatus !== 'FULLY_TRANSLATED') {
        bestTranslationStatus = 'PARTIALLY_TRANSLATED';
      } else if (bestTranslationStatus === 'MISSING') {
        bestTranslationStatus = 'NOT_TRANSLATED';
      }

      // Record issues
      for (const issue of analysis.issues) {
        this.addIssue('MAJOR', pageType, filename, `${location.type}: ${issue}`);
      }
    }

    // Categorize overall file status
    const fileKey = `${pageType}/${filename}`;
    if (!hasRussianVersion) {
      // Already handled in missing files
    } else if (bestTranslationStatus === 'FULLY_TRANSLATED') {
      this.results.summary.complete.push(fileKey);
    } else if (bestTranslationStatus === 'PARTIALLY_TRANSLATED') {
      this.results.summary.partiallyDone.push(fileKey);
    } else {
      this.results.summary.needsTranslation.push(fileKey);
    }
  }

  async analyzeFileTranslation(filePath, filename, config) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check HTML lang attribute
      const langMatch = content.match(/lang="([^"]+)"/);
      const htmlLang = langMatch ? langMatch[1] : 'unknown';

      // Count Russian vs English phrases
      let russianPhrases = 0;
      let englishPhrases = 0;
      const issues = [];

      // Check for general Russian content (Cyrillic characters)
      const cyrillicMatches = content.match(/[а-яА-Я]/g);
      const hasCyrillic = cyrillicMatches && cyrillicMatches.length > 50;

      // Check specific expected phrases
      for (const englishPhrase of config.expectedPhrases) {
        const englishRegex = new RegExp(`\\b${englishPhrase}\\b`, 'gi');
        const englishMatches = content.match(englishRegex);
        
        if (englishMatches) {
          englishPhrases += englishMatches.length;
          
          // Check if Russian equivalent exists
          const russianPattern = config.russianEquivalents[englishPhrase];
          if (russianPattern) {
            const russianRegex = new RegExp(russianPattern, 'gi');
            const russianMatches = content.match(russianRegex);
            
            if (russianMatches) {
              russianPhrases += russianMatches.length;
            } else {
              issues.push(`"${englishPhrase}" not translated`);
            }
          }
        }
      }

      // Check HTML lang attribute
      if (htmlLang !== 'ru') {
        issues.push(`HTML lang="${htmlLang}" should be "ru"`);
      }

      // Determine translation status
      let status;
      if (russianPhrases > 0 && englishPhrases === 0) {
        status = 'FULLY_TRANSLATED';
      } else if (russianPhrases > 0 && englishPhrases > 0) {
        status = 'PARTIALLY_TRANSLATED';
      } else if (hasCyrillic) {
        status = 'PARTIALLY_TRANSLATED'; // Some Russian but not key phrases
      } else {
        status = 'NOT_TRANSLATED';
      }

      return {
        status,
        htmlLang,
        russianPhrases,
        englishPhrases,
        hasCyrillic,
        issues
      };

    } catch (error) {
      return {
        status: 'ERROR',
        htmlLang: 'error',
        russianPhrases: 0,
        englishPhrases: 0,
        hasCyrillic: false,
        issues: [`Cannot read file: ${error.message}`]
      };
    }
  }

  addIssue(severity, pageType, filename, description) {
    this.results.issues.push({
      pass: this.passNumber,
      severity,
      pageType,
      filename,
      description
    });
  }

  generateComprehensiveReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE RUSSIAN TRANSLATION REPORT');
    console.log('='.repeat(80));

    console.log(`\n🔍 FIRST PASS vs SECOND PASS COMPARISON:`);
    console.log(`   Files Analyzed: ${this.results.firstPass.totalFiles} → ${this.results.secondPass.totalFiles}`);
    console.log(`   Complete: ${this.results.firstPass.complete.length} → ${this.results.secondPass.complete.length}`);
    console.log(`   Partial: ${this.results.firstPass.partiallyDone.length} → ${this.results.secondPass.partiallyDone.length}`);
    console.log(`   Need Work: ${this.results.firstPass.needsTranslation.length} → ${this.results.secondPass.needsTranslation.length}`);
    console.log(`   Missing: ${this.results.firstPass.missingFiles.length} → ${this.results.secondPass.missingFiles.length}`);

    console.log(`\n🚨 CRITICAL FINDINGS:`);
    
    if (this.results.secondPass.missingFiles.length > 0) {
      console.log(`\n   🔴 MISSING FILES (${this.results.secondPass.missingFiles.length}):`);
      this.results.secondPass.missingFiles.forEach(file => {
        console.log(`      ❌ ${file}`);
      });
    }

    if (this.results.secondPass.needsTranslation.length > 0) {
      console.log(`\n   🟡 NOT TRANSLATED (${this.results.secondPass.needsTranslation.length}):`);
      this.results.secondPass.needsTranslation.forEach(file => {
        console.log(`      ❌ ${file}`);
      });
    }

    if (this.results.secondPass.partiallyDone.length > 0) {
      console.log(`\n   🟠 PARTIALLY TRANSLATED (${this.results.secondPass.partiallyDone.length}):`);
      this.results.secondPass.partiallyDone.forEach(file => {
        console.log(`      ⚠️  ${file}`);
      });
    }

    if (this.results.secondPass.complete.length > 0) {
      console.log(`\n   ✅ FULLY TRANSLATED (${this.results.secondPass.complete.length}):`);
      this.results.secondPass.complete.forEach(file => {
        console.log(`      ✅ ${file}`);
      });
    }

    // Priority-based action plan
    console.log(`\n🎯 ULTRATHINK ACTION PLAN (by Priority):`);
    const sortedPages = Object.entries(CRITICAL_PAGES)
      .sort(([,a], [,b]) => a.priority - b.priority);

    sortedPages.forEach(([pageType, config]) => {
      const pageFiles = config.files;
      const incomplete = pageFiles.filter(file => {
        const fileKey = `${pageType}/${file}`;
        return !this.results.secondPass.complete.includes(fileKey);
      });

      if (incomplete.length > 0) {
        console.log(`\n   Priority ${config.priority} - ${pageType}:`);
        incomplete.forEach(file => {
          console.log(`      🔧 Fix: ${file}`);
        });
      }
    });

    // Save comprehensive report
    const reportPath = path.join(__dirname, 'comprehensive-translation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Comprehensive report saved: ${reportPath}`);

    console.log('\n' + '='.repeat(80));
    console.log('🎯 COMPREHENSIVE CHECK COMPLETE - Ready for SYSTEMATIC FIXES!');
    console.log('='.repeat(80));
  }
}

// Run comprehensive check
const checker = new ComprehensiveTranslationChecker();
checker.runComprehensiveCheck().catch(console.error);