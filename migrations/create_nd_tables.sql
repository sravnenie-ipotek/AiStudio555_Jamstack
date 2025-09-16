-- New Design Database Schema
-- All tables use 'nd_' prefix for complete separation

-- Drop existing tables if they exist
DROP TABLE IF EXISTS nd_home CASCADE;
DROP TABLE IF EXISTS nd_menu CASCADE;
DROP TABLE IF EXISTS nd_footer CASCADE;

-- Create nd_home table for home page sections
CREATE TABLE nd_home (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    section_type VARCHAR(50),
    visible BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,

    -- Content in three languages (JSON)
    content_en JSONB,
    content_ru JSONB,
    content_he JSONB,

    -- Meta information
    meta_title_en TEXT,
    meta_title_ru TEXT,
    meta_title_he TEXT,
    meta_description_en TEXT,
    meta_description_ru TEXT,
    meta_description_he TEXT,

    -- Settings
    animations_enabled BOOLEAN DEFAULT true,
    custom_css TEXT,
    custom_js TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nd_menu table for navigation
CREATE TABLE nd_menu (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES nd_menu(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,

    -- Labels in three languages
    label_en VARCHAR(200),
    label_ru VARCHAR(200),
    label_he VARCHAR(200),

    -- Navigation
    url VARCHAR(500),
    icon_class VARCHAR(100),
    target VARCHAR(20) DEFAULT '_self',

    -- Dropdown specific
    is_dropdown BOOLEAN DEFAULT false,
    dropdown_columns INTEGER DEFAULT 1,

    -- Additional settings
    badge_text_en VARCHAR(50),
    badge_text_ru VARCHAR(50),
    badge_text_he VARCHAR(50),
    badge_color VARCHAR(20),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nd_footer table
CREATE TABLE nd_footer (
    id SERIAL PRIMARY KEY,
    section_type VARCHAR(50) NOT NULL, -- 'column', 'social', 'copyright', 'newsletter'
    column_number INTEGER,
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,

    -- Content type
    item_type VARCHAR(50), -- 'heading', 'link', 'text', 'social_icon', 'input'

    -- Content in three languages
    content_en TEXT,
    content_ru TEXT,
    content_he TEXT,

    -- Link/Social properties
    url VARCHAR(500),
    icon_class VARCHAR(100),
    target VARCHAR(20) DEFAULT '_self',

    -- Newsletter specific
    placeholder_en VARCHAR(200),
    placeholder_ru VARCHAR(200),
    placeholder_he VARCHAR(200),
    button_text_en VARCHAR(100),
    button_text_ru VARCHAR(100),
    button_text_he VARCHAR(100),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_nd_home_section_key ON nd_home(section_key);
CREATE INDEX idx_nd_home_visible ON nd_home(visible);
CREATE INDEX idx_nd_home_order ON nd_home(order_index);

CREATE INDEX idx_nd_menu_parent ON nd_menu(parent_id);
CREATE INDEX idx_nd_menu_visible ON nd_menu(visible);
CREATE INDEX idx_nd_menu_order ON nd_menu(order_index);

CREATE INDEX idx_nd_footer_section ON nd_footer(section_type);
CREATE INDEX idx_nd_footer_visible ON nd_footer(visible);
CREATE INDEX idx_nd_footer_order ON nd_footer(order_index);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables
CREATE TRIGGER update_nd_home_updated_at BEFORE UPDATE ON nd_home
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nd_menu_updated_at BEFORE UPDATE ON nd_menu
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nd_footer_updated_at BEFORE UPDATE ON nd_footer
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();