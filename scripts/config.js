// Supabase configuration - CHANGE ONLY HERE
const SUPABASE_URL = 'https://ktiiyeuvsvbqnrhqbwmr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aWl5ZXV2c3ZicW5yaHFid21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjI1OTIsImV4cCI6MjA2NTEzODU5Mn0.yPZY4oo70R4UXl4grSLyLRfNLJzFg1EYMeoKjpZy6tA';

// Initialize the Supabase client
function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('Supabase is not loaded');
        return null;
    }
    return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Initialize immediately when script loads (for pages that load config.js after supabase)
if (typeof supabase !== 'undefined') {
    window.supabaseClient = initSupabase();
} else {
    // If supabase is not loaded yet, wait for it
    window.supabaseClient = null;
}

// Make initialization function available globally
window.initSupabase = initSupabase;

// Also initialize when DOM is ready (fallback)
document.addEventListener('DOMContentLoaded', () => {
    if (!window.supabaseClient && typeof supabase !== 'undefined') {
        window.supabaseClient = initSupabase();
    }
}); 