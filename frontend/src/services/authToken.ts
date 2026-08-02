const AUTH_TOKEN_KEY = 'stockpulse_auth_token';

export function getAuthToken() {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export function authHeaders() {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function captureAuthTokenFromUrl() {
    const rawHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
    const params = new URLSearchParams(rawHash);
    const token = params.get('token');

    if (!token) {
        return false;
    }

    setAuthToken(token);
    params.delete('token');

    const nextHash = params.toString();
    const cleanUrl = `${window.location.pathname}${window.location.search}${nextHash ? `#${nextHash}` : ''}`;
    window.history.replaceState(null, '', cleanUrl);

    return true;
}