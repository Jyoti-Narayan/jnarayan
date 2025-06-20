// Gallery and Notice functionality
let currentSlide = 0;
let galleryImages = [];

async function fetchGalleryImages() {
    const { data, error } = await supabaseClient
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching gallery images:', error);
        return;
    }

    galleryImages = data;
    renderGallery();
    setupCarousel();
}

function renderGallery() {
    const container = document.getElementById('gallery-container');
    const indicators = document.getElementById('gallery-indicators');
    
    if (!galleryImages || galleryImages.length === 0) {
        container.innerHTML = '<p class="has-text-centered">No images available</p>';
        return;
    }

    // Create slides
    container.innerHTML = galleryImages.map((item, index) => `
        <div class="carousel-slide" data-index="${index}">
            <img src="${item.image_url}" alt="Gallery image ${index + 1}">
            ${item.caption ? `<div class="carousel-caption">${item.caption}</div>` : ''}
        </div>
    `).join('');

    // Create indicators
    indicators.innerHTML = galleryImages.map((_, index) => `
        <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                data-index="${index}" 
                aria-label="Go to slide ${index + 1}">
        </button>
    `).join('');
}

function setupCarousel() {
    const container = document.getElementById('gallery-container');
    const indicators = document.getElementById('gallery-indicators');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');

    // Set initial position
    updateSlidePosition();

    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
        updateSlidePosition();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % galleryImages.length;
        updateSlidePosition();
    });

    // Event listeners for indicators
    indicators.addEventListener('click', (e) => {
        const indicator = e.target.closest('.carousel-indicator');
        if (!indicator) return;

        currentSlide = parseInt(indicator.dataset.index);
        updateSlidePosition();
    });

    // Auto-advance slides every 5 seconds
    setInterval(() => {
        if (!document.hidden) {
            currentSlide = (currentSlide + 1) % galleryImages.length;
            updateSlidePosition();
        }
    }, 5000);

    // Pause auto-advance on hover
    container.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    container.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => {
            if (!document.hidden) {
                currentSlide = (currentSlide + 1) % galleryImages.length;
                updateSlidePosition();
            }
        }, 5000);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe right - go to previous
                currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
            } else {
                // Swipe left - go to next
                currentSlide = (currentSlide + 1) % galleryImages.length;
            }
            updateSlidePosition();
        }
    }
}

function updateSlidePosition() {
    const container = document.getElementById('gallery-container');
    const indicators = document.querySelectorAll('.carousel-indicator');

    // Update slide position
    container.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Notice board functionality
async function fetchNotices() {
    const { data, error } = await supabaseClient
        .from('noticeboard')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching notices:', error);
        return;
    }

    renderNotices(data);
}

function renderNotices(notices) {
    const container = document.getElementById('notice-container');
    
    if (!notices || notices.length === 0) {
        container.innerHTML = '<p class="has-text-centered">No notices available</p>';
        return;
    }

    const html = notices.map(notice => `
        <div class="notice-item">
            <h4 class="notice-title">${notice.title}</h4>
            <p class="notice-date">${new Date(notice.date).toLocaleDateString()}</p>
        </div>
    `).join('');

    container.innerHTML = html;
}

// Initialize both gallery and notice board when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchGalleryImages();
    fetchNotices();
}); 