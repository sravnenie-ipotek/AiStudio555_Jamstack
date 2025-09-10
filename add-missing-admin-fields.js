/**
 * Script to add missing fields to admin panel
 * This will enhance the Career Services and Career Orientation sections
 */

const fs = require('fs').promises;

async function addMissingFields() {
    console.log('🔧 Adding Missing Fields to Admin Panel...\n');
    
    try {
        // Read current admin panel
        let html = await fs.readFile('./content-admin-comprehensive.html', 'utf-8');
        
        // Additional fields for Career Services (to reach 40+ fields)
        const careerServicesAdditionalFields = `
            <!-- Additional Career Services Fields -->
            <div class="subsection" style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h5>📈 Career Services - Extended Fields</h5>
                <div class="grid">
                    <div class="form-group">
                        <label>Services Page Title</label>
                        <input type="text" id="cs_page_title" placeholder="Career Services">
                    </div>
                    <div class="form-group">
                        <label>Services Page Subtitle</label>
                        <input type="text" id="cs_page_subtitle" placeholder="Your Career Success Partner">
                    </div>
                </div>
                
                <!-- Service Items -->
                <h6>Service Offerings (6 items)</h6>
                ${[1, 2, 3, 4, 5, 6].map(i => `
                <div class="grid" style="margin-bottom: 10px;">
                    <div class="form-group">
                        <label>Service ${i} Title</label>
                        <input type="text" id="cs_service_${i}_title" placeholder="Service ${i}">
                    </div>
                    <div class="form-group">
                        <label>Service ${i} Icon</label>
                        <input type="text" id="cs_service_${i}_icon" placeholder="🎯">
                    </div>
                </div>
                <div class="form-group">
                    <label>Service ${i} Description</label>
                    <textarea id="cs_service_${i}_description" rows="2"></textarea>
                </div>
                `).join('')}
                
                <!-- Success Metrics -->
                <h6>Success Metrics</h6>
                <div class="grid-3">
                    <div class="form-group">
                        <label>Placement Rate</label>
                        <input type="text" id="cs_metric_placement" placeholder="95%">
                    </div>
                    <div class="form-group">
                        <label>Avg Salary Increase</label>
                        <input type="text" id="cs_metric_salary" placeholder="45%">
                    </div>
                    <div class="form-group">
                        <label>Student Satisfaction</label>
                        <input type="text" id="cs_metric_satisfaction" placeholder="4.9/5">
                    </div>
                </div>
            </div>
        `;
        
        // Additional fields for Career Orientation (to reach 215+ fields)
        const careerOrientationAdditionalFields = `
            <!-- Extended Career Orientation Fields -->
            <div class="subsection" style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h5>🚀 Career Orientation - Complete System (215+ Fields)</h5>
                
                <!-- Career Paths Section (30 fields) -->
                <h6>Career Paths (10 paths × 3 fields each)</h6>
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `
                <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
                    <strong>Path ${i}</strong>
                    <div class="grid">
                        <div class="form-group">
                            <label>Path ${i} Title</label>
                            <input type="text" id="path_${i}_title" placeholder="Career Path ${i}">
                        </div>
                        <div class="form-group">
                            <label>Path ${i} Salary Range</label>
                            <input type="text" id="path_${i}_salary" placeholder="$60k-$120k">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Path ${i} Description</label>
                        <textarea id="path_${i}_description" rows="2"></textarea>
                    </div>
                    <div class="grid-3">
                        <div class="form-group">
                            <label>Growth Rate</label>
                            <input type="text" id="path_${i}_growth" placeholder="25%">
                        </div>
                        <div class="form-group">
                            <label>Demand Level</label>
                            <select id="path_${i}_demand">
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Difficulty</label>
                            <select id="path_${i}_difficulty">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>
                </div>
                `).join('')}
                
                <!-- Skills Assessment (20 fields) -->
                <h6>Skills Assessment Categories</h6>
                ${['Technical', 'Analytical', 'Creative', 'Leadership', 'Communication'].map((skill, i) => `
                <div class="grid">
                    <div class="form-group">
                        <label>${skill} Skills Title</label>
                        <input type="text" id="skill_${skill.toLowerCase()}_title" placeholder="${skill} Skills">
                    </div>
                    <div class="form-group">
                        <label>${skill} Weight (%)</label>
                        <input type="number" id="skill_${skill.toLowerCase()}_weight" min="0" max="100">
                    </div>
                </div>
                <div class="form-group">
                    <label>${skill} Description</label>
                    <textarea id="skill_${skill.toLowerCase()}_description" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label>${skill} Questions (comma-separated)</label>
                    <textarea id="skill_${skill.toLowerCase()}_questions" rows="2" placeholder="Question 1, Question 2, Question 3"></textarea>
                </div>
                `).join('')}
                
                <!-- Industry Partners (15 fields) -->
                <h6>Industry Partners</h6>
                ${[1, 2, 3, 4, 5].map(i => `
                <div class="grid">
                    <div class="form-group">
                        <label>Partner ${i} Name</label>
                        <input type="text" id="partner_${i}_name" placeholder="Company ${i}">
                    </div>
                    <div class="form-group">
                        <label>Partner ${i} Logo URL</label>
                        <input type="url" id="partner_${i}_logo" placeholder="https://...">
                    </div>
                    <div class="form-group">
                        <label>Partner ${i} Type</label>
                        <select id="partner_${i}_type">
                            <option>Technology</option>
                            <option>Finance</option>
                            <option>Healthcare</option>
                            <option>Education</option>
                        </select>
                    </div>
                </div>
                `).join('')}
                
                <!-- Success Stories (12 fields) -->
                <h6>Success Stories</h6>
                ${[1, 2, 3, 4].map(i => `
                <div style="border: 1px solid #28a745; padding: 10px; margin: 10px 0; border-radius: 5px;">
                    <strong>Story ${i}</strong>
                    <div class="grid">
                        <div class="form-group">
                            <label>Student Name</label>
                            <input type="text" id="story_${i}_name" placeholder="John Doe">
                        </div>
                        <div class="form-group">
                            <label>Current Role</label>
                            <input type="text" id="story_${i}_role" placeholder="Senior Developer">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Success Story</label>
                        <textarea id="story_${i}_text" rows="3"></textarea>
                    </div>
                </div>
                `).join('')}
                
                <!-- Assessment Questions (30 fields) -->
                <h6>Assessment Questions Bank</h6>
                ${[...Array(10)].map((_, i) => `
                <div class="grid">
                    <div class="form-group">
                        <label>Question ${i + 1}</label>
                        <input type="text" id="assessment_q${i + 1}_text" placeholder="Assessment question ${i + 1}">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="assessment_q${i + 1}_category">
                            <option>Personality</option>
                            <option>Skills</option>
                            <option>Interests</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Weight</label>
                        <input type="number" id="assessment_q${i + 1}_weight" min="1" max="10" value="5">
                    </div>
                </div>
                `).join('')}
            </div>
        `;
        
        // Find insertion points and add the new fields
        
        // Add to Career Services section (before closing div)
        const careerServicesEnd = html.indexOf('</div>\n\n        <!-- Career Orientation Section -->');
        if (careerServicesEnd > -1) {
            html = html.slice(0, careerServicesEnd) + 
                   careerServicesAdditionalFields + 
                   html.slice(careerServicesEnd);
            console.log('✅ Added extended Career Services fields');
        }
        
        // Add to Career Orientation section (before closing div)
        const careerOrientationPattern = /<div id="career-orientation"[^>]*>[\s\S]*?(<\/div>\s*<\/div>)/;
        const match = html.match(careerOrientationPattern);
        if (match) {
            const insertPoint = html.lastIndexOf('</div>\n        </div>\n\n        <!-- Scripts -->');
            if (insertPoint > -1) {
                html = html.slice(0, insertPoint) + 
                       careerOrientationAdditionalFields + 
                       '\n        </div>\n' +
                       html.slice(insertPoint);
                console.log('✅ Added extended Career Orientation fields');
            }
        }
        
        // Save the enhanced admin panel
        await fs.writeFile('./content-admin-comprehensive-enhanced.html', html);
        console.log('\n✅ Enhanced admin panel saved as content-admin-comprehensive-enhanced.html');
        
        // Count new fields
        const newFieldsCount = (html.match(/id="[^"]+"/g) || []).length;
        console.log(`\n📊 Total fields after enhancement: ${newFieldsCount}`);
        
        return true;
        
    } catch (error) {
        console.error('Error adding fields:', error);
        return false;
    }
}

// Run if executed directly
if (require.main === module) {
    addMissingFields();
}

module.exports = addMissingFields;