/**
 * Webflow + Strapi Integration Script
 * 
 * Add this script to your Webflow pages to connect with Strapi backend
 * Place in: Project Settings → Custom Code → Footer Code
 */

// ============================================
// CONFIGURATION
// ============================================

const STRAPI_CONFIG = {
    // Change this to your production Strapi URL when deploying
    url: window.location.hostname === 'localhost' 
        ? 'http://localhost:1337' 
        : 'https://your-strapi-app.herokuapp.com',
    
    // Get this from Strapi Admin → Settings → API Tokens
    apiToken: '6ba76f584778637fd308f48aac27461c08af957ef205a3281c444c32859f229d923a1984ec93b9564b26db3c10e68f2ccca8983e27ec9b42483e3b8f6faca7a2a52f9b586357c4f94ad37792a7b0f271c164f661e03e4af725cf24708fd5967db6d2431c7afb9be47082538f62ab7b49cad7c68cd290f0c429b3706fbb8df2dc'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Make authenticated API request to Strapi
 */
async function strapiRequest(endpoint, options = {}) {
    const url = `${STRAPI_CONFIG.url}/api${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${STRAPI_CONFIG.apiToken}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('Strapi API Error:', error);
        throw error;
    }
}

/**
 * Display loading state in container
 */
function showLoading(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}

/**
 * Display error message in container
 */
function showError(container, message) {
    container.innerHTML = `
        <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

/**
 * Reinitialize Webflow interactions after DOM update
 */
function refreshWebflow() {
    if (window.Webflow) {
        window.Webflow.destroy();
        window.Webflow.ready();
        window.Webflow.require('ix2').init();
    }
}

// ============================================
// PAGE-SPECIFIC INTEGRATIONS
// ============================================

/**
 * Load and display courses on courses.html
 */
async function loadCourses() {
    const container = document.querySelector('.courses-collection-list, .courses-grid, #courses-container');
    if (!container) return;
    
    showLoading(container);
    
    try {
        // Fetch courses with all relations
        const response = await strapiRequest('/courses?populate=*&sort=createdAt:desc');
        const courses = response.data;
        
        // Clear container
        container.innerHTML = '';
        
        // Get template from existing Webflow collection item (if exists)
        const template = document.querySelector('.w-dyn-item, .course-item');
        
        courses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-card w-dyn-item';
            
            // Construct course HTML matching Webflow structure
            courseElement.innerHTML = `
                <a href="/detail_courses.html?id=${course.id}" class="course-link-wrapper w-inline-block">
                    <div class="course-image-wrapper">
                        ${course.attributes.image?.data ? `
                            <img src="${STRAPI_CONFIG.url}${course.attributes.image.data.attributes.url}" 
                                 alt="${course.attributes.title}"
                                 class="course-image">
                        ` : `
                            <div class="course-image-placeholder"></div>
                        `}
                        ${course.attributes.badge ? `
                            <div class="course-badge">${course.attributes.badge}</div>
                        ` : ''}
                    </div>
                    <div class="course-content">
                        <h3 class="course-title">${course.attributes.title}</h3>
                        <p class="course-description">${course.attributes.description || ''}</p>
                        <div class="course-meta">
                            <div class="course-price">$${course.attributes.price || '0'}</div>
                            <div class="course-duration">${course.attributes.duration || '0'} hours</div>
                        </div>
                        <div class="course-instructor">${course.attributes.instructor || 'Staff'}</div>
                    </div>
                </a>
            `;
            
            container.appendChild(courseElement);
        });
        
        // Reinitialize Webflow interactions
        refreshWebflow();
        
    } catch (error) {
        showError(container, 'Failed to load courses. Please try again later.');
    }
}

/**
 * Load single course details on detail_courses.html
 */
async function loadCourseDetails() {
    // Get course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    if (!courseId) return;
    
    try {
        // Fetch course with all relations
        const response = await strapiRequest(`/courses/${courseId}?populate=*`);
        const course = response.data;
        
        // Update page elements
        document.querySelector('.course-title, h1').textContent = course.attributes.title;
        document.querySelector('.course-description').textContent = course.attributes.description;
        document.querySelector('.course-price').textContent = `$${course.attributes.price}`;
        document.querySelector('.course-duration').textContent = `${course.attributes.duration} hours`;
        
        // Update image if exists
        const imageElement = document.querySelector('.course-hero-image, .course-image');
        if (imageElement && course.attributes.image?.data) {
            imageElement.src = `${STRAPI_CONFIG.url}${course.attributes.image.data.attributes.url}`;
        }
        
        // Load course content/lessons if available
        if (course.attributes.lessons?.data) {
            const lessonsContainer = document.querySelector('.lessons-container');
            if (lessonsContainer) {
                lessonsContainer.innerHTML = course.attributes.lessons.data.map(lesson => `
                    <div class="lesson-item">
                        <h4>${lesson.attributes.title}</h4>
                        <p>${lesson.attributes.duration} min</p>
                    </div>
                `).join('');
            }
        }
        
        refreshWebflow();
        
    } catch (error) {
        console.error('Failed to load course details:', error);
    }
}

