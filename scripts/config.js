// Supabase configuration - CHANGE ONLY HERE
const SUPABASE_URL = 'https://adejcdhcxiwypphenyxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZWpjZGhjeGl3eXBwaGVueXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzOTkzNjUsImV4cCI6MjA2NTk3NTM2NX0.BHzMcHen9VOuU5n39uCF_OXy8Dyw0mofL0EN08Td5NM';

// Initialize the Supabase client
function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('Supabase library is not loaded');
        return null;
    }
    
    try {
        console.log('Initializing Supabase client with URL:', SUPABASE_URL);
        const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase client initialized successfully');
        return client;
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        return null;
    }
}

// Function to wait for Supabase to be loaded
function waitForSupabase() {
    return new Promise((resolve) => {
        if (typeof supabase !== 'undefined') {
            resolve();
            return;
        }
        
        // Check every 100ms for up to 10 seconds
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkInterval = setInterval(() => {
            attempts++;
            if (typeof supabase !== 'undefined') {
                clearInterval(checkInterval);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('Supabase library failed to load after 10 seconds');
                resolve();
            }
        }, 100);
    });
}

// Initialize Supabase client
async function initializeSupabaseClient() {
    console.log('Starting Supabase initialization...');
    await waitForSupabase();
    
    if (!window.supabaseClient) {
        window.supabaseClient = initSupabase();
        
        if (window.supabaseClient) {
            // Test the connection
            try {
                const { data, error } = await window.supabaseClient
                    .from('projects')
                    .select('count', { count: 'exact', head: true });
                
                if (error) {
                    console.warn('Supabase connection test failed:', error);
                } else {
                    console.log('Supabase connection test successful');
                }
            } catch (testError) {
                console.warn('Supabase connection test error:', testError);
            }
        }
    }
    
    return window.supabaseClient;
}

// Utility function to convert Google Drive URLs to direct image URLs
function convertGoogleDriveUrl(url) {
    if (!url) return url;
    
    // Check if it's a Google Drive URL
    const drivePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(drivePattern);
    
    if (match) {
        const fileId = match[1];
        // Convert to direct thumbnail URL with high quality
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    
    // Return original URL if not a Google Drive link
    return url;
}

// Make functions available globally
window.initSupabase = initSupabase;
window.initializeSupabaseClient = initializeSupabaseClient;
window.convertGoogleDriveUrl = convertGoogleDriveUrl;

// Initialize immediately
initializeSupabaseClient(); 