document.addEventListener('DOMContentLoaded', () => {
    // Handle image loading animations
    const images = document.querySelectorAll('.carousel-image');
    if (images) {
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

    // Intersection Observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    if (sections) {
        sections.forEach(section => {
            if (!section.classList.contains('visible')) {
                sectionObserver.observe(section);
            }
        });
    }

    // Add section-container class to all major sections
    document.querySelectorAll('.gallery-section, .noticeboard-section, .research-areas, .education-section, .experience-section, .teaching-section, .students-section, .publications-section, .talks-section, .awards-section').forEach(section => {
        section.classList.add('section-container');
    });
}); 