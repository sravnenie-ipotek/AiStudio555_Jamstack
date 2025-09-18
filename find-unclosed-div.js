const fs = require('fs');

function findUnclosedDiv() {
    console.log('Finding unclosed divs in HTML structure...');
    
    const htmlContent = fs.readFileSync('/Users/michaelmishayev/Desktop/newCode/admin-nd.html', 'utf8');
    const lines = htmlContent.split('\n');
    
    let divStack = [];
    let inTeachersSection = false;
    let teachersStartLine = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;
        
        // Track when we enter teachers section
        if (line.includes('id="teachers"')) {
            inTeachersSection = true;
            teachersStartLine = lineNum;
            console.log('Teachers section starts at line', lineNum);
        }
        
        // Track opening divs
        const openDivs = line.match(/<div[^>]*>/g) || [];
        openDivs.forEach(div => {
            divStack.push({
                line: lineNum,
                content: div.substring(0, 50),
                isTeachers: inTeachersSection
            });
        });
        
        // Track closing divs
        const closeDivs = line.match(/<\/div>/g) || [];
        closeDivs.forEach(closeDiv => {
            if (divStack.length > 0) {
                const opened = divStack.pop();
                if (opened.isTeachers && inTeachersSection) {
                    console.log('Closed div from line', opened.line, 'at line', lineNum);
                }
            }
        });
        
        // Check if teachers section should end
        if (line.includes('End teachers section')) {
            console.log('Teachers section should end at line', lineNum);
            
            // Check remaining divs in stack that belong to teachers
            console.log('Checking for unclosed divs in teachers section:');
            const unclosedInTeachers = divStack.filter(div => div.isTeachers);
            if (unclosedInTeachers.length > 0) {
                console.log('FOUND UNCLOSED DIVS IN TEACHERS SECTION:');
                unclosedInTeachers.forEach(div => {
                    console.log('  Line', div.line, ':', div.content);
                });
            } else {
                console.log('No unclosed divs found in teachers section');
            }
            
            inTeachersSection = false;
        }
        
        // Check for blog sections
        if (line.includes('id="blog"') || line.includes('id="blogNew"') || line.includes('id="blogAdmin"')) {
            console.log('Found blog section at line', lineNum);
            console.log('  Unclosed divs from teachers:', divStack.filter(d => d.isTeachers).length);
        }
    }
    
    console.log('\nFinal analysis:');
    console.log('Total unclosed divs:', divStack.length);
    if (divStack.length > 0) {
        console.log('Unclosed divs:');
        divStack.forEach(div => {
            console.log('  Line', div.line, ':', div.content, '(teachers:', div.isTeachers, ')');
        });
    }
}

findUnclosedDiv();
