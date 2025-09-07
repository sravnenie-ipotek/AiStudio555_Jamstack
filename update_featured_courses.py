#!/usr/bin/env python3

# Read the home.html file
with open('home.html', 'r') as f:
    content = f.read()

# Define the new featured courses HTML with multiple course cards
new_featured_courses = '''    <section class="section featured-courses">
      <div class="container">
        <div data-w-id="4481d4c6-c4a9-18cf-7ed1-edc5dd4e542d" style="opacity:0" class="section-title-wrapper align-center">
          <div class="section-subtitle-wrapper center-align">
            <div class="banner-subtitle-line left"></div>
            <div class="section-subtitle">Most Popular IT Courses</div>
            <div class="banner-subtitle-line right"></div>
          </div>
          <h2 class="section-title featured-courses">Most Popular IT Courses To Advance Your Career.</h2>
          <p class="section-description-text featured-courses">Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.</p>
        </div>
        <div data-w-id="7997d2e5-a547-6caf-56a9-fdfdbb488cbd" style="opacity:0" class="featured-courses-content">
          <div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100" class="featured-courses-tabs w-tabs">
            <div class="featured-courses-tab-menu w-tab-menu">
              <a data-w-tab="Tab 1" class="featured-courses-tab-link w-inline-block w-tab-link w--current">
                <div>All</div>
              </a>
              <a data-w-tab="Tab 2" class="featured-courses-tab-link w-inline-block w-tab-link">
                <div>Web Development</div>
              </a>
              <a data-w-tab="Tab 3" class="featured-courses-tab-link w-inline-block w-tab-link">
                <div>App Development</div>
              </a>
              <a data-w-tab="Tab 4" class="featured-courses-tab-link w-inline-block w-tab-link">
                <div>Machine Learning</div>
              </a>
              <a data-w-tab="Tab 5" class="featured-courses-tab-link w-inline-block w-tab-link">
                <div>Cloud Computing</div>
              </a>
            </div>
            <div class="featured-courses-tab-content w-tab-content">
              <div data-w-tab="Tab 1" class="featured-courses-tab-pane w-tab-pane w--tab-active">
                <div class="featured-courses-main-content">
                  <div class="featured-courses-collection-list-wrapper">
                    <div role="list" class="featured-courses-collection-list">
                      <!-- Course 1 -->
                      <div role="listitem" class="featured-courses-collection-item">
                        <div data-w-id="57446562-177c-4e4a-7340-7dc3fb271094" style="background-color:rgb(4,25,63)" class="featured-courses-single">
                          <a href="detail_courses.html" class="featured-courses-image-link w-inline-block">
                            <img loading="lazy" src="images/Demo-Image14.jpg" alt="React Development" class="featured-courses-image">
                          </a>
                          <div class="featured-courses-typography">
                            <div class="featured-courses-name-wrap">
                              <a href="detail_courses.html" class="featured-courses-name">Complete React Development Course</a>
                              <div class="featured-courses-rating">
                                <div class="featured-courses-rating-icon-wrapper">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                </div>
                                <div class="featured-courses-rating-text">4.9</div>
                              </div>
                              <div class="courses-video-session-time-wrap">
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">48 Lessons</div>
                                </div>
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">12 Weeks</div>
                                </div>
                              </div>
                              <div class="featured-courses-button-wrapper">
                                <a href="detail_courses.html" data-w-id="897edd3e-881e-ddfc-6304-6ee94d687c54" style="background-color:rgba(255,255,255,0);color:rgb(255,255,255)" class="primary-button secondary w-inline-block">
                                  <div class="primary-button-text-wrap">
                                    <div style="-webkit-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block">Course Details</div>
                                    <div style="-webkit-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block is-text-absolute">Course Details</div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div style="background-color:rgb(0,128,255);color:rgb(255,255,255)" class="featured-courses-categories-tag">Web Dev</div>
                        </div>
                      </div>
                      
                      <!-- Course 2 -->
                      <div role="listitem" class="featured-courses-collection-item">
                        <div style="background-color:rgb(4,25,63)" class="featured-courses-single">
                          <a href="detail_courses.html" class="featured-courses-image-link w-inline-block">
                            <img loading="lazy" src="images/Demo-Image15.jpg" alt="Python Programming" class="featured-courses-image">
                          </a>
                          <div class="featured-courses-typography">
                            <div class="featured-courses-name-wrap">
                              <a href="detail_courses.html" class="featured-courses-name">Python for Data Science & AI</a>
                              <div class="featured-courses-rating">
                                <div class="featured-courses-rating-icon-wrapper">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                </div>
                                <div class="featured-courses-rating-text">5.0</div>
                              </div>
                              <div class="courses-video-session-time-wrap">
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">60 Lessons</div>
                                </div>
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">16 Weeks</div>
                                </div>
                              </div>
                              <div class="featured-courses-button-wrapper">
                                <a href="detail_courses.html" style="background-color:rgba(255,255,255,0);color:rgb(255,255,255)" class="primary-button secondary w-inline-block">
                                  <div class="primary-button-text-wrap">
                                    <div style="-webkit-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block">Course Details</div>
                                    <div style="-webkit-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block is-text-absolute">Course Details</div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div style="background-color:rgb(255,87,51);color:rgb(255,255,255)" class="featured-courses-categories-tag">Data Science</div>
                        </div>
                      </div>
                      
                      <!-- Course 3 -->
                      <div role="listitem" class="featured-courses-collection-item">
                        <div style="background-color:rgb(4,25,63)" class="featured-courses-single">
                          <a href="detail_courses.html" class="featured-courses-image-link w-inline-block">
                            <img loading="lazy" src="images/Demo-Image16.jpg" alt="Mobile Development" class="featured-courses-image">
                          </a>
                          <div class="featured-courses-typography">
                            <div class="featured-courses-name-wrap">
                              <a href="detail_courses.html" class="featured-courses-name">iOS & Android App Development</a>
                              <div class="featured-courses-rating">
                                <div class="featured-courses-rating-icon-wrapper">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                </div>
                                <div class="featured-courses-rating-text">4.8</div>
                              </div>
                              <div class="courses-video-session-time-wrap">
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">55 Lessons</div>
                                </div>
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">14 Weeks</div>
                                </div>
                              </div>
                              <div class="featured-courses-button-wrapper">
                                <a href="detail_courses.html" style="background-color:rgba(255,255,255,0);color:rgb(255,255,255)" class="primary-button secondary w-inline-block">
                                  <div class="primary-button-text-wrap">
                                    <div style="-webkit-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block">Course Details</div>
                                    <div style="-webkit-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block is-text-absolute">Course Details</div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div style="background-color:rgb(76,175,80);color:rgb(255,255,255)" class="featured-courses-categories-tag">Mobile Dev</div>
                        </div>
                      </div>
                      
                      <!-- Course 4 -->
                      <div role="listitem" class="featured-courses-collection-item">
                        <div style="background-color:rgb(4,25,63)" class="featured-courses-single">
                          <a href="detail_courses.html" class="featured-courses-image-link w-inline-block">
                            <img loading="lazy" src="images/Template-Core-Features-Image.jpg" alt="Cloud Computing" class="featured-courses-image">
                          </a>
                          <div class="featured-courses-typography">
                            <div class="featured-courses-name-wrap">
                              <a href="detail_courses.html" class="featured-courses-name">AWS Cloud Architecture Mastery</a>
                              <div class="featured-courses-rating">
                                <div class="featured-courses-rating-icon-wrapper">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                </div>
                                <div class="featured-courses-rating-text">4.9</div>
                              </div>
                              <div class="courses-video-session-time-wrap">
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">42 Lessons</div>
                                </div>
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">10 Weeks</div>
                                </div>
                              </div>
                              <div class="featured-courses-button-wrapper">
                                <a href="detail_courses.html" style="background-color:rgba(255,255,255,0);color:rgb(255,255,255)" class="primary-button secondary w-inline-block">
                                  <div class="primary-button-text-wrap">
                                    <div style="-webkit-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block">Course Details</div>
                                    <div style="-webkit-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block is-text-absolute">Course Details</div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div style="background-color:rgb(156,39,176);color:rgb(255,255,255)" class="featured-courses-categories-tag">Cloud</div>
                        </div>
                      </div>
                      
                      <!-- Course 5 -->
                      <div role="listitem" class="featured-courses-collection-item">
                        <div style="background-color:rgb(4,25,63)" class="featured-courses-single">
                          <a href="detail_courses.html" class="featured-courses-image-link w-inline-block">
                            <img loading="lazy" src="images/Template-Core-Features-Image2.jpg" alt="Machine Learning" class="featured-courses-image">
                          </a>
                          <div class="featured-courses-typography">
                            <div class="featured-courses-name-wrap">
                              <a href="detail_courses.html" class="featured-courses-name">Machine Learning & Neural Networks</a>
                              <div class="featured-courses-rating">
                                <div class="featured-courses-rating-icon-wrapper">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                </div>
                                <div class="featured-courses-rating-text">4.7</div>
                              </div>
                              <div class="courses-video-session-time-wrap">
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">72 Lessons</div>
                                </div>
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">20 Weeks</div>
                                </div>
                              </div>
                              <div class="featured-courses-button-wrapper">
                                <a href="detail_courses.html" style="background-color:rgba(255,255,255,0);color:rgb(255,255,255)" class="primary-button secondary w-inline-block">
                                  <div class="primary-button-text-wrap">
                                    <div style="-webkit-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block">Course Details</div>
                                    <div style="-webkit-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block is-text-absolute">Course Details</div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div style="background-color:rgb(255,152,0);color:rgb(255,255,255)" class="featured-courses-categories-tag">AI/ML</div>
                        </div>
                      </div>
                      
                      <!-- Course 6 -->
                      <div role="listitem" class="featured-courses-collection-item">
                        <div style="background-color:rgb(4,25,63)" class="featured-courses-single">
                          <a href="detail_courses.html" class="featured-courses-image-link w-inline-block">
                            <img loading="lazy" src="images/Template-Core-Features-Image3.jpg" alt="DevOps Engineering" class="featured-courses-image">
                          </a>
                          <div class="featured-courses-typography">
                            <div class="featured-courses-name-wrap">
                              <a href="detail_courses.html" class="featured-courses-name">DevOps Engineering & CI/CD</a>
                              <div class="featured-courses-rating">
                                <div class="featured-courses-rating-icon-wrapper">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                  <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                                </div>
                                <div class="featured-courses-rating-text">4.8</div>
                              </div>
                              <div class="courses-video-session-time-wrap">
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">38 Lessons</div>
                                </div>
                                <div class="courses-video-session-time">
                                  <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                                  <div class="courses-video-session-time-text">8 Weeks</div>
                                </div>
                              </div>
                              <div class="featured-courses-button-wrapper">
                                <a href="detail_courses.html" style="background-color:rgba(255,255,255,0);color:rgb(255,255,255)" class="primary-button secondary w-inline-block">
                                  <div class="primary-button-text-wrap">
                                    <div style="-webkit-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block">Course Details</div>
                                    <div style="-webkit-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block is-text-absolute">Course Details</div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div style="background-color:rgb(96,125,139);color:rgb(255,255,255)" class="featured-courses-categories-tag">DevOps</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Other tab panes can remain empty for now -->
              <div data-w-tab="Tab 2" class="featured-courses-tab-pane w-tab-pane"></div>
              <div data-w-tab="Tab 3" class="featured-courses-tab-pane w-tab-pane"></div>
              <div data-w-tab="Tab 4" class="featured-courses-tab-pane w-tab-pane"></div>
              <div data-w-tab="Tab 5" class="featured-courses-tab-pane w-tab-pane"></div>
            </div>
          </div>
        </div>
        <div class="featured-courses-btn-wrapper">
          <a href="courses.html" data-w-id="7e7dff23-d8a7-33c6-c170-b77124309a56" class="primary-button w-inline-block">
            <div class="primary-button-text-wrap">
              <div style="-webkit-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block">Uncover All Courses</div>
              <div style="-webkit-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 250%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" class="primary-button-text-block is-text-absolute">Uncover All Courses</div>
            </div>
          </a>
        </div>
      </div>
    </section>'''

# Find and replace the featured courses section
import re

# Find the featured courses section pattern
pattern = r'<section class="section featured-courses">.*?</section>'
match = re.search(pattern, content, re.DOTALL)

if match:
    # Replace the section
    content = content[:match.start()] + new_featured_courses + content[match.end():]
    
    # Write the modified content back
    with open('home.html', 'w') as f:
        f.write(content)
    
    print("✓ Updated Featured Courses section with 6 course cards")
    print("✓ Added course images and complete information")
    print("✓ Removed 'No items found' messages")
else:
    print("✗ Could not find Featured Courses section to replace")