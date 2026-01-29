// Site Assets Module - Fetches logos, favicons, and other site assets from Supabase

async function fetchSiteAssets() {
    try {
        // Wait for Supabase client to be ready
        if (!window.supabaseClient && window.initializeSupabaseClient) {
            await window.initializeSupabaseClient();
        }

        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await window.supabaseClient
            .from('site_assets')
            .select('*')
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching site assets:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching site assets:', error);
        return [];
    }
}

function applySiteAssets(assets) {
    if (!assets || assets.length === 0) {
        console.warn('No site assets found in database');
        return;
    }

    // Create a map for easy lookup
    const assetMap = {};
    assets.forEach(asset => {
        assetMap[asset.asset_key] = asset;
    });

    // Apply favicon
    if (assetMap['favicon']) {
        const faviconUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['favicon'].asset_url) 
            : assetMap['favicon'].asset_url;
        
        let faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) {
            faviconLink.href = faviconUrl;
        } else {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            faviconLink.type = 'image/png';
            faviconLink.href = faviconUrl;
            document.head.appendChild(faviconLink);
        }
        console.log('Favicon loaded from database');
    }

    // Apply institution logo (IIT Patna)
    if (assetMap['institution_logo']) {
        const logoUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['institution_logo'].asset_url) 
            : assetMap['institution_logo'].asset_url;
        
        const institutionLogos = document.querySelectorAll('.institution-logo');
        institutionLogos.forEach(img => {
            img.src = logoUrl;
            if (assetMap['institution_logo'].alt_text) {
                img.alt = assetMap['institution_logo'].alt_text;
            }
        });
        console.log('Institution logo loaded from database');
    }

    // Apply lab logo (SHRI Lab)
    if (assetMap['lab_logo']) {
        const logoUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['lab_logo'].asset_url) 
            : assetMap['lab_logo'].asset_url;
        
        const labLogos = document.querySelectorAll('.lab-logo');
        labLogos.forEach(img => {
            img.src = logoUrl;
            if (assetMap['lab_logo'].alt_text) {
                img.alt = assetMap['lab_logo'].alt_text;
            }
        });
        console.log('Lab logo loaded from database');
    }

    // Apply Open Graph image (for social sharing)
    if (assetMap['og_image']) {
        const ogUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['og_image'].asset_url) 
            : assetMap['og_image'].asset_url;
        
        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        if (ogImageMeta) {
            ogImageMeta.content = ogUrl;
        }
        
        const twitterImageMeta = document.querySelector('meta[name="twitter:image"]');
        if (twitterImageMeta) {
            twitterImageMeta.content = ogUrl;
        }
        console.log('OG image loaded from database');
    }

    // Apply PI Profile Image
    if (assetMap['pi_profile_image']) {
        const profileUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['pi_profile_image'].asset_url) 
            : assetMap['pi_profile_image'].asset_url;
        
        const profileImages = document.querySelectorAll('.pi-profile-image, #profile-image');
        profileImages.forEach(img => {
            img.src = profileUrl;
            if (assetMap['pi_profile_image'].alt_text) {
                img.alt = assetMap['pi_profile_image'].alt_text;
            }
        });
        console.log('PI profile image loaded from database');
    }

    console.log('All site assets applied successfully from database');
}

// Initialize site assets
async function initSiteAssets() {
    const assets = await fetchSiteAssets();
    applySiteAssets(assets);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteAssets);
} else {
    initSiteAssets();
}

// Export for use in other modules
window.fetchSiteAssets = fetchSiteAssets;
window.applySiteAssets = applySiteAssets;
window.initSiteAssets = initSiteAssets;
