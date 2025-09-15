/**
 * FAQ JSON Enhancement for Admin Panel
 * Adds support for editing FAQ items as JSON while maintaining backward compatibility
 */

// Add this script to content-admin-comprehensive.html

// Enhanced FAQ Management with JSON support
class FAQJSONManager {
    constructor() {
        this.faqItems = [];
        this.currentEditIndex = -1;
    }

    // Initialize the FAQ JSON editor
    init() {
        // Check if we're on a page that has FAQ management
        const faqSection = document.getElementById('faqs');
        if (!faqSection) return;

        // Add JSON editor UI
        this.addJSONEditorUI();

        // Load existing FAQ data
        this.loadFAQData();
    }

    // Add JSON editor interface to the admin panel
    addJSONEditorUI() {
        const faqSection = document.getElementById('faqs');

        // Create JSON editor section
        const jsonEditorHTML = `
            <div class="json-faq-editor" style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
                <h3>📝 FAQ JSON Editor (Advanced)</h3>
                <p style="color: #666; margin-bottom: 15px;">Edit FAQs as JSON for bulk operations</p>

                <div style="display: flex; gap: 20px;">
                    <!-- Visual Editor -->
                    <div style="flex: 1;">
                        <h4>Visual Editor</h4>
                        <div id="faq-items-list" style="max-height: 400px; overflow-y: auto;">
                            <!-- FAQ items will be rendered here -->
                        </div>
                        <button class="btn" onclick="faqManager.addNewFAQ()" style="margin-top: 10px;">➕ Add FAQ</button>
                    </div>

                    <!-- JSON Editor -->
                    <div style="flex: 1;">
                        <h4>JSON Editor</h4>
                        <textarea id="faq-json-editor" style="width: 100%; height: 400px; font-family: monospace; font-size: 12px;"></textarea>
                        <div style="margin-top: 10px;">
                            <button class="btn" onclick="faqManager.applyJSON()">✅ Apply JSON</button>
                            <button class="btn-secondary btn" onclick="faqManager.formatJSON()">🎨 Format</button>
                            <button class="btn-secondary btn" onclick="faqManager.validateJSON()">✔️ Validate</button>
                        </div>
                    </div>
                </div>

                <div id="faq-json-status" style="margin-top: 15px;"></div>
            </div>
        `;

        // Insert after existing FAQ section
        faqSection.insertAdjacentHTML('beforeend', jsonEditorHTML);
    }

    // Load FAQ data from the current page data
    async loadFAQData() {
        try {
            // Try to get FAQ data from the page
            const pageData = await this.getCurrentPageData();

            if (pageData.faq_items) {
                // New JSON format
                this.faqItems = JSON.parse(pageData.faq_items);
            } else if (pageData.faq_1_title) {
                // Legacy format - convert to JSON
                this.faqItems = this.convertLegacyFAQs(pageData);
            } else {
                // Default FAQs
                this.faqItems = this.getDefaultFAQs();
            }

            this.renderFAQs();
            this.updateJSONEditor();
        } catch (error) {
            console.error('Error loading FAQ data:', error);
            this.showStatus('Error loading FAQ data', 'error');
        }
    }

    // Get current page data (home, courses, etc.)
    async getCurrentPageData() {
        // This should integrate with your existing data loading
        // For now, return mock data
        return window.currentPageData || {};
    }

    // Convert legacy FAQ format to JSON
    convertLegacyFAQs(data) {
        const faqs = [];
        for (let i = 1; i <= 6; i++) {
            const title = data[`faq_${i}_title`];
            const answer = data[`faq_${i}_answer`];
            if (title || answer) {
                faqs.push({
                    title: title || `Question ${i}`,
                    answer: answer || 'Answer pending...'
                });
            }
        }
        return faqs.length > 0 ? faqs : this.getDefaultFAQs();
    }

