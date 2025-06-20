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

        // Fetch publications from each table
        const [journalArticles, conferenceArticles, bookChapters, patents] = await Promise.all([
            fetchPublications('journal_articles', category),
            fetchPublications('conference_articles', category),
            fetchPublications('book_chapters', category),
            fetchPublications('patents', category)
        ]);

        // Hide loading and show publications container
        document.getElementById('loading').style.display = 'none';
        document.getElementById('publications-container').style.display = 'block';

        // Display publications
        displayPublications('journal-articles-list', journalArticles, 'journal-articles');
        displayPublications('conference-articles-list', conferenceArticles, 'conference-articles');
        displayPublications('book-chapters-list', bookChapters, 'book-chapters');
        displayPublications('patents-list', patents, 'patents');

    } catch (error) {
        console.error('Error fetching publications:', error);
        document.getElementById('loading').textContent = 'Error loading publications. Please try again later.';
    }
});

async function fetchPublications(table, category) {
    const { data, error } = await window.supabaseClient
        .from(table)
        .select('*')
        .eq('category', category)
        .order('year', { ascending: false });

    if (error) throw error;
    return data || [];
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
    const sections = ['journal-articles', 'conference-articles', 'book-chapters', 'patents'];
    sections.forEach(section => {
        const container = document.getElementById(`${section}-list`);
        if (container.innerHTML.trim() === '') {
            container.parentElement.style.display = 'none';
        }
    });
} 