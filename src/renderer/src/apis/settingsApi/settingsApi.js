import axios from "axios";

const BASE_URL = 'https://pharmacy-db-software-server.vercel.app/api/accounting-software/settings';
// const BASE_URL = 'http://localhost:5000/api/accounting-software/settings';

const API = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor - handles ALL requests automatically
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
    (response) => {
        console.log(`📥 Response: ${response.status}`);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));

        }
        return Promise.reject(error);
    }
);
export const getSettingsApi = async () => {
    
    const response = await API.get('/');
    return response.data;
};

export const updateSettingsApi = async (data) => {
    const response = await API.put('/', data);
    return response.data;
};

export const saveSettingsApi = async (data) => {
    const response = await API.post('/', data);
    return response.data;
};

export const resetSettingsApi = async () => {
    const response = await API.delete('/');
    return response.data;
};