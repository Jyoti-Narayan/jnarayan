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

// Load an image and return a promise
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
    });
}

// Load preloader logos first, then show preloader content
async function loadPreloaderLogos(assetMap) {
    const preloaderIitLogo = document.getElementById('preloader-iit-logo');
    const preloaderLabLogo = document.getElementById('preloader-lab-logo');
    const preloaderLogosContainer = document.querySelector('.preloader-logos');
    const loaderContent = document.querySelector('.loader-content');
    
    if (!preloaderIitLogo || !preloaderLabLogo) {
        // No preloader logos on this page
        if (loaderContent) loaderContent.classList.add('logos-ready');
        return;
    }
    
    const promises = [];
    
    // Get institution logo URL
    if (assetMap['institution_logo']) {
        const logoUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['institution_logo'].asset_url) 
            : assetMap['institution_logo'].asset_url;
        
        promises.push(
            loadImage(logoUrl)
                .then(() => {
                    preloaderIitLogo.src = logoUrl;
                })
                .catch(() => {
                    console.warn('Failed to load IIT logo for preloader');
                })
        );
    }
    
    // Get lab logo URL
    if (assetMap['lab_logo']) {
        const logoUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['lab_logo'].asset_url) 
            : assetMap['lab_logo'].asset_url;
        
        promises.push(
            loadImage(logoUrl)
                .then(() => {
                    preloaderLabLogo.src = logoUrl;
                })
                .catch(() => {
                    console.warn('Failed to load lab logo for preloader');
                })
        );
    }
    
    // Wait for both logos to load (or fail)
    await Promise.allSettled(promises);
    
    // Show the logos container and other content
    if (preloaderLogosContainer) {
        preloaderLogosContainer.classList.add('logos-loaded');
    }
    if (loaderContent) {
        loaderContent.classList.add('logos-ready');
    }
    
    // Dispatch event that preloader logos are ready
    window.dispatchEvent(new CustomEvent('preloaderLogosReady'));
}

function applySiteAssets(assets) {
    if (!assets || assets.length === 0) {
        console.warn('No site assets found in database');
        // Still show preloader content even if no assets
        const loaderContent = document.querySelector('.loader-content');
        if (loaderContent) {
            loaderContent.classList.add('logos-ready');
        }
        return;
    }

    // Create a map for easy lookup
    const assetMap = {};
    assets.forEach(asset => {
        assetMap[asset.asset_key] = asset;
    });

    // Apply lab logo as favicon
    if (assetMap['lab_logo']) {
        const faviconUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['lab_logo'].asset_url) 
            : assetMap['lab_logo'].asset_url;
        
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
        console.log('Favicon (lab logo) loaded from database');
    }

    // Apply institution logo (IIT Patna) to banner
    if (assetMap['institution_logo']) {
        const logoUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['institution_logo'].asset_url) 
            : assetMap['institution_logo'].asset_url;
        
        const institutionLogos = document.querySelectorAll('.institution-logo');
        institutionLogos.forEach(img => {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            img.addEventListener('error', function() {
                this.classList.add('loaded');
            });
            img.src = logoUrl;
            if (img.complete) {
                img.classList.add('loaded');
            }
            if (assetMap['institution_logo'].alt_text) {
                img.alt = assetMap['institution_logo'].alt_text;
            }
        });
        console.log('Institution logo loaded from database');
    }

    // Apply lab logo (SHRI Lab) to banner
    if (assetMap['lab_logo']) {
        const logoUrl = window.convertGoogleDriveUrl 
            ? window.convertGoogleDriveUrl(assetMap['lab_logo'].asset_url) 
            : assetMap['lab_logo'].asset_url;
        
        const labLogos = document.querySelectorAll('.lab-logo');
        labLogos.forEach(img => {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            img.addEventListener('error', function() {
                this.classList.add('loaded');
            });
            img.src = logoUrl;
            if (img.complete) {
                img.classList.add('loaded');
            }
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

// Initialize site assets - load preloader logos first
async function initSiteAssets() {
    const assets = await fetchSiteAssets();
    
    if (!assets || assets.length === 0) {
        console.warn('No site assets found');
        const loaderContent = document.querySelector('.loader-content');
        if (loaderContent) {
            loaderContent.classList.add('logos-ready');
        }
        return;
    }
    
    // Create asset map
    const assetMap = {};
    assets.forEach(asset => {
        assetMap[asset.asset_key] = asset;
    });
    
    // Load preloader logos first (this will show them when ready)
    await loadPreloaderLogos(assetMap);
    
    // Then apply all other assets
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
window.loadPreloaderLogos = loadPreloaderLogos;
