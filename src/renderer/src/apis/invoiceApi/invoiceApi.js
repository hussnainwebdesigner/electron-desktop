

import axios from 'axios';
import { useState, useEffect } from 'react';

// const BASE_URL = 'http://localhost:5000/api/accounting-software/invoices';
const BASE_URL = 'https://pharmacy-db-software-server.vercel.app/api/accounting-software/invoices';
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

// Custom hook for paginated invoices
export const useInvoicesApi = (initialPage = 1, initialLimit = 10, initialSearch = '') => {
    const [allInvoices, setAllInvoices] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [search, setSearch] = useState(initialSearch);
    const [totalPages, setTotalPages] = useState(1);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchInvoices = async () => {
        if (!localStorage.getItem('token')) {
            console.warn('No token available');
            return;
        }

        setLoading(true);
        try {
            const response = await API.get('/', { params: { page, limit, search } });
            
            if (response.data.success) {
                setAllInvoices(response.data.invoices || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalInvoices(response.data.total || 0);
            } else {
                setAllInvoices([]);
            }
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [page, limit, search]);

    return {
        allInvoices,
        setAllInvoices,
        error,
        loading,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        totalPages,
        totalInvoices,
        fetchInvoices
    };
};

// Clean API functions - no redundant headers
export const postInvoiceApi = async (data) => {
    try {
        const response = await API.post('/', data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getSingleInvoiceApi = async (id) => {
    try {
        const response = await API.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Fetch Invoice Error:', error.response?.data || error.message);
        throw error;
    }
};

export const putInvoiceApi = async (id, data) => {
    const response = await API.put(`/${id}`, data);
    return response.data;
};

export const deleteInvoiceApi = async (id) => {
    const response = await API.delete(`/${id}`);
    return response.data;
};

export const getInvoiceStatsApi = async () => {
    try {
        const response = await API.get('/stats/summary');
        return response.data;
    } catch (error) {
        console.error('Fetch Invoice Stats Error:', error.response?.data || error.message);
        throw error;
    }
};