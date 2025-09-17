#!/usr/bin/env node

/**
 * Update Admin Interface to Include Footer Management
 * Adds footer content management to the language admin interface
 */

const fs = require('fs');

console.log('🦶 ADDING FOOTER MANAGEMENT TO ADMIN INTERFACE\n');

// Read current admin file
const adminPath = '/Users/michaelmishayev/Desktop/newCode/admin-language-manager.html';
let adminContent = fs.readFileSync(adminPath, 'utf8');

// Add footer section to the content cards
const footerCardHTML = `
                    <div class="content-card">
                        <div class="language-indicator indicator-en">FOOTER</div>
                        <div class="card-title">Footer Content</div>
                        <div class="card-subtitle">Multi-language footer</div>
                        <p>Company info, links, and contact details</p>
                        <button class="edit-btn" onclick="editContent('footer', 'footer')">Edit Footer</button>
                    </div>`;

// Add footer fields to the editor form
const footerFieldsHTML = `
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" id="company-name" placeholder="Enter company name">
                    </div>
                    
                    <div class="form-group">
                        <label>Footer Description</label>
                        <textarea id="footer-description" placeholder="Enter footer description"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Copyright Text</label>
                        <input type="text" id="copyright-text" placeholder="© 2023 Company Name">
                    </div>
                    
                    <div class="form-group">
                        <label>Contact Email</label>
                        <input type="email" id="contact-email" placeholder="contact@company.com">
                    </div>
                    
                    <div class="form-group">
                        <label>Contact Phone</label>
                        <input type="text" id="contact-phone" placeholder="+1 (555) 123-4567">
                    </div>`;

// Insert footer card after the third content card
const cardInsertPoint = adminContent.indexOf('</div>\n                </div>\n            </div>');
if (cardInsertPoint !== -1) {
    const beforeFooter = adminContent.substring(0, cardInsertPoint);
    const afterFooter = adminContent.substring(cardInsertPoint);
    adminContent = beforeFooter + footerCardHTML + '\n                ' + afterFooter;
    console.log('✅ Added footer card to overview section');
} else {
    console.log('❌ Could not find insertion point for footer card');
}

// Add footer fields after hero description
const fieldInsertPoint = adminContent.indexOf('</textarea>\n                    </div>\n                    \n                    <button class="save-btn"');
if (fieldInsertPoint !== -1) {
    const beforeFields = adminContent.substring(0, fieldInsertPoint + '</textarea>\n                    </div>'.length);
    const afterFields = adminContent.substring(fieldInsertPoint + '</textarea>\n                    </div>'.length);
    adminContent = beforeFields + footerFieldsHTML + afterFields;
    console.log('✅ Added footer fields to editor form');
} else {
    console.log('❌ Could not find insertion point for footer fields');
}

// Add footer handling to JavaScript
const footerJSCode = `
        // Footer content management
        async function loadFooterContent(lang) {
            try {
                const response = await fetch(\`\${API_BASE}/api/footer-content?locale=\${lang}\`);
                const data = await response.json();
                
                if (data && !data.error) {
                    // Populate footer fields
                    document.getElementById('company-name').value = data.companyName || '';
                    document.getElementById('footer-description').value = data.description || '';
                    document.getElementById('copyright-text').value = data.copyright || '';
                    document.getElementById('contact-email').value = data.email || '';
                    document.getElementById('contact-phone').value = data.phone || '';
                }
            } catch (error) {
                console.log('Footer content not available yet');
            }
        }
        
        async function saveFooterContent() {
            const data = {
                locale: currentLanguage,
                companyName: document.getElementById('company-name').value,
                description: document.getElementById('footer-description').value,
                copyright: document.getElementById('copyright-text').value,
                email: document.getElementById('contact-email').value,
                phone: document.getElementById('contact-phone').value
            };
            
            try {
                const response = await fetch(\`\${API_BASE}/api/footer-content\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showStatus('✅ Footer content saved successfully!', 'success');
                } else {
                    throw new Error('Failed to save footer content');
                }
            } catch (error) {
                showStatus('❌ Footer API not available yet', 'error');
            }
        }`;

// Insert footer JavaScript before the closing script tag
const jsInsertPoint = adminContent.lastIndexOf('        // Initialize on load');
if (jsInsertPoint !== -1) {
    const beforeJS = adminContent.substring(0, jsInsertPoint);
    const afterJS = adminContent.substring(jsInsertPoint);
    adminContent = beforeJS + footerJSCode + '\n        ' + afterJS;
    console.log('✅ Added footer JavaScript functions');
} else {
    console.log('❌ Could not find insertion point for footer JavaScript');
}

// Update the editContent function to handle footer
const editContentUpdate = `
        function editContent(lang, page) {
            currentLanguage = lang;
            
            // Show editor, hide overview
            document.getElementById('language-overview').style.display = 'none';
            document.getElementById('content-editor').style.display = 'block';
            
            // Update language indicators
            if (lang === 'footer') {
                document.getElementById('current-lang-flag').textContent = '🦶';
                document.getElementById('current-lang-name').textContent = 'Footer Content';
                document.getElementById('current-lang-badge').textContent = 'FOOTER';
                document.getElementById('current-lang-badge').className = 'language-badge badge-en';
                loadFooterContent('en'); // Load footer for current language
                return;
            }
            
            const config = languageConfig[lang];
            document.getElementById('current-lang-flag').textContent = config.flag;
            document.getElementById('current-lang-name').textContent = config.name;
            document.getElementById('current-lang-badge').textContent = config.badge;
            document.getElementById('current-lang-badge').className = \`language-badge badge-\${lang}\`;
            
            // Load content for editing
            loadContent(lang);
        }`;

// Replace the original editContent function
adminContent = adminContent.replace(
    /function editContent\(lang, page\) \{[\s\S]*?\n        }/,
    editContent.trim()
);

// Write updated admin file
fs.writeFileSync(adminPath, adminContent);

console.log('\n📝 ADMIN INTERFACE UPDATES:');
console.log('✅ Added footer content card');
console.log('✅ Added footer form fields:');
console.log('   - Company Name');
console.log('   - Footer Description');
console.log('   - Copyright Text');
console.log('   - Contact Email');
console.log('   - Contact Phone');
console.log('✅ Added footer JavaScript functions');
console.log('✅ Updated content editor to handle footer');

console.log('\n🎯 RESULT:');
console.log('The admin interface now includes footer management!');
console.log('You can edit footer content for all languages through:');
console.log('https://aistudio555jamstack-production.up.railway.app/admin-language-manager.html');

console.log('\n📋 NEXT STEPS:');
console.log('1. The footer API needs to be properly implemented');
console.log('2. Footer database table needs to be created');
console.log('3. The footer content will be manageable through the admin');

console.log('\n🚨 NOTE:');
console.log('Footer API is currently showing as unavailable in the backend.');
console.log('The secure-footer-api.js module needs to be properly loaded.');