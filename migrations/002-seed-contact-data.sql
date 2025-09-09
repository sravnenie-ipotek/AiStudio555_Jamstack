-- Reseed Contact Page Data
-- Run this after deployment to add contact page

INSERT INTO contact_pages (
  id, 
  phone, 
  email, 
  address, 
  office_hours, 
  map_url, 
  published_at, 
  created_at, 
  updated_at
)
VALUES (
  1, 
  '+1 (555) 123-4567', 
  'info@aistudio555.com', 
  '123 Tech Street, Silicon Valley, CA 94025', 
  'Monday-Friday: 9:00 AM - 6:00 PM', 
  'https://maps.google.com/?q=Silicon+Valley', 
  NOW(), 
  NOW(), 
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  office_hours = EXCLUDED.office_hours,
  map_url = EXCLUDED.map_url,
  updated_at = NOW();