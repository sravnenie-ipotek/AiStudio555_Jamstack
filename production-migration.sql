
-- Migration script for production database
-- Generated: 2025-09-15T14:01:11.861Z
-- Run this on Railway PostgreSQL

-- Ensure tables exist
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT,
  answer TEXT,
  category VARCHAR(255),
  order_index INTEGER,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  duration VARCHAR(100),
  price DECIMAL(10,2),
  features JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  url VARCHAR(500),
  icon VARCHAR(100),
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_logos (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255),
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  order_index INTEGER,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
