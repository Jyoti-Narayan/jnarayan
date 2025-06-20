// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const $navbarBurger = document.querySelector('.navbar-burger');
    const $navbarMenu = document.querySelector('.navbar-menu');
    const $navbarItems = document.querySelectorAll('.navbar-item');
    const $header = document.querySelector('.navbar');
    const navbar = document.querySelector('.navbar');
    const aboutSection = document.querySelector('#about');

    // Navbar burger functionality
    if ($navbarBurger && $navbarMenu) {
        console.log('Navbar burger and menu found, adding click listener');
        $navbarBurger.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Burger clicked!');
            $navbarBurger.classList.toggle('is-active');
            $navbarMenu.classList.toggle('is-active');
            console.log('Menu classes after toggle:', $navbarMenu.classList.toString());
            console.log('Menu computed display:', window.getComputedStyle($navbarMenu).display);
        });
    } else {
        console.log('Navbar elements not found:', { burger: $navbarBurger, menu: $navbarMenu });
    }

    // Close mobile menu when clicking a link
    if ($navbarItems) {
        $navbarItems.forEach(item => {
            if (!item) return;
            item.addEventListener('click', () => {
                if ($navbarBurger && $navbarMenu) {
                    $navbarBurger.classList.remove('is-active');
                    $navbarMenu.classList.remove('is-active');
                }
            });
        });
    }

    // Handle navbar scroll effect
    if ($header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                $header.classList.add('scrolled');
            } else {
                $header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll handling
    if ($navbarItems) {
        $navbarItems.forEach(item => {
            if (!item) return;
            
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href || !href.startsWith('#')) return;

                e.preventDefault();
                
                // Remove any existing active states
                $navbarItems.forEach(navItem => navItem.classList.remove('is-active'));
                
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const navbarHeight = $header ? $header.offsetHeight : 0;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Update footer year
    const footerYear = document.getElementById('current-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // Section visibility tracking
    const observerOptions = {
        root: null,
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        rootMargin: `-${($header ? $header.offsetHeight + 20 : 0)}px 0px -20% 0px`
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        // Get the section most in view
        let maxVisibility = 0;
        let mostVisibleSection = null;

        entries.forEach(entry => {
            const rect = entry.target.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate how much of the section is visible
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const sectionVisibility = visibleHeight / entry.target.offsetHeight;
            
            // Consider both intersection ratio and viewport position
            const visibility = entry.intersectionRatio * sectionVisibility;
            
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                mostVisibleSection = entry.target;
            }
        });

        // First remove all active states
        $navbarItems.forEach(item => item.classList.remove('is-active'));

        // Then set active state only for the most visible section
        if (mostVisibleSection && maxVisibility > 0.3) {
            const sectionId = mostVisibleSection.id;
            const activeNavItem = document.querySelector(`.navbar-item[href="#${sectionId}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('is-active');
            }
        }
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });

    // Additional scroll event listener to handle edge cases
    window.addEventListener('scroll', () => {
        // Force recalculation of section visibility after scroll stops
        clearTimeout(window.scrollEndTimeout);
        window.scrollEndTimeout = setTimeout(() => {
            const entries = [];
            document.querySelectorAll('section[id]').forEach(section => {
                const rect = section.getBoundingClientRect();
                entries.push({
                    target: section,
                    isIntersecting: rect.top < window.innerHeight && rect.bottom > 0,
                    intersectionRatio: Math.min(1, Math.max(0, 
                        (Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)) / rect.height
                    )),
                    boundingClientRect: rect
                });
            });
            sectionObserver.callback(entries);
        }, 100);
    }, { passive: true });

    // Mouse move effect for research category cards
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Handle navbar scroll effect and active section tracking
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const aboutSection = document.querySelector('#about');
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.navbar-item');
        
        if (!navbar || !aboutSection) return;
        
        // Calculate the midpoint of the about section
        const aboutStart = aboutSection.offsetTop;
        const aboutMidpoint = aboutStart + (aboutSection.offsetHeight / 2);
        
        function setActiveNavItem() {
            const scrollPosition = window.scrollY + navbar.offsetHeight;

            // Handle navbar transformation at about section midpoint
            if (scrollPosition > aboutMidpoint) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Handle active section tracking
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - navbar.offsetHeight - 20;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section.id;
                    
                    // Update URL hash without scrolling
                    const urlHash = window.location.hash.slice(1);
                    if (urlHash !== currentSection) {
                        history.replaceState(null, null, `#${currentSection}`);
                    }
                }
            });

            // Update active nav item
            navItems.forEach(item => {
                const href = item.getAttribute('href');
                if (!href) return;
                
                const sectionId = href.includes('#') ? href.split('#')[1] : '';
                
                if (sectionId === currentSection) {
                    item.classList.add('is-active');
                } else {
                    item.classList.remove('is-active');
                }
            });
        }

        // Initial check
        setActiveNavItem();
        
        // Add scroll event listener with throttling for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setActiveNavItem();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Handle smooth scrolling for navbar links
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                
                e.preventDefault();
                const targetId = href.split('#')[1];
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const targetPosition = targetSection.offsetTop - navbar.offsetHeight + 2;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initialize all functionality when DOM is loaded
    handleNavbarScroll();
});

// Expose initialization function for other scripts
window.initializeNavigation = function() {
    // Implementation of the function
};

// Function to format date
function formatDate(dateStr) {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
}

// Function to create experience item HTML
function createExperienceItem(experience) {
    return `
        <div class="experience-item">
            <h4>${experience.title}</h4>
            <p class="institution">${experience.institution}</p>
            <p class="duration">${formatDate(experience.start_date)} - ${formatDate(experience.end_date)}</p>
            ${experience.description ? `<p class="description">${experience.description}</p>` : ''}
        </div>
    `;
}

// Function to fetch and display experiences
async function loadExperiences() {
    try {
        // Wait for Supabase client to be ready
        if (!window.supabaseClient && window.initializeSupabaseClient) {
            console.log('Waiting for Supabase client to initialize...');
            await window.initializeSupabaseClient();
        }
        
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data: experiences, error } = await window.supabaseClient
            .from('experiences')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;

        // Group experiences by type
        const groupedExperiences = experiences.reduce((acc, exp) => {
            if (!acc[exp.type]) {
                acc[exp.type] = [];
            }
            acc[exp.type].push(exp);
            return acc;
        }, {});

        // Render professional experience
        const professionalContainer = document.getElementById('professional-experience');
        if (professionalContainer && groupedExperiences.professional) {
            professionalContainer.innerHTML = `
                <h4>Professional Experience</h4>
                <div class="experience-items">
                    ${groupedExperiences.professional.map(exp => createExperienceItem(exp)).join('')}
                </div>
            `;
        }

        // Render administrative experience
        const adminContainer = document.getElementById('administrative-experience');
        if (adminContainer && groupedExperiences.administrative) {
            adminContainer.innerHTML = `
                <h4>Administrative Experience</h4>
                <div class="experience-items">
                    ${groupedExperiences.administrative.map(exp => createExperienceItem(exp)).join('')}
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading experiences:', error);
        const container = document.querySelector('.experience-grid');
        if (container) {
            container.innerHTML = `
                <div class="notification is-danger is-light">
                    <p class="has-text-centered">Error loading experiences. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Initialize experiences when DOM is loaded
document.addEventListener('DOMContentLoaded', loadExperiences); 