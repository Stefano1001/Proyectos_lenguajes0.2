/**
 * Auth Service
 * Centralizes session management and user data
 */

const Auth = {
    // Save user session
    login: (userData) => {
        localStorage.setItem('usuario', JSON.stringify(userData));
    },

    // Clear session
    logout: () => {
        localStorage.removeItem('usuario');
        window.location.href = '/frontend/index.html'; // Adjust path if needed based on deployment
    },

    // Get current user
    getUser: () => {
        const userStr = localStorage.getItem('usuario');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is logged in
    checkSession: () => {
        const user = Auth.getUser();
        if (!user) {
            // If we are not in index.html or registro.html, redirect
            const path = window.location.pathname;
            if (!path.includes('index.html') && !path.includes('registro.html')) {
                window.location.href = '../index.html';
            }
            return false;
        }
        return true;
    },

    // Get user role (handles different DB schemas if needed)
    getRole: () => {
        const user = Auth.getUser();
        if (!user) return null;
        return user.rol || user.tipo || 'alumno'; // Default to alumno
    }
};

// Auto-check session on load for protected pages
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Only check if we are NOT in login/register pages
        const path = window.location.pathname;
        if (!path.endsWith('index.html') && !path.endsWith('registro.html') && !path.endsWith('/')) {
            Auth.checkSession();
        }
    });
} else {
    const path = window.location.pathname;
    if (!path.endsWith('index.html') && !path.endsWith('registro.html') && !path.endsWith('/')) {
        Auth.checkSession();
    }
}
