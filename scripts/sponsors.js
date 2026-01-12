// Sponsors Module - Fetches and renders sponsor logos

async function fetchSponsors() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await window.supabaseClient
            .from('sponsors')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching sponsors:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching sponsors:', error);
        return [];
    }
}

function renderSponsors(sponsors) {
    const container = document.getElementById('sponsors-grid');
    if (!container) {
        console.error('Sponsors container not found');
        return;
    }

    if (!sponsors || sponsors.length === 0) {
        container.innerHTML = `
            <div class="notification is-info is-light">
                <p class="has-text-centered">Sponsor information coming soon.</p>
            </div>
        `;
        return;
    }

    const html = sponsors.map(sponsor => `
        <div class="sponsor-card">
            ${sponsor.website_url ? `<a href="${sponsor.website_url}" target="_blank" rel="noopener noreferrer">` : ''}
                <div class="sponsor-logo">
                    ${sponsor.logo_url
            ? `<img src="${sponsor.logo_url}" alt="${sponsor.name}" loading="lazy">`
            : `<div class="sponsor-placeholder"><i class="fas fa-building"></i></div>`
        }
                </div>
                <p class="sponsor-name">${sponsor.name}</p>
            ${sponsor.website_url ? `</a>` : ''}
        </div>
    `).join('');

    container.innerHTML = html;
}

// Initialize sponsors when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for Supabase to be ready
        await new Promise(resolve => setTimeout(resolve, 900));

        const sponsors = await fetchSponsors();
        renderSponsors(sponsors);
    } catch (error) {
        console.error('Error initializing sponsors:', error);
    }
});

// Export functions
window.fetchSponsors = fetchSponsors;
window.renderSponsors = renderSponsors;
