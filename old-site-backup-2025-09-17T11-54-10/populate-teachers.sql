-- Teachers Population Script
-- Generated automatically

BEGIN;

-- Clear existing English teachers
DELETE FROM teachers WHERE locale = 'en';

-- Insert new teachers

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Dr. Sarah Chen',
            'Senior ML Engineer',
            'Senior ML Engineer',
            'Expert in machine learning and deep neural networks with 8+ years of experience in production ML systems. Specializes in computer vision and natural language processing applications at Google.',
            'https://lh3.googleusercontent.com/pw/ABLVV86TN2wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'machine-learning',
            '8+ years of commercial experience',
            8,
            'Machine Learning, Deep Learning, Neural Networks, Python, TensorFlow, Computer Vision',
            'Google',
            'https://linkedin.com/in/sarah-chen-ml',
            'https://github.com/sarahchen',
            1,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Dr. Michael Rodriguez',
            'AI Research Scientist',
            'AI Research Scientist',
            'Leading AI researcher focused on large language models and AGI safety. Published author with 50+ papers in top-tier conferences including NeurIPS and ICML.',
            'https://lh3.googleusercontent.com/pw/ABLVV85rT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'machine-learning',
            '10+ years of commercial experience',
            10,
            'Artificial Intelligence, Large Language Models, Research, Python, PyTorch',
            'OpenAI',
            'https://linkedin.com/in/michael-rodriguez-ai',
            'https://github.com/mrodriguez',
            2,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Dr. Elena Petrov',
            'Head of Data Science',
            'Head of Data Science',
            'Data science leader with 12+ years experience building ML systems at scale. Leads a team of 30+ data scientists working on recommendation systems and user engagement.',
            'https://lh3.googleusercontent.com/pw/ABLVV84mT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'machine-learning',
            '12+ years of commercial experience',
            12,
            'Data Science, Machine Learning, Recommendation Systems, Leadership, Scale',
            'Meta',
            'https://linkedin.com/in/elena-petrov',
            'https://github.com/epetrov',
            3,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'David Kim',
            'Computer Vision Engineer',
            'Computer Vision Engineer',
            'Computer vision specialist working on autonomous driving systems at Tesla. Expert in real-time image processing, object detection, and deep learning for automotive applications.',
            'https://lh3.googleusercontent.com/pw/ABLVV83nT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'development',
            '6+ years of commercial experience',
            6,
            'Computer Vision, Autonomous Driving, Deep Learning, C++, Python',
            'Tesla',
            'https://linkedin.com/in/david-kim-cv',
            'https://github.com/davidkim',
            4,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Anna Kowalski',
            'Senior Software Engineer',
            'Senior Software Engineer',
            'Full-stack engineer with expertise in cloud-native applications and microservices architecture. Leads development of enterprise-scale solutions at Microsoft Azure.',
            'https://lh3.googleusercontent.com/pw/ABLVV82oT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'development',
            '7+ years of commercial experience',
            7,
            'Software Engineering, Cloud Architecture, Microservices, .NET, Azure',
            'Microsoft',
            'https://linkedin.com/in/anna-kowalski',
            'https://github.com/akowalski',
            5,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Dr. James Wilson',
            'Principal Data Scientist',
            'Principal Data Scientist',
            'Data science expert with 9+ years of experience in e-commerce analytics and machine learning. Leads data science initiatives for Amazon''s recommendation and personalization systems.',
            'https://lh3.googleusercontent.com/pw/ABLVV81pT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'data-analytics',
            '9+ years of commercial experience',
            9,
            'Data Science, Analytics, Machine Learning, Statistics, SQL, Python',
            'Amazon',
            'https://linkedin.com/in/james-wilson-ds',
            'https://github.com/jwilson',
            6,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Maria Santos',
            'Data Analytics Lead',
            'Data Analytics Lead',
            'Analytics leader specializing in financial data and fraud detection systems. Builds data-driven solutions for payment processing and risk management at Stripe.',
            'https://lh3.googleusercontent.com/pw/ABLVV80qT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'data-analytics',
            '5+ years of commercial experience',
            5,
            'Data Analytics, Financial Data, Fraud Detection, SQL, Python, Tableau',
            'Stripe',
            'https://linkedin.com/in/maria-santos-analytics',
            'https://github.com/msantos',
            7,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Alex Thompson',
            'Senior Backend Engineer',
            'Senior Backend Engineer',
            'Backend engineering specialist with 11+ years of experience in distributed systems and real-time messaging platforms. Architect of Slack''s core messaging infrastructure.',
            'https://lh3.googleusercontent.com/pw/ABLVV87rT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'cloud-devops',
            '11+ years of commercial experience',
            11,
            'Backend Engineering, Distributed Systems, Real-time Systems, Go, Kubernetes',
            'Slack',
            'https://linkedin.com/in/alex-thompson-backend',
            'https://github.com/athompson',
            8,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Lisa Zhang',
            'DevOps Architect',
            'DevOps Architect',
            'DevOps expert with 8+ years of experience in cloud infrastructure and CI/CD pipelines. Designed and implemented Twitter''s global deployment infrastructure serving billions of requests.',
            'https://lh3.googleusercontent.com/pw/ABLVV86sT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'cloud-devops',
            '8+ years of commercial experience',
            8,
            'DevOps, Cloud Infrastructure, CI/CD, Docker, Kubernetes, AWS',
            'Twitter',
            'https://linkedin.com/in/lisa-zhang-devops',
            'https://github.com/lzhang',
            9,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Robert Johnson',
            'UX Design Lead',
            'UX Design Lead',
            'UX design leader with 7+ years of experience creating intuitive user experiences for consumer products. Led design teams for major Apple product launches including iOS and macOS features.',
            'https://lh3.googleusercontent.com/pw/ABLVV85tT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'design',
            '7+ years of commercial experience',
            7,
            'UX Design, User Research, Prototyping, Design Systems, iOS Design',
            'Apple',
            'https://linkedin.com/in/robert-johnson-ux',
            'https://github.com/rjohnson',
            10,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Sofia Andersson',
            'Product Designer',
            'Product Designer',
            'Product designer with 6+ years of experience in digital product design and user interface development. Designs engaging music discovery experiences for Spotify''s 400+ million users.',
            'https://lh3.googleusercontent.com/pw/ABLVV84uT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'design',
            '6+ years of commercial experience',
            6,
            'Product Design, UI Design, User Interface, Design Systems, Prototyping',
            'Spotify',
            'https://linkedin.com/in/sofia-andersson-design',
            'https://github.com/sandersson',
            11,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Raj Patel',
            'Engineering Manager',
            'Engineering Manager',
            'Engineering leader with 9+ years of experience managing high-performing technical teams. Oversees cloud infrastructure services at AWS serving millions of customers globally.',
            'https://lh3.googleusercontent.com/pw/ABLVV83vT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'management',
            '9+ years of commercial experience',
            9,
            'Engineering Management, Team Leadership, Cloud Services, Agile, Strategy',
            'AWS',
            'https://linkedin.com/in/raj-patel-manager',
            'https://github.com/rpatel',
            12,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Jennifer Wu',
            'Technical Program Manager',
            'Technical Program Manager',
            'Technical program manager with 8+ years of experience leading cross-functional engineering initiatives. Manages large-scale platform development projects at GitHub serving 100+ million developers.',
            'https://lh3.googleusercontent.com/pw/ABLVV82wT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'management',
            '8+ years of commercial experience',
            8,
            'Program Management, Cross-functional Leadership, Platform Development, Agile',
            'GitHub',
            'https://linkedin.com/in/jennifer-wu-tpm',
            'https://github.com/jwu',
            13,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Marcus Brown',
            'Product Manager',
            'Product Manager',
            'Product management expert with 10+ years of experience in enterprise software and CRM platforms. Leads product strategy for Salesforce''s core CRM features used by millions of businesses.',
            'https://lh3.googleusercontent.com/pw/ABLVV81xT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'management',
            '10+ years of commercial experience',
            10,
            'Product Management, Enterprise Software, CRM, Strategy, User Research',
            'Salesforce',
            'https://linkedin.com/in/marcus-brown-pm',
            'https://github.com/mbrown',
            14,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Sarah Kim',
            'Senior Product Manager',
            'Senior Product Manager',
            'Senior product manager with 7+ years of experience in marketplace platforms and user experience optimization. Drives product innovation for Airbnb''s host and guest experiences.',
            'https://lh3.googleusercontent.com/pw/ABLVV80yT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'management',
            '7+ years of commercial experience',
            7,
            'Product Management, Marketplace Platforms, User Experience, Growth, Analytics',
            'Airbnb',
            'https://linkedin.com/in/sarah-kim-pm',
            'https://github.com/skim',
            15,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

        INSERT INTO teachers (
            locale, name, title, position, bio, image_url, category,
            experience, experience_years, specialties, company,
            linkedin_url, github_url, display_order, published_at,
            created_at, updated_at
        ) VALUES (
            'en',
            'Emma Davis',
            'Principal Designer',
            'Principal Designer',
            'Principal designer with 9+ years of experience in creative software and design tools. Leads design vision for Adobe Creative Suite features used by millions of creative professionals worldwide.',
            'https://lh3.googleusercontent.com/pw/ABLVV87zT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c',
            'design',
            '9+ years of commercial experience',
            9,
            'Design Leadership, Creative Software, Design Systems, User Experience, Visual Design',
            'Adobe',
            'https://linkedin.com/in/emma-davis-design',
            'https://github.com/edavis',
            16,
            '2024-01-01T00:00:00.000Z',
            NOW(),
            NOW()
        );
    

COMMIT;

-- Verification query
SELECT COUNT(*) as total_teachers, category FROM teachers WHERE locale = 'en' GROUP BY category ORDER BY category;
