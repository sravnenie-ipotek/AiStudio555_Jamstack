-- Fix consultations table structure in production
-- The table should match what the code expects (contact form submissions)

-- Drop the incorrect table if it exists
DROP TABLE IF EXISTS consultations CASCADE;

-- Create the correct consultations table for contact form submissions
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  interest VARCHAR(100) NOT NULL,
  experience VARCHAR(50) NOT NULL,
  locale VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_consultations_email ON consultations(email);
CREATE INDEX idx_consultations_interest ON consultations(interest);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);

-- If we need consultation SERVICES, create a separate table
CREATE TABLE IF NOT EXISTS consultation_services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  duration VARCHAR(100),
  price DECIMAL(10,2),
  features JSONB,
  locale VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample consultation services
INSERT INTO consultation_services (title, description, duration, price, features) VALUES
  ('Career Strategy Session', 'One-on-one career planning and guidance', '60 minutes', 150, '{"personalPlan": true, "followUp": true, "resources": true}'),
  ('Technical Interview Prep', 'Mock interviews and coding practice', '90 minutes', 200, '{"mockInterview": true, "feedback": true, "tips": true}'),
  ('Portfolio Review', 'Professional review of your AI/ML projects', '45 minutes', 100, '{"detailed_feedback": true, "improvement_tips": true}')
ON CONFLICT DO NOTHING;