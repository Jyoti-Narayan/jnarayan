// Lab Info Module - Fetches SHRI Lab information
async function fetchLabInfo() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return null;
        }

        const { data, error } = await window.supabaseClient
            .from('lab_info')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching lab info:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching lab info:', error);
        return null;
    }
}

// Function to render lab banner
function renderLabBanner(labInfo) {
    const bannerContainer = document.getElementById('lab-banner');
    if (!bannerContainer) {
        console.error('Lab banner container not found');
        return;
    }

    const labName = labInfo?.lab_name || 'Smart Healthcare & Robotics Interface Laboratory (SHRI Laboratory)';
    const labFullName = labInfo?.lab_full_name || 'Smart Healthcare & Robotics Interface Laboratory (SHRI Laboratory)';
    const institutionLogo = labInfo?.institution_logo_url || 'images/iitp-logo.png';
    const labLogo = labInfo?.lab_logo_url || 'images/shri-lab-logo.png';

    bannerContainer.innerHTML = `
        <div class="banner-content">
            <div class="banner-logo-left">
                <img src="${institutionLogo}" alt="IIT Patna Logo" class="institution-logo">
            </div>
            <div class="banner-text">
                <h1 class="lab-name">${labName}</h1>
                <p class="lab-full-name">${labFullName}</p>
            </div>
            <div class="banner-logo-right">
                <img src="${labLogo}" alt="${labName} Logo" class="lab-logo">
            </div>
        </div>
    `;
}

// Function to render footer with address and Google Maps
function renderFooterWithMap(labInfo) {
    const footerContainer = document.getElementById('footer-address');
    if (!footerContainer) {
        console.error('Footer address container not found');
        return;
    }

    const address = labInfo?.address || 'R412 Block III, Academic Complex, IIT Patna, Bihta, Bihar - 801106';
    const email = labInfo?.email || 'jnarayan@iitp.ac.in';
    const phone = labInfo?.phone || '+91-6115233946';
    const mapsUrl = labInfo?.google_maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.9954!2d84.8567!3d25.5362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sIIT%20Patna!5e0!3m2!1sen!2sin!4v1600000000000';

    footerContainer.innerHTML = `
        <div class="footer-content">
            <div class="footer-info">
                <h3><i class="fas fa-map-marker-alt"></i> Contact Us</h3>
                <div class="contact-item">
                    <i class="fas fa-building"></i>
                    <p>${address}</p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <p><a href="mailto:${email}">${email}</a></p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <p><a href="tel:${phone}">${phone}</a></p>
                </div>
            </div>
            <div class="footer-map">
                <iframe 
                    src="${mapsUrl}"
                    width="100%" 
                    height="300" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>
    `;
}

// Initialize lab info when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for Supabase to be ready
        await new Promise(resolve => setTimeout(resolve, 500));

        const labInfo = await fetchLabInfo();
        renderLabBanner(labInfo);
        renderFooterWithMap(labInfo);
    } catch (error) {
        console.error('Error initializing lab info:', error);
    }
});

// Export functions
window.fetchLabInfo = fetchLabInfo;
window.renderLabBanner = renderLabBanner;
window.renderFooterWithMap = renderFooterWithMap;
