// Projects functionality
document.addEventListener('DOMContentLoaded', async function() {
    async function fetchProjects() {
        try {
            console.log('Initializing projects fetch...');
            
            // Wait for Supabase client to be ready
            if (!window.supabaseClient && window.initializeSupabaseClient) {
                console.log('Waiting for Supabase client to initialize...');
                await window.initializeSupabaseClient();
            }
            
            if (!window.supabaseClient) {
                throw new Error('Supabase client not initialized');
            }

            console.log('Fetching projects from Supabase...');
            const { data, error } = await window.supabaseClient
                .from('projects')
                .select('*')
                .order('date', { ascending: false });

            console.log('Projects data:', data);
            console.log('Projects error:', error);

            if (error) {
                console.error('Error fetching projects:', error);
                const container = document.getElementById('projects-container');
                if (container) {
                    container.innerHTML = '<p class="has-text-centered">Error loading projects</p>';
                }
                return null;
            }

            if (!data || data.length === 0) {
                console.log('No projects found');
                const container = document.getElementById('projects-container');
                if (container) {
                    container.innerHTML = '<p class="has-text-centered">No projects available</p>';
                }
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error in fetchProjects:', error);
            const container = document.getElementById('projects-container');
            if (container) {
                container.innerHTML = '<p class="has-text-centered">Error loading projects</p>';
            }
            return null;
        }
    }

    function initProjects(projectsData) {
        console.log('Initializing projects with data:', projectsData);
        const container = document.getElementById('projects-container');
        if (!container || !projectsData) {
            console.log('Container or project data missing:', { container: !!container, projectsData: !!projectsData });
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Create slides
        projectsData.forEach((project, index) => {
            console.log('Creating slide for project:', project);
            const slide = document.createElement('div');
            slide.className = `carousel-slide${index === 0 ? ' active' : ''}`;
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'carousel-image-container';
            
            // Create and setup image
            const img = document.createElement('img');
            img.className = 'carousel-image';
            img.src = window.convertGoogleDriveUrl ? window.convertGoogleDriveUrl(project.image_url) : project.image_url;
            img.alt = `Project image ${index + 1}`;
            
            // Add loading state
            img.style.opacity = '0';
            img.onload = () => {
                console.log('Image loaded:', project.image_url);
                img.style.opacity = '1';
            };
            img.onerror = () => {
                console.error('Error loading image:', project.image_url);
                img.src = 'placeholder.jpg'; // You might want to add a placeholder image
            };
            
            // Add caption
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            caption.innerHTML = `
                <h4 class="project-title">${project.title}</h4>
            `;
            
            // Append elements
            imageContainer.appendChild(img);
            slide.appendChild(imageContainer);
            slide.appendChild(caption);
            container.appendChild(slide);
        });

        // Set up navigation
        const prevButton = document.querySelector('.ongoing-projects-section .carousel-nav.prev');
        const nextButton = document.querySelector('.ongoing-projects-section .carousel-nav.next');
        
        console.log('Navigation buttons:', { prev: !!prevButton, next: !!nextButton });

        let currentSlide = 0;
        const totalSlides = projectsData.length;
        const slides = container.querySelectorAll('.carousel-slide');

        function updateSlidePosition() {
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.classList.add('active');
                    slide.style.transform = 'translateX(0)';
                } else {
                    slide.classList.remove('active');
                    slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlidePosition();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlidePosition();
        }

        // Event listeners
        if (prevButton) prevButton.addEventListener('click', prevSlide);
        if (nextButton) nextButton.addEventListener('click', nextSlide);

        // Auto-advance slides
        let autoAdvance = setInterval(nextSlide, 5000);

        // Pause auto-advance on hover
        container.parentElement.addEventListener('mouseenter', () => clearInterval(autoAdvance));
        container.parentElement.addEventListener('mouseleave', () => {
            clearInterval(autoAdvance);
            autoAdvance = setInterval(nextSlide, 5000);
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
                    prevSlide();
                } else {
                    // Swipe left - go to next
                    nextSlide();
                }
            }
        }

        // Initial position
        updateSlidePosition();
        console.log('Projects carousel initialized successfully');
    }

    // Initialize projects with data from Supabase
    console.log('Starting projects initialization...');
    const projectsData = await fetchProjects();
    if (projectsData) {
        initProjects(projectsData);
    }
}); 