    // Get default FAQs based on locale
    getDefaultFAQs() {
        const locale = document.getElementById('currentLocale')?.value || 'en';

        const defaults = {
            en: [
                { title: 'What courses do you offer?', answer: 'We offer comprehensive courses in AI, Machine Learning, Data Science, and Web Development.' },
                { title: 'How long are the courses?', answer: 'Our courses typically range from 8 to 12 weeks, with flexible scheduling options.' },
                { title: 'Do you provide certificates?', answer: 'Yes, all students receive a verified certificate upon successful completion.' },
                { title: 'Is career support included?', answer: 'Absolutely! We provide career guidance, resume reviews, and job placement assistance.' },
                { title: 'What are the prerequisites?', answer: 'Basic computer skills are required. Programming experience is helpful but not mandatory.' },
                { title: 'Can I learn at my own pace?', answer: 'Yes, we offer both self-paced and instructor-led options to suit your schedule.' }
            ],
            he: [
                { title: 'קורסים מוצעים', answer: 'אנו מציעים קורסים מקיפים ב-AI, למידת מכונה, מדע הנתונים ופיתוח אתרים.' },
                { title: 'משך הקורסים', answer: 'הקורסים שלנו נמשכים בדרך כלל בין 8 ל-12 שבועות, עם אפשרויות תזמון גמישות.' },
                { title: 'תעודות והסמכה', answer: 'כן, כל הסטודנטים מקבלים תעודה מאומתת עם השלמה מוצלחת.' },
                { title: 'תמיכה בקריירה', answer: 'בהחלט! אנו מספקים הדרכה קריירה, ביקורות קורות חיים וסיוע בהשמה.' },
                { title: 'דרישות קדם', answer: 'נדרשות מיומנויות מחשב בסיסיות. ניסיון בתכנות מועיל אך לא חובה.' },
                { title: 'למידה בקצב אישי', answer: 'כן, אנו מציעים אפשרויות ללמידה עצמית וגם עם מדריך כדי להתאים ללוח הזמנים שלך.' }
            ],
            ru: [
                { title: 'Какие курсы вы предлагаете?', answer: 'Мы предлагаем комплексные курсы по ИИ, машинному обучению, науке о данных и веб-разработке.' },
                { title: 'Какова продолжительность курсов?', answer: 'Наши курсы обычно длятся от 8 до 12 недель с гибким расписанием.' },
                { title: 'Выдаете ли вы сертификаты?', answer: 'Да, все студенты получают подтвержденный сертификат после успешного завершения.' },
                { title: 'Включена ли поддержка карьеры?', answer: 'Конечно! Мы предоставляем карьерное руководство, проверку резюме и помощь в трудоустройстве.' },
                { title: 'Каковы предварительные требования?', answer: 'Требуются базовые навыки работы с компьютером. Опыт программирования полезен, но не обязателен.' },
                { title: 'Могу ли я учиться в своем темпе?', answer: 'Да, мы предлагаем варианты самостоятельного обучения и с преподавателем.' }
            ]
        };

        return defaults[locale] || defaults.en;
    }

