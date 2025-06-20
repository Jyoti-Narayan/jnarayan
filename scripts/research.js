// Research categories functionality
document.addEventListener('DOMContentLoaded', async function() {
    const CATEGORIES = [
        { name: 'Medical Robotics', icon: 'fas fa-robot' },
        { name: 'Robust Control', icon: 'fas fa-sliders-h' },
        { name: 'Data-Driven Control', icon: 'fas fa-database' },
        { name: 'Human-Robot Interaction', icon: 'fas fa-users-cog' },
        { name: 'Rehabilitation Robotics', icon: 'fas fa-walking' },
        { name: 'Bioengineering', icon: 'fas fa-dna' },
        { name: 'Gait Analysis', icon: 'fas fa-shoe-prints' },
        { name: 'Generative AI for Time Series Forecasting', icon: 'fas fa-chart-line' },
        { name: 'Predictive Modeling for Neurodegenerative diseases', icon: 'fas fa-brain' }
    ];

    async function fetchCategoryStats() {
        try {
            if (!window.supabaseClient) {
                throw new Error('Supabase client not initialized');
            }

            const stats = {};
            
            // Initialize all categories with zero counts
            CATEGORIES.forEach(category => {
                stats[category.name] = {
                    total: 0,
                    journals: 0,
                    conferences: 0,
                    books: 0,
                    patents: 0
                };
            });

            // Fetch counts from all tables
            const tables = ['journal_articles', 'conference_articles', 'book_chapters', 'patents'];
            const promises = tables.map(table => 
                window.supabaseClient
                    .from(table)
                    .select('category')
                    .not('category', 'is', null)
            );

            const results = await Promise.all(promises);

            // Process results
            results.forEach((result, index) => {
                if (result.error) {
                    console.error(`Error fetching ${tables[index]}:`, result.error);
                    return;
                }

                result.data.forEach(item => {
                    if (item.category && stats[item.category]) {
                        stats[item.category].total++;
                        switch(tables[index]) {
                            case 'journal_articles':
                                stats[item.category].journals++;
                                break;
                            case 'conference_articles':
                                stats[item.category].conferences++;
                                break;
                            case 'book_chapters':
                                stats[item.category].books++;
                                break;
                            case 'patents':
                                stats[item.category].patents++;
                                break;
                        }
                    }
                });
            });

            return stats;
        } catch (error) {
            console.error('Error fetching category stats:', error);
            return null;
        }
    }

    function renderResearchCategories(stats) {
        const container = document.getElementById('research-categories');
        if (!container) return;

        let html = '';
        CATEGORIES.forEach(category => {
            const categoryStats = stats[category.name] || { total: 0 };
            html += `
                <div class="category-card">
                    <div class="category-info">
                        <i class="${category.icon}"></i>
                        <a href="category.html?category=${encodeURIComponent(category.name)}" class="category-name">
                            ${category.name}
                        </a>
                    </div>
                    <div class="category-stats">
                        <span class="total-count">${categoryStats.total}</span>
                        <span class="stat-label">Publications</span>
                    </div>
                    <div class="category-details">
                        ${categoryStats.journals ? `<span>${categoryStats.journals} Journals</span>` : ''}
                        ${categoryStats.conferences ? `<span>${categoryStats.conferences} Conferences</span>` : ''}
                        ${categoryStats.books ? `<span>${categoryStats.books} Books</span>` : ''}
                        ${categoryStats.patents ? `<span>${categoryStats.patents} Patents</span>` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Initialize research categories
    const categoryStats = await fetchCategoryStats();
    if (categoryStats) {
        renderResearchCategories(categoryStats);
    }
}); 