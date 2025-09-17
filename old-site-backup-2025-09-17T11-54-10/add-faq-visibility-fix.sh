#!/bin/bash

# Script to add FAQ visibility fix CSS to all HTML files with FAQ sections

echo "Adding FAQ visibility fix CSS to all HTML files..."

# Function to add CSS link before </head> tag
add_css_to_file() {
    local file=$1
    local css_path=$2

    # Check if the file already has the CSS link
    if grep -q "faq-visibility-fix.css" "$file"; then
        echo "✓ $file already has FAQ visibility fix CSS"
        return
    fi

    # Check if file has FAQ content
    if ! grep -q "faq-question" "$file"; then
        echo "⊘ $file doesn't have FAQ content, skipping"
        return
    fi

    # Add the CSS link before </head>
    if grep -q "</head>" "$file"; then
        sed -i.bak "s|</head>|  <link href=\"${css_path}\" rel=\"stylesheet\" type=\"text/css\">\n</head>|" "$file"
        rm "${file}.bak"
        echo "✓ Added FAQ visibility fix CSS to $file"
    else
        echo "⊗ Could not find </head> in $file"
    fi
}

# Process language directories
for lang_dir in he ru en; do
    echo ""
    echo "Processing $lang_dir directory..."

    # Process index.html and home.html in language directories
    for file in "$lang_dir/index.html" "$lang_dir/home.html"; do
        if [ -f "$file" ]; then
            add_css_to_file "$file" "../css/faq-visibility-fix.css"
        fi
    done
done

# Process dist directories
for lang_dir in dist/he dist/ru dist/en; do
    echo ""
    echo "Processing $lang_dir directory..."

    # Process index.html and home.html in dist directories
    for file in "$lang_dir/index.html" "$lang_dir/home.html"; do
        if [ -f "$file" ]; then
            add_css_to_file "$file" "../../css/faq-visibility-fix.css"
        fi
    done
done

# Process root home.html
if [ -f "home.html" ]; then
    echo ""
    echo "Processing root home.html..."
    add_css_to_file "home.html" "css/faq-visibility-fix.css"
fi

echo ""
echo "✅ FAQ visibility fix CSS addition complete!"
echo ""
echo "The FAQ questions should now be visible in white color on the dark background."
echo "Please refresh the page to see the changes."