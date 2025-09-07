#!/usr/bin/env python3

# Read the home.html file
with open('home.html', 'r') as f:
    lines = f.readlines()

# Define section boundaries (0-indexed)
online_learning_start = 494  # line 495 in editor (section class="section about-us")
online_learning_end = 623    # line 624 in editor (end of </section>)

practice_focus_start = 626   # line 627 in editor (section class="section why-choose-us")  
practice_focus_end = 792     # line 793 in editor (end of </section>)

# Extract sections
online_learning_section = lines[online_learning_start:online_learning_end+1]
practice_focus_section = lines[practice_focus_start:practice_focus_end+1]

# Rebuild the file with swapped sections
new_lines = (
    lines[:online_learning_start] +  # Everything before online learning
    practice_focus_section +          # Practice focus goes here (where online learning was)
    lines[online_learning_end+1:practice_focus_start] +  # Content between sections (just whitespace)
    online_learning_section +         # Online learning goes here (where practice focus was)
    lines[practice_focus_end+1:]      # Everything after practice focus
)

# Write the modified file
with open('home.html', 'w') as f:
    f.writelines(new_lines)

print("✓ Swapped 'Online Learning' and 'Focus on Practice' sections")
print("  - 'Focus on Practice' is now after 'Featured Courses'")
print("  - 'Online Learning' is now before 'FAQ'")