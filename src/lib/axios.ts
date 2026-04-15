import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dummyjson.com',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    try {
        const raw = localStorage.getItem('auth-storage');
        if (raw) {
            const token = JSON.parse(raw)?.state?.accessToken;
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
    } catch {
        
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
