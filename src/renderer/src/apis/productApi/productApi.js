
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext/AuthContext';

// const BASE_URL = 'http://localhost:5000/api/accounting-software/products';
const BASE_URL = 'https://pharmacy-db-software-server.vercel.app/api/accounting-software/products';

// Create axios instance WITHOUT setting headers here
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  } 
});

// Request interceptor to add token from localStorage
API.interceptors.request.use(
  (config) => {
    // Get token directly from localStorage each time
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Fixed: removed space after 'Authorization'
      console.log('✅ Token added to Authorization header');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
API.interceptors.response.use(
  (response) => {
    console.log('📥 Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      // Optional: redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Fixed: Remove the useAuth from here - don't mix hooks with API functions
export const useProductsApi = (initialPage = 1, initialLimit = 10, initialSearch = '') => {
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Get fresh token before each request
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token available for API request');
          setLoading(false);
          return;
        }
        
        const response = await API.get('/', {
          params: { page, limit, search },
          headers: {
            Authorization: `Bearer ${token}` // Ensure token is sent
          }
        });

        setAllProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalProducts(response.data.total || 0);
        setError(null);
      } catch (err) {
        setError(err);
        console.error(err);
        if (err.response?.status === 401) {
          // Clear auth data on 401
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, search]);

  return {
    allProducts, 
    setAllProducts,
    error,
    loading,
    page, 
    setPage, 
    limit,
    setLimit, 
    search, 
    setSearch,
    totalPages, 
    totalProducts
  };
};

// Rest of your API functions remain the same...
export const postProductApi = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.post('/', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data, "response.data");
    return response.data;
  } catch (error) {
    console.error('Post product error:', error);
    throw error;
  }
}

export const getSingleProductApi = async (id) => {
  const token = localStorage.getItem('token');
  const response = await API.get(`/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const putProductApi = async (id, data) => {
  // const token = localStorage.getItem('token');
  const response = await API.put(`/${id}`, data, {
    // headers: {
    //   Authorization: `Bearer ${token}`
    // }
  });
  return response.data;
};

export const deleteProductApi = async (id) => {
  const token = localStorage.getItem('token');
  const response = await API.delete(`/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

export const getProductByBarcodeApi = async (barcode) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.get(`/barcode/${barcode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.success) {
      return response.data.product;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    throw error;
  }
};

export const bulkStockUpdateApi = async (updates) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.patch('/bulk-stock', { updates }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Bulk stock update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in bulk stock update:', error);
    throw error;
  }
};