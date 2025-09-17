/**
 * Mobile Video Background Enabler
 * Ensures video backgrounds play on mobile devices
 */

(function() {
    'use strict';

    console.log('🎬 Mobile Video Enabler: Initializing...');

    function enableMobileVideo() {
        // Find all background videos
        const videos = document.querySelectorAll('.banner-video video, .w-background-video video');

        if (videos.length === 0) {
            console.log('⚠️ No background videos found');
            return;
        }

        videos.forEach((video, index) => {
            console.log(`🎥 Processing video ${index + 1}/${videos.length}`);

            // Set required attributes for mobile playback
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('muted', 'true');
            video.setAttribute('autoplay', 'true');
            video.setAttribute('loop', 'true');

            // Remove any iOS-specific controls
            video.setAttribute('controls', 'false');

            // Set inline styles to ensure visibility
            video.style.display = 'block';
            video.style.visibility = 'visible';
            video.style.opacity = '1';

            // On mobile, fix positioning and z-index
            if (window.innerWidth <= 991) {
                video.style.setProperty('position', 'absolute', 'important');
                video.style.setProperty('top', '0', 'important');
                video.style.setProperty('left', '0', 'important');
                video.style.setProperty('width', '100%', 'important');
                video.style.setProperty('height', '100%', 'important');
                video.style.setProperty('object-fit', 'cover', 'important');
                video.style.setProperty('z-index', '1', 'important');
                video.style.setProperty('background-image', 'none', 'important');

                // Fix parent container
                const parent = video.closest('.banner-video, .w-background-video');
                if (parent) {
                    parent.style.setProperty('position', 'absolute', 'important');
                    parent.style.setProperty('top', '0', 'important');
                    parent.style.setProperty('left', '0', 'important');
                    parent.style.setProperty('width', '100%', 'important');
                    parent.style.setProperty('height', '100%', 'important');
                    parent.style.setProperty('z-index', '0', 'important');
                }

                // Fix banner section
                const bannerSection = video.closest('.section.banner');
                if (bannerSection) {
                    bannerSection.style.setProperty('position', 'relative', 'important');
                    bannerSection.style.setProperty('min-height', '100vh', 'important');
                    const bannerDiv = bannerSection.querySelector(':scope > div');
                    if (bannerDiv) {
                        bannerDiv.style.setProperty('position', 'relative', 'important');
                        bannerDiv.style.setProperty('min-height', '100vh', 'important');
                    }
                }
            }

            // Force video to load and play
            video.load();

            // Try to play the video
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`✅ Video ${index + 1} playing successfully`);
                    })
                    .catch(error => {
                        console.error(`❌ Video ${index + 1} play failed:`, error);

                        // Retry on user interaction
                        document.addEventListener('touchstart', function retryPlay() {
                            video.play()
                                .then(() => {
                                    console.log(`✅ Video ${index + 1} playing after user interaction`);
                                    document.removeEventListener('touchstart', retryPlay);
                                })
                                .catch(e => console.error('Still failed:', e));
                        }, { once: true });
                    });
            }

            // Monitor video state
            video.addEventListener('playing', () => {
                console.log(`🎬 Video ${index + 1} is playing`);
            });

            video.addEventListener('pause', () => {
                console.log(`⏸️ Video ${index + 1} paused - attempting to resume`);
                video.play().catch(e => console.error('Resume failed:', e));
            });

            // Ensure video stays visible
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'style' ||
                         mutation.attributeName === 'class')) {

                        // Ensure video remains visible and properly positioned on mobile
                        if (video.style.display === 'none' ||
                            video.style.visibility === 'hidden') {
                            video.style.display = 'block';
                            video.style.visibility = 'visible';
                            video.style.opacity = '1';
                            console.log(`🔧 Fixed video ${index + 1} visibility`);
                        }

                        // On mobile, maintain z-index
                        if (window.innerWidth <= 991 && video.style.zIndex !== '1') {
                            video.style.setProperty('z-index', '1', 'important');
                            console.log(`🔧 Fixed video ${index + 1} z-index`);
                        }
                    }
                });
            });

            // Start observing the video for attribute changes
            observer.observe(video, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });

            // Also observe parent container
            const parent = video.closest('.banner-video, .w-background-video');
            if (parent) {
                observer.observe(parent, {
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            }
        });

        console.log('✅ Mobile Video Enabler: Initialization complete');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enableMobileVideo);
    } else {
        enableMobileVideo();
    }

    // Also run after a delay to catch any dynamically loaded videos
    setTimeout(enableMobileVideo, 2000);

    // Handle visibility changes (when tab becomes active)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            const videos = document.querySelectorAll('.banner-video video, .w-background-video video');
            videos.forEach(video => {
                if (video.paused) {
                    video.play().catch(e => console.error('Visibility change play failed:', e));
                }
            });
        }
    });

    // Expose function globally for debugging
    window.enableMobileVideo = enableMobileVideo;

})();