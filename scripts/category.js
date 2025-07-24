// Category page functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Get category from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (!category) {
        window.location.href = 'index.html';
        return;
    }

    // Set page title and category
    document.title = `${category} - Dr. Jyotindra Narayan`;
    document.getElementById('category-title').textContent = category;

    try {
        // Show loading state
        document.getElementById('loading').style.display = 'block';
        document.getElementById('publications-container').style.display = 'none';

        console.log(`Fetching publications for category: "${category}"`);

        // Fetch publications from each table
        const [journalArticles, conferenceArticles, bookChapters, books, patents] = await Promise.all([
            fetchPublications('journal_articles', category),
            fetchPublications('conference_articles', category),
            fetchPublications('book_chapters', category),
            fetchPublications('books', category),
            fetchPublications('patents', category)
        ]);

        console.log('All publications fetched:', {
            journalArticles: journalArticles.length,
            conferenceArticles: conferenceArticles.length,
            bookChapters: bookChapters.length,
            books: books.length,
            patents: patents.length
        });

        // Hide loading and show publications container
        document.getElementById('loading').style.display = 'none';
        document.getElementById('publications-container').style.display = 'block';

        // Display publications
        displayPublications('journal-articles-list', journalArticles, 'journal-articles');
        displayPublications('conference-articles-list', conferenceArticles, 'conference-articles');
        displayPublications('book-chapters-list', bookChapters, 'book-chapters');
        displayPublications('books-list', books, 'books');
        displayPublications('patents-list', patents, 'patents');

    } catch (error) {
        console.error('Error fetching publications:', error);
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.textContent = 'Error loading publications. Please try again later.';
        }
    }
});

// Function to extract categories from comma-separated string
function extractCategories(categoryString) {
    if (!categoryString) return [];
    return categoryString.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0);
}

// Function to check if a publication matches a category
function publicationMatchesCategory(publication, targetCategory) {
    if (!publication.category) {
        console.log(`Publication "${publication.title}" has no category`);
        return false;
    }
    
    const categories = extractCategories(publication.category);
    const matches = categories.includes(targetCategory);
    
    console.log(`Publication "${publication.title}" has categories: [${categories.join(', ')}], looking for: "${targetCategory}", matches: ${matches}`);
    
    return matches;
}

async function fetchPublications(table, category) {
    try {
        const { data, error } = await window.supabaseClient
            .from(table)
            .select('*')
            .order('year', { ascending: false });

        if (error) {
            console.error(`Error fetching from ${table}:`, error);
            throw error;
        }
        
        console.log(`Fetched ${data?.length || 0} publications from ${table}`);
        
        // Filter publications that match the category
        const filteredData = (data || []).filter(publication => {
            const matches = publicationMatchesCategory(publication, category);
            if (matches) {
                console.log(`Publication "${publication.title}" matches category "${category}"`);
            }
            return matches;
        });
        
        console.log(`Found ${filteredData.length} publications matching category "${category}" in ${table}`);
        return filteredData;
    } catch (error) {
        console.error(`Error in fetchPublications for ${table}:`, error);
        throw error;
    }
}

function displayPublications(containerId, publications, sectionId) {
    const container = document.getElementById(containerId);
    const section = document.getElementById(sectionId);
    
    if (!publications || publications.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    // Group by year
    const publicationsByYear = publications.reduce((acc, pub) => {
        if (!acc[pub.year]) {
            acc[pub.year] = [];
        }
        acc[pub.year].push(pub);
        return acc;
    }, {});

    // Sort years in descending order
    const years = Object.keys(publicationsByYear).sort((a, b) => b - a);

    let html = '';
    years.forEach(year => {
        html += `<div class="publication-year">${year}</div>`;
        
        publicationsByYear[year].forEach(pub => {
            html += `
                <div class="publication-item">
                    <div class="publication-title">${pub.title}</div>
                    ${pub.url ? `
                        <div class="publication-links">
                            <a href="${pub.url}" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i> View Publication
                            </a>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    });

    container.innerHTML = html;
}

function hideEmptySections() {
    const sections = ['journal-articles', 'conference-articles', 'book-chapters', 'books', 'patents'];
    sections.forEach(section => {
        const container = document.getElementById(`${section}-list`);
        if (container.innerHTML.trim() === '') {
            container.parentElement.style.display = 'none';
        }
    });
} 