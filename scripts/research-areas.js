// Research Areas Module - Fetches and renders research areas with images

async function fetchResearchAreas() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await window.supabaseClient
            .from('research_areas')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching research areas:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching research areas:', error);
        return [];
    }
}

function renderResearchAreas(researchAreas) {
    const container = document.getElementById('research-areas-grid');
    if (!container) {
        console.error('Research areas container not found');
        return;
    }

    if (!researchAreas || researchAreas.length === 0) {
        container.innerHTML = `
            <div class="notification is-info is-light">
                <p class="has-text-centered">Research areas coming soon.</p>
            </div>
        `;
        return;
    }

    const html = researchAreas.map(area => `
        <a href="category.html?category=${encodeURIComponent(area.title)}" class="research-area-link">
            <div class="research-area-card">
                <div class="research-area-image">
                    ${area.image_url
            ? `<img src="${area.image_url}" alt="${area.title}" loading="lazy">`
            : `<div class="research-area-icon"><i class="${area.icon_class || 'fas fa-microscope'}"></i></div>`
        }
                </div>
                <div class="research-area-content">
                    <h4 class="research-area-title">${area.title}</h4>
                    ${area.description ? `<p class="research-area-description">${area.description}</p>` : ''}
                    <div class="research-area-explore">
                        <span>Explore Publications</span>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            </div>
        </a>
    `).join('');

    container.innerHTML = html;
}

// Initialize research areas when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for Supabase to be ready
        await new Promise(resolve => setTimeout(resolve, 600));

        const researchAreas = await fetchResearchAreas();
        renderResearchAreas(researchAreas);
    } catch (error) {
        console.error('Error initializing research areas:', error);
    }
});

// Export functions
window.fetchResearchAreas = fetchResearchAreas;
window.renderResearchAreas = renderResearchAreas;
