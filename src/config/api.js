import axios from 'axios';

// Base API URL - update this based on your backend server
const BASE_URL = 'https://private-bazarghor-backend-for-testing-production.up.railway.app/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Log responses for debugging (remove in production)
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      code: response.data?.code,
      message: response.data?.message
    });

    // Check if the response has an ERROR code even with 200 status
    if (response.data && response.data.code === 'ERROR') {
      console.log('❌ Error detected in response code');
      // Treat as error even though HTTP status is 200
      return Promise.reject({
        response: {
          data: response.data,
          status: 200
        }
      });
    }
    return response;
  },
  (error) => {
    // Log errors for debugging (remove in production)
    console.log('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Admin endpoints
  admin: {
    login: (data) => apiClient.post('/admin/login', data),
    logout: () => apiClient.post('/admin/logout'),
  },

  // Customer endpoints
  customer: {
    register: (formData) => apiClient.post('/customers/create-customer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    login: (data) => apiClient.post('/customers/login', data),
    getProfile: () => apiClient.get('/customers/profile'),
    updateProfile: (formData) => apiClient.put('/customers/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    logout: () => apiClient.post('/customers/logout'),
    sendOTP: (data) => apiClient.post('/customers/login/send-otp', data),
    resendOTP: (data) => apiClient.post('/customers/login/resend', data),
    // Address management
    addAddress: (data) => apiClient.post('/customers/address', data),
    updateAddress: (addressId, data) => apiClient.put(`/customers/address/${addressId}`, data),
    deleteAddress: (addressId) => apiClient.delete(`/customers/address/${addressId}`),
  },

  // Vendor endpoints
  vendor: {
    register: (formData) => apiClient.post('/vendors/create-vendor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getProfile: () => apiClient.get('/vendors/profile'),
    updateProfile: (formData) => apiClient.put('/vendors/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    logout: () => apiClient.post('/vendors/logout'),
    sendOTP: (data) => apiClient.post('/vendors/login/send-otp', data),
    verifyOTP: (data) => apiClient.post('/vendors/login/verify', data),
    resendOTP: (data) => apiClient.post('/vendors/login/resend', data),
  },

  // Delivery Partner endpoints
  deliveryPartner: {
    register: (formData) => apiClient.post('/delivery-partner/create-delivery-partner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getProfile: () => apiClient.get('/delivery-partner/profile'),
    updateProfile: (formData) => apiClient.put('/delivery-partner/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    logout: () => apiClient.post('/delivery-partner/logout'),
    sendOTP: (data) => apiClient.post('/delivery-partner/login/send-otp', data),
    verifyOTP: (data) => apiClient.post('/delivery-partner/login/verify', data),
    resendOTP: (data) => apiClient.post('/delivery-partner/login/resend', data),
  },

  // OTP endpoints
  otp: {
    sendRegistrationOTP: (data) => apiClient.post('/otp/send-otp-registration', data),
    verifyRegistrationOTP: (data) => apiClient.post('/otp/verify-otp-registration', data),
    verifyLogin: (data) => apiClient.post('/otp/verify-login', data),
    resend: (data) => apiClient.post('/otp/resend', data),
  },
};

export default apiClient;

