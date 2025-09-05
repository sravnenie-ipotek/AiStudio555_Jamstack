const axios = require('axios');

async function seedHomePageContent() {
  const strapiUrl = 'http://localhost:1337';
  
  try {
    // Complete home page data with all text content
    const homePageData = {
      data: {
        // Hero Section Content
        heroSection: {
          subtitle: "Expert-Led Learning",
          title: "Unlock Potential With Proven Courses.",
          description: "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.",
          primaryButton: {
            label: "get in touch",
            url: "#contact",
            variant: "primary"
          }
        },
        heroSectionVisible: true,

        // Featured Courses Section
        featuredCourses: {
          subtitle: "Most Popular IT Courses",
          title: "Most Popular IT Courses To Advance Your Career.",
          description: "Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.",
          courses: [
            {
              title: "Complete React Development Course",
              description: "Master React.js from basics to advanced concepts including hooks, state management, and real-world projects.",
              price: 299.99,
              duration: "12 weeks",
              level: "Intermediate",
              rating: 4.9,
              studentsCount: 2543
            },
            {
              title: "Python for Data Science & AI",
              description: "Learn Python programming with focus on data analysis, machine learning, and artificial intelligence applications.",
              price: 399.99,
              duration: "16 weeks",
              level: "Beginner",
              rating: 4.8,
              studentsCount: 3821
            },
            {
              title: "iOS & Android App Development",
              description: "Build native mobile applications for both iOS and Android platforms using modern frameworks.",
              price: 499.99,
              duration: "20 weeks",
              level: "Intermediate",
              rating: 4.7,
              studentsCount: 1876
            },
            {
              title: "AWS Cloud Architecture Mastery",
              description: "Design and deploy scalable cloud solutions on Amazon Web Services with hands-on projects.",
              price: 449.99,
              duration: "14 weeks",
              level: "Advanced",
              rating: 4.9,
              studentsCount: 2109
            },
            {
              title: "Machine Learning & Neural Networks",
              description: "Deep dive into ML algorithms, neural networks, and deep learning with TensorFlow and PyTorch.",
              price: 599.99,
              duration: "24 weeks",
              level: "Advanced",
              rating: 5.0,
              studentsCount: 1543
            },
            {
              title: "DevOps Engineering & CI/CD",
              description: "Master DevOps practices, containerization with Docker, Kubernetes, and CI/CD pipelines.",
              price: 379.99,
              duration: "12 weeks",
              level: "Intermediate",
              rating: 4.8,
              studentsCount: 2891
            }
          ]
        },
        featuredCoursesVisible: true,

        // Practice Focus Section
        practiceFocus: {
          subtitle: "Focus on Practice",
          title: "85% Practice, 15% Theory - Real Skills That Matter",
          description: "We provide structured knowledge that's in demand in today's job market. No fluff in our teaching - only hands-on experience and real-world projects.",
          skillsTitle: "Skills You'll Master Through Practice",
          practicePercentage: "85%",
          theoryPercentage: "15%",
          resultPercentage: "100%",
          practiceStatsTitle: "Practice Focus Statistics",
          skills: [
            {
              title: "Problem Solving",
              description: "Develop algorithmic thinking through coding challenges",
              icon: "puzzle"
            },
            {
              title: "Code Quality",
              description: "Write clean, maintainable, and scalable code",
              icon: "code"
            },
            {
              title: "Version Control",
              description: "Master Git and collaborative development workflows",
              icon: "git"
            },
            {
              title: "Testing & QA",
              description: "Ensure code quality with automated testing",
              icon: "check"
            },
            {
              title: "Deployment",
              description: "Deploy applications to cloud platforms",
              icon: "cloud"
            },
            {
              title: "Soft Skills",
              description: "Communication and teamwork for tech professionals",
              icon: "users"
            }
          ]
        },
        practiceFocusVisible: true,

        // Online Learning Section
        onlineLearning: {
          subtitle: "Online Learning",
          title: "Learn From Anywhere, Anytime With Our Platform.",
          description: "Our online learning platform makes it easy to access world-class education from the comfort of your home. Learn at your own pace with expert instructors and interactive course materials.",
          aboutDescription: "Providing hands-on, real-world training and mentorship, i aim to bridge gap between theoretical knowledge & practical application, ensuring that every student can confidently apply their skills.",
          totalLearners: "12103254",
          learnersLabel: "Total Happy Learners"
        },
        onlineLearningVisible: true,

        // Alumni Reviews Section
        alumniReviews: {
          subtitle: "Student Success Stories", 
          title: "Alumni Reviews",
          rating: 4.9,
          totalReviews: "1234 reviews",
          description: "Real feedback from our graduates who have successfully transformed their careers through our courses.",
          graduatesTitle: "Our Graduates Work At",
          graduatesDescription: "Join alumni at the world's leading technology companies",
          reviews: [
            {
              name: "Vyacheslav",
              role: "Android Developer",
              company: "Tech Solutions",
              review: "Completed the Android Development course. It was very convenient that it was held online. The material is presented clearly and structured. Practice-oriented approach helped me land a job immediately after graduation.",
              rating: 5,
              courseCompleted: "Android Development",
              graduationDate: "2024-03"
            },
            {
              name: "Alexander",
              role: "Data Scientist",
              company: "Analytics Corp",
              review: "Finished Data Science training. Instructor Maxim Stepanovich is excellent. Great presentation of complex topics, always ready to help with questions. The course gave me practical skills I use daily at work.",
              rating: 5,
              courseCompleted: "Data Science",
              graduationDate: "2024-02"
            },
            {
              name: "Igor Truhanovich",
              role: "Automation Engineer",
              company: "QA Systems",
              review: "Completed JavaScript automation course and I'm very satisfied! The material is presented clearly and comprehensively. Real-world projects helped me build an impressive portfolio that helped me get hired.",
              rating: 5,
              courseCompleted: "JavaScript Automation",
              graduationDate: "2024-01"
            },
            {
              name: "Maria Petrova",
              role: "UX/UI Designer",
              company: "Design Studio Pro",
              review: "The UX/UI Design course exceeded my expectations! From zero knowledge to landing my dream job in just 5 months. The instructors are industry professionals who really care about your success.",
              rating: 5,
              courseCompleted: "UX/UI Design",
              graduationDate: "2023-12"
            }
          ]
        },
        alumniReviewsVisible: true,

        // FAQ Section
        faqSection: {
          subtitle: "FAQ & Answer",
          title: "Frequently Asked Questions",
          description: "Find answers to the most common questions about our courses, learning platform, and support services.",
          faqs: [
            {
              question: "Q: What types of AI and IT courses are available?",
              answer: "We offer comprehensive courses in AI Development, Machine Learning, Data Science, Web Development, Mobile App Development, Cloud Computing, Cybersecurity, and more. All courses are designed with 85% practical work and real-world projects."
            },
            {
              question: "Q: How long does it take to complete a course?",
              answer: "Course duration varies from 3 to 6 months depending on the program. You can learn at your own pace with lifetime access to course materials. Most students complete courses while working full-time."
            },
            {
              question: "Q: What kind of support is provided during learning?",
              answer: "Each student gets a dedicated account manager, 24/7 access to instructors, live Q&A sessions, code reviews, career guidance, and job placement assistance. Our support team responds within 24 hours."
            },
            {
              question: "Q: Do I need prior programming experience?",
              answer: "No prior experience required for beginner courses. We start from basics and gradually build up your skills. For advanced courses, we provide prerequisites and free prep materials to get you ready."
            },
            {
              question: "Q: Will I receive a certificate after completion?",
              answer: "Yes, you'll receive an industry-recognized certificate upon successful completion. Our certificates are valued by employers and include verification links for authenticity. We also help with LinkedIn profile optimization."
            }
          ]
        },
        faqSectionVisible: true,

        // Publish the content immediately
        publishedAt: new Date().toISOString()
      }
    };

    // Create/Update home page content
    console.log('📝 Creating home page content in Strapi...');
    
    // First, try to update existing entry
    try {
      const response = await axios.put(
        `${strapiUrl}/api/home-page`,
        homePageData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Home page content updated successfully!');
      return response.data;
    } catch (error) {
      // If update fails, try to create new entry
      if (error.response && error.response.status === 404) {
        const response = await axios.post(
          `${strapiUrl}/api/home-page`,
          homePageData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Home page content created successfully!');
        return response.data;
      }
      throw error;
    }

  } catch (error) {
    console.error('❌ Error seeding home page:', error.response?.data || error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Strapi is running on http://localhost:1337');
    console.log('   2. You have enabled public permissions for home-page');
    console.log('   3. All component schemas are properly configured');
  }
}

// Run the script
seedHomePageContent().then(() => {
  console.log('\n🎯 To test the integration:');
  console.log('   1. Open http://localhost:8000/home.html');
  console.log('   2. Check browser console for API responses');
  console.log('   3. Edit content in Strapi admin and refresh the page');
});