/**
 * Handle user authentication
 */
async function handleLogin(email, password) {
    try {
        const response = await fetch(`${STRAPI_CONFIG.url}/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store JWT token and user info
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard or reload page
            window.location.href = '/dashboard.html';
        } else {
            throw new Error(data.error?.message || 'Login failed');
        }
        
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

/**
 * Handle user registration
 */
async function handleSignup(email, password, username) {
    try {
        const response = await fetch(`${STRAPI_CONFIG.url}/api/auth/local/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username || email,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store JWT token and user info
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        } else {
            throw new Error(data.error?.message || 'Registration failed');
        }
        
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem('jwt');
}

/**
 * Get current user
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/';
}

/**
 * Load user profile data
 */
async function loadUserProfile() {
    if (!isAuthenticated()) {
        window.location.href = '/authentication-pages/sign-in.html';
        return;
    }
    
    const user = getCurrentUser();
    if (user) {
        // Update profile elements
        document.querySelector('.user-name').textContent = user.username || user.email;
        document.querySelector('.user-email').textContent = user.email;
    }
}

/**
 * Handle course enrollment
 */
async function enrollInCourse(courseId) {
    if (!isAuthenticated()) {
        window.location.href = '/authentication-pages/sign-in.html';
        return;
    }
    
    try {
        const response = await strapiRequest('/enrollments', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    course: courseId,
                    user: getCurrentUser().id,
                    status: 'pending_payment'
                }
            })
        });
        
        // Redirect to checkout
        window.location.href = `/checkout.html?enrollment=${response.data.id}`;
        
    } catch (error) {
        alert('Enrollment failed: ' + error.message);
    }
}

/**
 * Load shopping cart
 */
async function loadCart() {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartContainer = document.querySelector('.cart-items-container');
    
    if (!cartContainer) return;
    
    if (cartData.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    // Fetch course details for cart items
    const courseIds = cartData.map(item => item.courseId);
    const courses = await Promise.all(
        courseIds.map(id => strapiRequest(`/courses/${id}`))
    );
    
    let total = 0;
    cartContainer.innerHTML = courses.map(response => {
        const course = response.data;
        total += parseFloat(course.attributes.price || 0);
        
        return `
            <div class="cart-item">
                <div class="cart-item-title">${course.attributes.title}</div>
                <div class="cart-item-price">$${course.attributes.price}</div>
                <button onclick="removeFromCart(${course.id})">Remove</button>
            </div>
        `;
    }).join('');
    
    // Update total
    document.querySelector('.cart-total').textContent = `$${total.toFixed(2)}`;
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize Strapi integration when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Detect current page and load appropriate data
    const currentPath = window.location.pathname;
    
    // Route-based initialization
    if (currentPath.includes('courses.html')) {
        await loadCourses();
    } else if (currentPath.includes('detail_courses.html')) {
        await loadCourseDetails();
    } else if (currentPath.includes('checkout.html')) {
        await loadCart();
    } else if (currentPath.includes('dashboard.html') || currentPath.includes('profile.html')) {
        await loadUserProfile();
    }
    
    // Setup authentication forms
    const loginForm = document.querySelector('#login-form, .login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.querySelector('[name="email"]').value;
            const password = e.target.querySelector('[name="password"]').value;
            await handleLogin(email, password);
        });
    }
    
    const signupForm = document.querySelector('#signup-form, .signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.querySelector('[name="email"]').value;
            const password = e.target.querySelector('[name="password"]').value;
            const username = e.target.querySelector('[name="username"]')?.value;
            await handleSignup(email, password, username);
        });
    }
    
    // Setup logout button
    const logoutBtn = document.querySelector('.logout-btn, #logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Show/hide auth elements based on login status
    if (isAuthenticated()) {
        document.querySelectorAll('.logged-in-only').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.logged-out-only').forEach(el => el.style.display = 'none');
    } else {
        document.querySelectorAll('.logged-in-only').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.logged-out-only').forEach(el => el.style.display = 'block');
    }
});

// ============================================
// EXPORT FOR GLOBAL USE
// ============================================

// Make functions available globally for onclick handlers
window.enrollInCourse = enrollInCourse;
window.logout = logout;
window.removeFromCart = (courseId) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const newCart = cart.filter(item => item.courseId !== courseId);
    localStorage.setItem('cart', JSON.stringify(newCart));
    loadCart();
};

window.addToCart = (courseId) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.find(item => item.courseId === courseId)) {
        cart.push({ courseId, addedAt: new Date().toISOString() });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    } else {
        alert('Already in cart');
    }
};