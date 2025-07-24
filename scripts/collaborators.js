// Function to fetch collaborators
async function fetchCollaborators() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await window.supabaseClient
            .from('collaborators')
            .select('*')
            .order('affiliation', { ascending: true })  // First sort by affiliation
            .order('name', { ascending: true });        // Then sort by name within each affiliation

        if (error) {
            console.error('Error fetching collaborators:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        return [];
    }
}

// Function to render collaborators
function renderCollaborators(collaborators) {
    const container = document.getElementById('collaborators-content');
    if (!container) {
        console.error('Collaborators container not found');
        return;
    }

    if (!collaborators || !Array.isArray(collaborators) || collaborators.length === 0) {
        container.innerHTML = `
            <div class="notification is-info is-light">
                <p class="has-text-centered">No collaborators available at the moment.</p>
            </div>
        `;
        return;
    }

    try {
        const html = `
            <div class="collaborators-grid">
                ${collaborators.map(collaborator => `
                    <div class="collaborator-card">
                        <div class="collaborator-header">
                            <div class="collaborator-name">
                                <span class="icon">
                                    <i class="fas fa-user-circle"></i>
                                </span>
                                ${collaborator.url ? 
                                    `<a href="${collaborator.url}" target="_blank" rel="noopener noreferrer">${collaborator.name}</a>` :
                                    `<span>${collaborator.name}</span>`
                                }
                            </div>
                        </div>
                        <div class="collaborator-details">
                            <div class="collaborator-department">
                                <span class="icon">
                                    <i class="fas fa-building"></i>
                                </span>
                                <span>${collaborator.department || 'Department not specified'}</span>
                            </div>
                            <div class="collaborator-affiliation">
                                <span class="icon">
                                    <i class="fas fa-university"></i>
                                </span>
                                <span>${collaborator.affiliation}</span>
                            </div>
                            <div class="collaborator-location">
                                <span class="icon">
                                    <i class="fas fa-globe"></i>
                                </span>
                                <span>${collaborator.country}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;
    } catch (error) {
        console.error('Error rendering collaborators:', error);
        container.innerHTML = `
            <div class="notification is-danger is-light">
                <p class="has-text-centered">An error occurred while displaying collaborators. Please try again later.</p>
            </div>
        `;
    }
}

// Initialize collaborators when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const collaborators = await fetchCollaborators();
        renderCollaborators(collaborators);
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        const container = document.getElementById('collaborators-content');
        if (container) {
            container.innerHTML = `
                <div class="notification is-danger is-light">
                    <p class="has-text-centered">Error loading collaborators. Please try again later.</p>
                </div>
            `;
        }
    }
}); 