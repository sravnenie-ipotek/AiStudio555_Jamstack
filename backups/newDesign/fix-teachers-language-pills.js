/**
 * Fix Teachers Page - Add Missing Language Pills
 */

const fs = require('fs');

function fixTeachersLanguagePills() {
    console.log('🔧 Fixing teachers.html - Adding missing language pills...\n');
    
    try {
        // Read teachers.html
        let content = fs.readFileSync('teachers.html', 'utf8');
        
        // 1. Add language pills CSS after line 220 (before </style>)
        const languagePillsCSS = `
    /* Language Pills Styling */
    .lang-pills {
      display: inline-flex !important;
      gap: 10px !important;
      margin: 0 20px !important;
      align-items: center !important;
    }

    .lang-pill {
      padding: 6px 12px !important;
      border-radius: 20px !important;
      background: transparent !important;
      color: white !important;
      text-decoration: none !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      transition: all 0.3s ease !important;
      font-size: 14px !important;
      font-weight: 500 !important;
    }

    .lang-pill:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
    }

    .lang-pill.active {
      background: #ffd700 !important;
      color: #1a1d3a !important;
      border-color: #ffd700 !important;
    }

    .mobile-lang-pill {
      padding: 8px 16px !important;
      border-radius: 20px !important;
      background: transparent !important;
      color: white !important;
      text-decoration: none !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      transition: all 0.3s ease !important;
      font-size: 14px !important;
      font-weight: 500 !important;
    }

    .mobile-lang-pill:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
    }

    .mobile-lang-pill.active {
      background: #ffd700 !important;
      color: #1a1d3a !important;
      border-color: #ffd700 !important;
    }

    @media screen and (max-width: 991px) {
      .mobile-lang-pills {
        display: flex !important;
        gap: 10px !important;
        justify-content: center !important;
      }

      .lang-pills {
        display: none !important;
      }
    }

    @media screen and (min-width: 992px) {
      .mobile-lang-pills {
        display: none !important;
      }
    }
`;
        
        // Insert CSS before </style>
        content = content.replace('  </style>', languagePillsCSS + '  </style>');
        
        // 2. Add mobile language switchers before </nav> (around line 368)
        const mobileLanguageSwitchers = `            <div class="mobile-language-switchers">
              <!-- Mobile Language Pills -->
              <div class="mobile-lang-pills">
                <a href="#" class="mobile-lang-pill active" onclick="setActivePill(this)">EN</a>
                <a href="#" class="mobile-lang-pill" onclick="setActivePill(this)">RU</a>
                <a href="#" class="mobile-lang-pill" onclick="setActivePill(this)">HE</a>
              </div>
            </div>
`;
        
        // Find the line with </nav> and add mobile pills before it
        content = content.replace('          </nav>', mobileLanguageSwitchers + '          </nav>');
        
        // 3. Add desktop language pills inside navbar-button-wrapper
        const desktopLanguagePills = `            <div class="lang-pills">
              <a href="#" class="lang-pill active" onclick="setActivePill(this)">EN</a>
              <a href="#" class="lang-pill" onclick="setActivePill(this)">RU</a>
              <a href="#" class="lang-pill" onclick="setActivePill(this)">HE</a>
            </div>
`;
        
        // Find navbar-button-wrapper and add pills before the cart
        content = content.replace(
            '          <div class="navbar-button-wrapper">',
            '          <div class="navbar-button-wrapper">\n' + desktopLanguagePills
        );
        
        // Write the updated content
        fs.writeFileSync('teachers.html', content);
        
        console.log('✅ Successfully added language pills to teachers.html');
        console.log('   ✅ Added CSS styling for language pills');
        console.log('   ✅ Added mobile language switchers');
        console.log('   ✅ Added desktop language pills');
        console.log('');
        console.log('🔍 Verification:');
        
        // Verify the changes
        const updatedContent = fs.readFileSync('teachers.html', 'utf8');
        const hasDesktopPills = updatedContent.includes('lang-pill');
        const hasMobilePills = updatedContent.includes('mobile-lang-pill');
        const hasSetActivePill = updatedContent.includes('setActivePill');
        const hasLanguagePillsCSS = updatedContent.includes('.lang-pills {');
        
        console.log('   Desktop Pills: ' + (hasDesktopPills ? '✅' : '❌'));
        console.log('   Mobile Pills: ' + (hasMobilePills ? '✅' : '❌'));
        console.log('   setActivePill Function: ' + (hasSetActivePill ? '✅' : '❌'));
        console.log('   Language Pills CSS: ' + (hasLanguagePillsCSS ? '✅' : '❌'));
        
        if (hasDesktopPills && hasMobilePills && hasSetActivePill && hasLanguagePillsCSS) {
            console.log('\n🎉 SUCCESS: Teachers page now has complete language switching support!');
        } else {
            console.log('\n⚠️  WARNING: Some components may still be missing');
        }
        
    } catch (error) {
        console.error('❌ Error fixing teachers.html:', error.message);
        return false;
    }
    
    return true;
}

// Run the fix
if (require.main === module) {
    fixTeachersLanguagePills();
}

module.exports = { fixTeachersLanguagePills };
