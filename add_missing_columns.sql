-- Add missing columns to home_pages table
-- Check and add CTA columns if they don't exist

-- Add CTA columns
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS cta_visible BOOLEAN DEFAULT true;
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS cta_title VARCHAR(255);
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS cta_description TEXT;
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS cta_button_text VARCHAR(255);
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS cta_button_url VARCHAR(500);

-- Show all columns to verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'home_pages'
ORDER BY ordinal_position;