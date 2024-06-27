async function register(username, password) {
    try {
        const response = await fetch(`${API_CONFIG.authApi}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

async function login(username, password) {
    try {
        const response = await fetch(`${API_CONFIG.authApi}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

function logout() {
    localStorage.removeItem('token');
}

async function verifyAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Not logged in!');
        return;
    }
    try {
        const response = await fetch(`${API_CONFIG.authApi}/api/protected`, {
            headers: { 'Authorization': token }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Authentication failed');
        alert('Authentication verified: ' + data.message);
    } catch (error) {
        alert('Authentication failed: ' + error.message);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const verifyAuthButton = document.getElementById('testProtectedButton');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        try {
            await register(username, password);
            alert('Registration successful!');
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        try {
            await login(username, password);
            alert('Login successful!');
            logoutButton.style.display = 'block';
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });

    logoutButton.addEventListener('click', () => {
        logout();
        alert('Logged out successfully!');
        logoutButton.style.display = 'none';
    });

    verifyAuthButton.addEventListener('click', verifyAuthentication);
});