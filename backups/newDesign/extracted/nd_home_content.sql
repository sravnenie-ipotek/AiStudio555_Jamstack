
INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
VALUES ('hero', 'hero', '{"subtitle":"Expert-Led Learning","title":"Unlock Potential With Proven Courses.","description":"Here you can elevate your tech career with expert-led courses. whether you''re just starting out or aiming to advance your skills, our hands-on, practical training is designed.","buttons":[{"text":"get in touch","url":"contact-us.html","style":"primary"},{"text":"Check Out Courses","url":"courses.html","style":"primary"}],"stats":[],"backgroundImages":[]}', true, 1)
ON CONFLICT (section_key) DO UPDATE SET
    content_en = EXCLUDED.content_en,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
VALUES ('features', 'grid', '{"subtitle":"","title":"","items":[]}', true, 2)
ON CONFLICT (section_key) DO UPDATE SET
    content_en = EXCLUDED.content_en,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
VALUES ('courses', 'carousel', '{"subtitle":"","title":"","viewAllText":"View All Courses","viewAllUrl":"/courses.html","items":[]}', true, 3)
ON CONFLICT (section_key) DO UPDATE SET
    content_en = EXCLUDED.content_en,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
VALUES ('testimonials', 'carousel', '{"subtitle":"","title":"","items":[]}', true, 4)
ON CONFLICT (section_key) DO UPDATE SET
    content_en = EXCLUDED.content_en,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
VALUES ('blog', 'grid', '{"subtitle":"News & Articles","title":"Your Learning Journey With Our Experts.","viewAllText":"View All Posts","viewAllUrl":"/blog.html","items":[{"image":"","category":"","date":"","title":"","description":"","author":{"image":"","name":""},"readMoreText":"Read More","url":"#","visible":true,"order_index":0},{"image":"","category":"","date":"","title":"","description":"","author":{"image":"","name":""},"readMoreText":"Read More","url":"#","visible":true,"order_index":1},{"image":"","category":"","date":"","title":"","description":"","author":{"image":"","name":""},"readMoreText":"Read More","url":"#","visible":true,"order_index":2}]}', true, 5)
ON CONFLICT (section_key) DO UPDATE SET
    content_en = EXCLUDED.content_en,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
VALUES ('cta_1', 'cta', '{"title":"Discover A World Of Learning Opportunities.","description":"","buttonText":"get in touch","buttonUrl":"contact-us.html"}', true, 6)
ON CONFLICT (section_key) DO UPDATE SET
    content_en = EXCLUDED.content_en,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
VALUES ('footer', 'general', '{}', true, 7)
ON CONFLICT (section_key) DO UPDATE SET
    content_en = EXCLUDED.content_en,
    updated_at = CURRENT_TIMESTAMP;