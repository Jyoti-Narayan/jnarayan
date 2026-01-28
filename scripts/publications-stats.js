// Publications Stats - Animated counter for homepage
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch publication counts from Supabase
    async function fetchPublicationCounts() {
        try {
            if (!window.supabaseClient) {
                throw new Error('Supabase client not initialized');
            }

            const [books, journals, conferences, chapters, patents] = await Promise.all([
                window.supabaseClient.from('books').select('id', { count: 'exact', head: true }),
                window.supabaseClient.from('journal_articles').select('id', { count: 'exact', head: true }),
                window.supabaseClient.from('conference_articles').select('id', { count: 'exact', head: true }),
                window.supabaseClient.from('book_chapters').select('id', { count: 'exact', head: true }),
                window.supabaseClient.from('patents').select('id', { count: 'exact', head: true })
            ]);

            return {
                books: books.count || 0,
                journals: journals.count || 0,
                conferences: conferences.count || 0,
                chapters: chapters.count || 0,
                patents: patents.count || 0
            };
        } catch (error) {
            console.error('Error fetching publication counts:', error);
            return { books: 0, journals: 0, conferences: 0, chapters: 0, patents: 0 };
        }
    }

    // Animate counter from 0 to target
    function animateCounter(element, target, duration = 2000) {
        if (!element || target === 0) {
            if (element) element.textContent = '0';
            return;
        }

        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Initialize stats animation
    async function initPublicationStats() {
        const statsSection = document.getElementById('publications');
        if (!statsSection) return;

        const counts = await fetchPublicationCounts();
        
        // Set data-target attributes
        const statBooks = document.getElementById('stat-books');
        const statJournals = document.getElementById('stat-journals');
        const statConferences = document.getElementById('stat-conferences');
        const statChapters = document.getElementById('stat-chapters');
        const statPatents = document.getElementById('stat-patents');

        if (statBooks) statBooks.dataset.target = counts.books;
        if (statJournals) statJournals.dataset.target = counts.journals;
        if (statConferences) statConferences.dataset.target = counts.conferences;
        if (statChapters) statChapters.dataset.target = counts.chapters;
        if (statPatents) statPatents.dataset.target = counts.patents;

        let hasAnimated = false;

        function triggerAnimation() {
            if (hasAnimated) return;
            
            if (isInViewport(statsSection)) {
                hasAnimated = true;
                
                animateCounter(statBooks, counts.books);
                animateCounter(statJournals, counts.journals);
                animateCounter(statConferences, counts.conferences);
                animateCounter(statChapters, counts.chapters);
                animateCounter(statPatents, counts.patents);
                
                // Remove scroll listener after animation
                window.removeEventListener('scroll', triggerAnimation);
            }
        }

        // Check on load and scroll
        triggerAnimation();
        window.addEventListener('scroll', triggerAnimation);
    }

    // Wait for Supabase to be ready
    await new Promise(resolve => setTimeout(resolve, 500));
    initPublicationStats();
});
