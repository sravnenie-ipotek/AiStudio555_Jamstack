-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  position VARCHAR(255),
  bio TEXT,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(50) DEFAULT 'all',
  categories TEXT,
  experience VARCHAR(100),
  experience_years INTEGER,
  specialties TEXT,
  specializations TEXT[],
  company VARCHAR(200),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  github_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(locale, name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_teachers_locale ON teachers(locale);
CREATE INDEX IF NOT EXISTS idx_teachers_category ON teachers(category);
CREATE INDEX IF NOT EXISTS idx_teachers_display_order ON teachers(display_order);
CREATE INDEX IF NOT EXISTS idx_teachers_published ON teachers(published_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();