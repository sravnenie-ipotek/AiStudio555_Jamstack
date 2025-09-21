/**
 * Simple Language Test - Check current state of language switching
 */

const fs = require('fs');

function analyzeLanguageSupport() {
    console.log('🔵 Analyzing Language Support in AI Studio...\n');
    
    const results = {
        timestamp: new Date().toISOString(),
        pages: {},
        issues: [],
        recommendations: []
    };
    
    // Check home.html
    console.log('📄 Checking home.html...');
    results.pages.home = analyzePageFile('home.html');
    
    // Check courses.html
    console.log('📄 Checking courses.html...');
    results.pages.courses = analyzePageFile('courses.html');
    
    // Check teachers.html
    console.log('📄 Checking teachers.html...');
    results.pages.teachers = analyzePageFile('teachers.html');
    
    // Check if language-manager.js exists
    console.log('📄 Checking language-manager.js...');
    results.languageManagerExists = fs.existsSync('js/language-manager.js');
    
    // Generate summary
    generateAnalysisReport(results);
    
    return results;
}

function analyzePageFile(filename) {
    const analysis = {
        filename,
        exists: false,
        hasDesktopPills: false,
        hasMobilePills: false,
        hasLanguageManager: false,
        hasDataI18n: false,
        dataI18nCount: 0,
        issues: []
    };
    
    try {
        const content = fs.readFileSync(filename, 'utf8');
        analysis.exists = true;
        
        // Check for language pills
        analysis.hasDesktopPills = content.includes('lang-pill') && content.includes('setActivePill');
        analysis.hasMobilePills = content.includes('mobile-lang-pill') && content.includes('setActivePill');
        
        // Check for language manager script
        analysis.hasLanguageManager = content.includes('language-manager.js');
        
        // Check for data-i18n attributes
        const i18nMatches = content.match(/data-i18n="[^"]+"/g);
        analysis.hasDataI18n = i18nMatches && i18nMatches.length > 0;
        analysis.dataI18nCount = i18nMatches ? i18nMatches.length : 0;
        
        // Identify issues
        if (!analysis.hasDesktopPills) {
            analysis.issues.push('Missing desktop language pills (.lang-pill)');
        }
        if (!analysis.hasMobilePills) {
            analysis.issues.push('Missing mobile language pills (.mobile-lang-pill)');
        }
        if (!analysis.hasLanguageManager) {
            analysis.issues.push('Missing language-manager.js script');
        }
        if (!analysis.hasDataI18n) {
            analysis.issues.push('No data-i18n attributes found');
        }
        
        console.log(`  ✅ ${filename} analyzed: ${analysis.issues.length} issues found`);
        
    } catch (error) {
        analysis.issues.push(`Cannot read file: ${error.message}`);
        console.log(`  ❌ ${filename}: ${error.message}`);
    }
    
    return analysis;
}

function generateAnalysisReport(results) {
    console.log('\n📊 LANGUAGE SUPPORT ANALYSIS REPORT');
    console.log('===================================');
    console.log(`Timestamp: ${results.timestamp}\n`);
    
    // Page-by-page analysis
    Object.entries(results.pages).forEach(([pageName, analysis]) => {
        console.log(`📄 ${pageName.toUpperCase()} PAGE (${analysis.filename}):`);
        console.log(`   Exists: ${analysis.exists ? '✅' : '❌'}`);
        console.log(`   Desktop Pills: ${analysis.hasDesktopPills ? '✅' : '❌'}`);
        console.log(`   Mobile Pills: ${analysis.hasMobilePills ? '✅' : '❌'}`);
        console.log(`   Language Manager: ${analysis.hasLanguageManager ? '✅' : '❌'}`);
        console.log(`   i18n Attributes: ${analysis.hasDataI18n ? '✅' : '❌'} (${analysis.dataI18nCount} found)`);
        
        if (analysis.issues.length > 0) {
            console.log(`   Issues:`);
            analysis.issues.forEach(issue => console.log(`     ❌ ${issue}`));
        }
        console.log('');
    });
    
    // Language Manager
    console.log(`🔧 LANGUAGE MANAGER:`);
    console.log(`   js/language-manager.js exists: ${results.languageManagerExists ? '✅' : '❌'}\n`);
    
    // Critical Issues Summary
    const criticalIssues = [];
    
    Object.values(results.pages).forEach(page => {
        if (page.exists && page.issues.length > 0) {
            criticalIssues.push(...page.issues.map(issue => `${page.filename}: ${issue}`));
        }
    });
    
    if (!results.languageManagerExists) {
        criticalIssues.push('Language manager script missing');
    }
    
    if (criticalIssues.length > 0) {
        console.log('🚨 CRITICAL ISSUES:');
        criticalIssues.forEach(issue => console.log(`   ❌ ${issue}`));
        console.log('');
    }
    
    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    
    // Teachers page specific issues
    const teachersPage = results.pages.teachers;
    if (teachersPage.exists && (!teachersPage.hasDesktopPills || !teachersPage.hasMobilePills)) {
        console.log('   🔧 Add language pills to teachers.html page');
    }
    
    // Language manager issues
    if (!results.languageManagerExists) {
        console.log('   🔧 Ensure js/language-manager.js is loaded on all pages');
    }
    
    // Data-i18n issues
    Object.entries(results.pages).forEach(([pageName, page]) => {
        if (page.exists && page.dataI18nCount < 10) {
            console.log(`   🔧 Add more data-i18n attributes to ${page.filename} (only ${page.dataI18nCount} found)`);
        }
    });
    
    // Save detailed report
    fs.writeFileSync('language-analysis-report.json', JSON.stringify(results, null, 2));
    console.log('\n📄 Detailed report saved to: language-analysis-report.json');
}

// Run the analysis
if (require.main === module) {
    analyzeLanguageSupport();
}

module.exports = { analyzeLanguageSupport };
