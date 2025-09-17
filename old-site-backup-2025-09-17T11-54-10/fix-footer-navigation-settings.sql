-- Fix Footer Navigation Settings
-- Update all footer_content records to show navigation items
-- This fixes the issue where footer appears empty due to show_navigation = false

UPDATE footer_content
SET show_navigation = true
WHERE show_navigation = false OR show_navigation IS NULL;

-- Verify the update
SELECT locale, show_navigation, show_social_links, show_contact_info
FROM footer_content
ORDER BY locale;