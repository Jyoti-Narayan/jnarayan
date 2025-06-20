// Function to render awards items
function renderAwards(awards, type) {
    const container = document.getElementById(`${type.toLowerCase()}-list`);
    const categoryContainer = container.closest('.awards-category');
    
    if (!awards || awards.length === 0) {
        if (categoryContainer) {
            categoryContainer.style.display = 'none';
        }
        return;
    }
    
    if (categoryContainer) {
        categoryContainer.style.display = 'block';
    }
    
    let html = '';
    awards.forEach(award => {
        html += `
            <div class="award-item">
                <span class="bullet">•</span>
                <div class="award-content">
                    <span class="award-title">${award.title}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fetch and render awards by type
async function fetchAwards(type) {
    const { data, error } = await supabaseClient
        .from('awards')
        .select('title, year')
        .eq('type', type)
        .order('year', { ascending: false }); // Most recent first
    
    if (error) {
        console.error(`Error fetching ${type}:`, error);
        return;
    }
    
    renderAwards(data, type);
}

// Initialize all award sections
async function initializeAwards() {
    const types = ['Awards', 'Editorial', 'Reviewer', 'Technical', 'Advisory'];
    
    const promises = types.map(type => fetchAwards(type));
    await Promise.all(promises);
}

// Load awards when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeAwards); 