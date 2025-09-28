-- ================================================================
-- QUICK FIX: ADD MISSING COLUMNS TO EXISTING TABLES
-- ================================================================
-- Run this BEFORE the data script if tables already exist
-- ================================================================

-- Add missing columns to blog_posts table if they don't exist
DO $$
BEGIN
    -- Check and add title_ru column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='blog_posts' AND column_name='title_ru') THEN
        ALTER TABLE blog_posts ADD COLUMN title_ru text;
    END IF;

    -- Check and add title_he column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='blog_posts' AND column_name='title_he') THEN
        ALTER TABLE blog_posts ADD COLUMN title_he text;
    END IF;

    -- Check and add content_ru column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='blog_posts' AND column_name='content_ru') THEN
        ALTER TABLE blog_posts ADD COLUMN content_ru text;
    END IF;

    -- Check and add content_he column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='blog_posts' AND column_name='content_he') THEN
        ALTER TABLE blog_posts ADD COLUMN content_he text;
    END IF;

    -- Check and add excerpt_ru column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='blog_posts' AND column_name='excerpt_ru') THEN
        ALTER TABLE blog_posts ADD COLUMN excerpt_ru text;
    END IF;

    -- Check and add excerpt_he column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='blog_posts' AND column_name='excerpt_he') THEN
        ALTER TABLE blog_posts ADD COLUMN excerpt_he text;
    END IF;

END $$;

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'blog_posts'
AND column_name LIKE '%_ru' OR column_name LIKE '%_he'
ORDER BY column_name;