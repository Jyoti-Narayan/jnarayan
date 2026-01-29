// Facilities Module - Fetches and renders lab facilities/equipment

async function fetchFacilities() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await window.supabaseClient
            .from('facilities')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching facilities:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching facilities:', error);
        return [];
    }
}

function renderFacilities(facilities) {
    const container = document.getElementById('facilities-grid');
    if (!container) {
        console.error('Facilities container not found');
        return;
    }

    if (!facilities || facilities.length === 0) {
        container.innerHTML = `
            <div class="notification is-info is-light">
                <p class="has-text-centered">Facilities information coming soon.</p>
            </div>
        `;
        return;
    }

    const html = facilities.map(facility => `
        <div class="facility-card">
            <div class="facility-image">
                ${facility.image_url
            ? `<img src="${window.convertGoogleDriveUrl ? window.convertGoogleDriveUrl(facility.image_url) : facility.image_url}" alt="${facility.name}" loading="lazy">`
            : `<div class="facility-placeholder"><i class="fas fa-tools"></i></div>`
        }
            </div>
            <div class="facility-content">
                <h4 class="facility-name">${facility.name}</h4>
                ${facility.manufacturer || facility.model ?
            `<p class="facility-model">${facility.manufacturer || ''} ${facility.model || ''}</p>` : ''
        }
                ${facility.description ?
            `<p class="facility-description">${facility.description}</p>` : ''
        }
                ${facility.specifications ?
            `<p class="facility-specs"><strong>Specs:</strong> ${facility.specifications}</p>` : ''
        }
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// Initialize facilities when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for Supabase to be ready
        await new Promise(resolve => setTimeout(resolve, 800));

        const facilities = await fetchFacilities();
        renderFacilities(facilities);
    } catch (error) {
        console.error('Error initializing facilities:', error);
    }
});

// Export functions
window.fetchFacilities = fetchFacilities;
window.renderFacilities = renderFacilities;
