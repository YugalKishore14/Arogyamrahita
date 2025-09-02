import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://arogyamrahita.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        const message = error.response?.data?.message || error.message || 'An error occurred';
        toast.error(message);

        return Promise.reject(error);
    }
);

export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    verifyOtp: async (data) => {
        const response = await api.post('/auth/verify-otp', data);
        return response.data;
    },

    refreshToken: async () => {
        const response = await api.post('/auth/refresh-token');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    resendOtp: async (data) => {
        const response = await api.post('/auth/resend-otp', data);
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (data) => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    },
};

export const cartAPI = {
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },

    addToCart: async (productId, quantity = 1) => {
        const response = await api.post('/cart/add', { productId, quantity });
        return response.data;
    },

    updateCartItem: async (productId, quantity) => {
        const response = await api.put('/cart/update', { productId, quantity });
        return response.data;
    },

    removeFromCart: async (productId) => {
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data;
    },

    clearCart: async () => {
        const response = await api.delete('/cart/clear');
        return response.data;
    },
};

export const productAPI = {
    getAllProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/products/categories');
        return response.data;
    },

    // Admin-only
    getAdminProducts: async () => {
        const response = await api.get('/products/admin/all');
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
};

export const userAPI = {
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },
};

export const categoryAPI = {
    getAllCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getCategoryById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    uploadCategoryImage: async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await api.post('/categories/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};