    // Render FAQ items in visual editor
    renderFAQs() {
        const container = document.getElementById('faq-items-list');
        if (!container) return;

        container.innerHTML = this.faqItems.map((faq, index) => `
            <div class="faq-item-editor" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ddd;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <input type="text" value="${this.escapeHtml(faq.title)}"
                               onchange="faqManager.updateFAQ(${index}, 'title', this.value)"
                               style="width: 100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                               placeholder="Question">
                        <textarea onchange="faqManager.updateFAQ(${index}, 'answer', this.value)"
                                  style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                                  placeholder="Answer">${this.escapeHtml(faq.answer)}</textarea>
                    </div>
                    <div style="margin-left: 10px;">
                        <button onclick="faqManager.moveFAQ(${index}, -1)" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                        <button onclick="faqManager.moveFAQ(${index}, 1)" ${index === this.faqItems.length - 1 ? 'disabled' : ''}>⬇️</button>
                        <button onclick="faqManager.deleteFAQ(${index})" style="color: red;">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update JSON editor with current FAQ data
    updateJSONEditor() {
        const editor = document.getElementById('faq-json-editor');
        if (editor) {
            editor.value = JSON.stringify(this.faqItems, null, 2);
        }
    }

    // Add new FAQ item
    addNewFAQ() {
        this.faqItems.push({
            title: 'New Question',
            answer: 'Enter answer here...'
        });
        this.renderFAQs();
        this.updateJSONEditor();
        this.showStatus('New FAQ added', 'success');
    }

    // Update FAQ item
    updateFAQ(index, field, value) {
        if (this.faqItems[index]) {
            this.faqItems[index][field] = value;
            this.updateJSONEditor();
        }
    }

    // Move FAQ item up or down
    moveFAQ(index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < this.faqItems.length) {
            [this.faqItems[index], this.faqItems[newIndex]] = [this.faqItems[newIndex], this.faqItems[index]];
            this.renderFAQs();
            this.updateJSONEditor();
        }
    }

    // Delete FAQ item
    deleteFAQ(index) {
        if (confirm('Delete this FAQ?')) {
            this.faqItems.splice(index, 1);
            this.renderFAQs();
            this.updateJSONEditor();
            this.showStatus('FAQ deleted', 'success');
        }
    }

    // Apply JSON from editor
    applyJSON() {
        const editor = document.getElementById('faq-json-editor');
        try {
            const parsed = JSON.parse(editor.value);
            if (Array.isArray(parsed)) {
                this.faqItems = parsed;
                this.renderFAQs();
                this.showStatus('JSON applied successfully', 'success');
            } else {
                throw new Error('FAQ data must be an array');
            }
        } catch (error) {
            this.showStatus('Invalid JSON: ' + error.message, 'error');
        }
    }

    // Format JSON in editor
    formatJSON() {
        const editor = document.getElementById('faq-json-editor');
        try {
            const parsed = JSON.parse(editor.value);
            editor.value = JSON.stringify(parsed, null, 2);
            this.showStatus('JSON formatted', 'success');
        } catch (error) {
            this.showStatus('Invalid JSON: ' + error.message, 'error');
        }
    }

    // Validate JSON
    validateJSON() {
        const editor = document.getElementById('faq-json-editor');
        try {
            const parsed = JSON.parse(editor.value);
            if (!Array.isArray(parsed)) {
                throw new Error('FAQ data must be an array');
            }

            const errors = [];
            parsed.forEach((item, index) => {
                if (!item.title) errors.push(`Item ${index + 1}: missing title`);
                if (!item.answer) errors.push(`Item ${index + 1}: missing answer`);
            });

            if (errors.length > 0) {
                this.showStatus('Validation errors: ' + errors.join(', '), 'error');
            } else {
                this.showStatus('✅ JSON is valid!', 'success');
            }
        } catch (error) {
            this.showStatus('Invalid JSON: ' + error.message, 'error');
        }
    }

    // Get FAQ data for saving
    getFAQDataForSave() {
        return {
            faq_items: JSON.stringify(this.faqItems),
            // Also maintain backward compatibility
            faq_1_title: this.faqItems[0]?.title || '',
            faq_1_answer: this.faqItems[0]?.answer || '',
            faq_2_title: this.faqItems[1]?.title || '',
            faq_2_answer: this.faqItems[1]?.answer || '',
            faq_3_title: this.faqItems[2]?.title || '',
            faq_3_answer: this.faqItems[2]?.answer || '',
            faq_4_title: this.faqItems[3]?.title || '',
            faq_4_answer: this.faqItems[3]?.answer || '',
            faq_5_title: this.faqItems[4]?.title || '',
            faq_5_answer: this.faqItems[4]?.answer || '',
            faq_6_title: this.faqItems[5]?.title || '',
            faq_6_answer: this.faqItems[5]?.answer || ''
        };
    }

    // Show status message
    showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('faq-json-status');
        if (statusDiv) {
            const colors = {
                success: '#4CAF50',
                error: '#f44336',
                info: '#2196F3'
            };
            statusDiv.innerHTML = `<div style="padding: 10px; background: ${colors[type]}; color: white; border-radius: 4px;">${message}</div>`;
            setTimeout(() => {
                statusDiv.innerHTML = '';
            }, 3000);
        }
    }

    // Escape HTML for safe display
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize FAQ Manager
const faqManager = new FAQJSONManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => faqManager.init());
} else {
    faqManager.init();
}

// Export for use in save functions
window.getFAQDataForSave = () => faqManager.getFAQDataForSave();