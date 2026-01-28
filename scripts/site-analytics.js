// Site Analytics - Visitor tracking using Supabase
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for Supabase to be ready
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!window.supabaseClient) {
        console.error('Supabase client not initialized for analytics');
        return;
    }

    // Generate or retrieve visitor ID from localStorage
    function getVisitorId() {
        let visitorId = localStorage.getItem('shri_visitor_id');
        if (!visitorId) {
            visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('shri_visitor_id', visitorId);
        }
        return visitorId;
    }

    // Check if this visitor is new (first time ever)
    function isFirstTimeVisitor() {
        return !localStorage.getItem('shri_first_visit_logged');
    }

    // Mark visitor as logged
    function markVisitorLogged() {
        localStorage.setItem('shri_first_visit_logged', 'true');
    }

    // Check if this is a new session (last visit > 30 minutes ago)
    function isNewSession() {
        const lastVisit = localStorage.getItem('shri_last_visit');
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;
        
        localStorage.setItem('shri_last_visit', now.toString());
        
        if (!lastVisit || (now - parseInt(lastVisit)) > thirtyMinutes) {
            return true;
        }
        return false;
    }

    // Get browser info
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Firefox/')) browser = 'Firefox';
        else if (ua.includes('Edg/')) browser = 'Edge';
        else if (ua.includes('Chrome/')) browser = 'Chrome';
        else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera';
        
        return browser;
    }

    // Get OS info
    function getOSInfo() {
        const ua = navigator.userAgent;
        let os = 'Unknown';
        
        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac OS')) os = 'macOS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
        
        return os;
    }

    // Get device type
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'Tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'Mobile';
        }
        return 'Desktop';
    }

    // Get timezone/region (legal way to approximate location)
    function getTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
        } catch {
            return 'Unknown';
        }
    }

    // Get language
    function getLanguage() {
        return navigator.language || navigator.userLanguage || 'Unknown';
    }

    // Collect all visitor data
    function collectVisitorData() {
        return {
            visitor_id: getVisitorId(),
            page: window.location.pathname || '/',
            referrer: document.referrer || null,
            browser: getBrowserInfo(),
            os: getOSInfo(),
            device_type: getDeviceType(),
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            timezone: getTimezone(),
            language: getLanguage(),
            is_new_visitor: isFirstTimeVisitor(),
            is_new_session: isNewSession()
        };
    }

    // Log page visit with full data
    async function logPageVisit() {
        try {
            const visitorData = collectVisitorData();

            // Insert page view with all visitor data
            await window.supabaseClient
                .from('page_views')
                .insert(visitorData);

            // Mark visitor as logged if first time
            if (visitorData.is_new_visitor) {
                markVisitorLogged();
            }

        } catch (error) {
            console.error('Error logging page visit:', error);
        }
    }

    // Fetch and display site stats (only views, not visitor details)
    async function displaySiteStats() {
        const statsContainer = document.getElementById('visitor-stats');
        if (!statsContainer) return;

        try {
            // Get total page views
            const { count: totalViews } = await window.supabaseClient
                .from('page_views')
                .select('*', { count: 'exact', head: true });

            // Get today's views
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { count: todayViews } = await window.supabaseClient
                .from('page_views')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            // Get this week's views
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const { count: weekViews } = await window.supabaseClient
                .from('page_views')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', weekAgo.toISOString());

            // Update display - only showing views, not visitor data
            statsContainer.innerHTML = `
                <div class="visitor-stat">
                    <i class="fas fa-eye"></i>
                    <span class="stat-value">${formatNumber(totalViews || 0)}</span>
                    <span class="stat-name">Total Views</span>
                </div>
                <div class="visitor-stat">
                    <i class="fas fa-calendar-week"></i>
                    <span class="stat-value">${formatNumber(weekViews || 0)}</span>
                    <span class="stat-name">This Week</span>
                </div>
                <div class="visitor-stat">
                    <i class="fas fa-calendar-day"></i>
                    <span class="stat-value">${formatNumber(todayViews || 0)}</span>
                    <span class="stat-name">Today</span>
                </div>
            `;
        } catch (error) {
            console.error('Error fetching site stats:', error);
            statsContainer.innerHTML = '<p class="stats-error">Stats unavailable</p>';
        }
    }

    // Format large numbers (e.g., 1000 -> 1K)
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Initialize
    await logPageVisit();
    await displaySiteStats();
});
