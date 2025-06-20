// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
}

// Function to render talks
function renderTalks(talks) {
    const container = document.getElementById('talks-list');
    
    let html = '';
    talks.forEach(talk => {
        html += `
            <div class="talk-item">
                <span class="bullet">•</span>
                <div class="talk-content">
                    <span class="talk-title">${talk.title}</span>
                    <span class="talk-year">, ${talk.year}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fetch and render talks
async function fetchTalks() {
    const { data, error } = await supabaseClient
        .from('talks')
        .select('title, year')
        .order('year', { ascending: false }); // Most recent first
    
    if (error) {
        console.error('Error fetching talks:', error);
        return;
    }
    
    renderTalks(data);
}

// Load talks when the DOM is ready
document.addEventListener('DOMContentLoaded', fetchTalks); 