// Dynamic category management system
let allCategories = new Set();

// Function to extract categories from comma-separated string
function extractCategories(categoryString) {
    if (!categoryString) return [];
    return categoryString.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0);
}

// Function to fetch all unique categories from all publication tables
async function fetchAllCategories() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const tables = ['books', 'journal_articles', 'conference_articles', 'book_chapters', 'patents'];
        const allCategoryPromises = tables.map(async (table) => {
            const { data, error } = await window.supabaseClient
                .from(table)
                .select('category')
                .not('category', 'is', null);
            
            if (error) {
                console.error(`Error fetching categories from ${table}:`, error);
                return [];
            }
            
            return data || [];
        });

        const results = await Promise.all(allCategoryPromises);
        
        // Extract all unique categories
        results.forEach(tableData => {
            tableData.forEach(row => {
                if (row.category) {
                    const categories = extractCategories(row.category);
                    categories.forEach(cat => allCategories.add(cat));
                }
            });
        });

        return Array.from(allCategories).sort();
    } catch (error) {
        console.error('Error fetching all categories:', error);
        return [];
    }
}

// Function to check if a publication matches a category
function publicationMatchesCategory(publication, targetCategory) {
    if (!publication.category) return false;
    const categories = extractCategories(publication.category);
    return categories.includes(targetCategory);
}

// Function to render research categories dynamically
async function renderResearchCategories() {
    try {
        const categories = await fetchAllCategories();
        
        if (categories.length === 0) {
            console.warn('No categories found, using fallback categories');
            // Fallback to original categories if none found
            categories.push(
                'Medical Robotics',
                'Robust Control',
                'Data-Driven Control',
                'Human-Robot Interaction',
                'Rehabilitation Robotics',
                'Bioengineering',
                'Gait Analysis',
                'Generative AI for Time Series Forecasting',
                'Predictive Modeling for Neurodegenerative diseases',
                'Cyber-Physical Systems'
            );
        }

        const researchGrid = document.querySelector('.research-grid');
        if (!researchGrid) {
            console.error('Research grid not found');
            return;
        }

        // Clear existing content
        researchGrid.innerHTML = '';

        // Create category items dynamically
        categories.forEach(category => {
            const researchItem = document.createElement('div');
            researchItem.className = 'research-item';
            researchItem.innerHTML = `
                <a href="category.html?category=${encodeURIComponent(category)}" class="category-link">
                    <h4>${category}</h4>
                </a>
            `;
            researchGrid.appendChild(researchItem);
        });

        console.log('Research categories rendered dynamically:', categories);
    } catch (error) {
        console.error('Error rendering research categories:', error);
    }
}

// Initialize categories when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await renderResearchCategories();
    } catch (error) {
        console.error('Error initializing categories:', error);
    }
});

// Export functions for use in other scripts
window.extractCategories = extractCategories;
window.publicationMatchesCategory = publicationMatchesCategory;
window.fetchAllCategories = fetchAllCategories; 
