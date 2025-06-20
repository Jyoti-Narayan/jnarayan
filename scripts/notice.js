// Notice functionality
let notices = [];
let autoScrollInterval;
let isScrolling = true;
const SCROLL_SPEED = 1.2;
let animationFrameId = null;
let isResetting = false;

async function fetchNotices() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('noticeboard')
            .select('title, date')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching notices:', error);
            const container = document.getElementById('notice-container');
            if (container) {
                container.innerHTML = '<p class="has-text-centered">Error loading notices</p>';
            }
            return;
        }

        if (!data || data.length === 0) {
            const container = document.getElementById('notice-container');
            if (container) {
                container.innerHTML = '<p class="has-text-centered">No notices available</p>';
            }
            return;
        }

        notices = data;
        renderNotices();
        initializeAutoScroll();
    } catch (error) {
        console.error('Error in fetchNotices:', error);
        const container = document.getElementById('notice-container');
        if (container) {
            container.innerHTML = '<p class="has-text-centered">Error loading notices</p>';
        }
    }
}

function renderNotices() {
    const container = document.getElementById('notice-container');
    if (!container || !notices.length) return;

    // Create the notices list
    const noticesList = notices.map(notice => `
        <div class="notice-item">
            <div class="notice-content">
                <div class="notice-title">${notice.title}</div>
                <div class="notice-date">${new Date(notice.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `<div class="notice-scroll">${noticesList}</div>`;
}

function initializeAutoScroll() {
    const container = document.getElementById('notice-container');
    if (!container) return;

    let lastScrollTop = 0;

    function smoothScrollToTop() {
        isResetting = true;
        const start = container.scrollTop;
        const startTime = performance.now();
        const duration = 500; // 500ms for reset animation

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 2);
            
            container.scrollTop = start * (1 - easeOut);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                isResetting = false;
            }
        }

        requestAnimationFrame(animateScroll);
    }

    function animate() {
        if (isScrolling && !isResetting) {
            // Increment scroll position
            container.scrollTop += SCROLL_SPEED;

            // If we've reached the bottom
            if (container.scrollTop >= (container.scrollHeight - container.offsetHeight - 10)) {
                smoothScrollToTop();
            }

            // Update lastScrollTop
            lastScrollTop = container.scrollTop;
        }
        
        // Request next frame
        animationFrameId = requestAnimationFrame(animate);
    }

    function startAutoScroll() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animate();
    }

    // Start auto-scrolling
    startAutoScroll();

    // Pause on hover
    container.addEventListener('mouseenter', () => {
        if (!isResetting) {
            isScrolling = false;
        }
    });

    container.addEventListener('mouseleave', () => {
        isScrolling = true;
    });

    // Handle manual scrolling
    let scrollTimeout;
    container.addEventListener('scroll', () => {
        if (!isResetting && !isScrolling) {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                if (!container.matches(':hover')) {
                    isScrolling = true;
                }
            }, 800);
        }
    });
}

// Cleanup function to prevent memory leaks
function cleanup() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

// Initialize notices when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure Supabase is initialized
    setTimeout(() => {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            const container = document.getElementById('notice-container');
            if (container) {
                container.innerHTML = '<p class="has-text-centered">Error: Database connection not available</p>';
            }
            return;
        }
        
        fetchNotices();
    }, 100);
});

// Cleanup when page is unloaded
window.addEventListener('unload', cleanup); 