import axios from 'axios';

// Base API URL - use localhost in development, production URL otherwise
const BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
  timeout: 30000, // 30 seconds timeout
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
    forgotPassword: (data) => apiClient.post('/admin/forget-password', data),
    resetPassword: (data) => apiClient.post('/admin/reset-password', data),
    getProfile: () => apiClient.get('/admin/profile'),
    updateProfile: (formData) => apiClient.put('/admin/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    changePassword: (id, data) => apiClient.post(`/admin/change-password/${id}`, data),
  },
  
  // Staff Management endpoints (Admin only)
  staff: {
    // Admin Management
    createAdmin: (formData) => apiClient.post('/staff/add-admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAllAdmins: () => apiClient.get('/staff/get-all-admin'),
    getAdminById: (id) => apiClient.get(`/staff/get-adminById/${id}`),
    updateAdmin: (id, formData) => apiClient.put(`/staff/update-admin/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteAdmin: (id) => apiClient.delete(`/staff/delete-admin/${id}`),
    updateSelfAdmin: (formData) => apiClient.put('/staff/update-admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAdminProfile: () => apiClient.get('/staff/get-admin-profile'),
    getSubAdminProfile: () => apiClient.get('/staff/get-sub-admin-profile'),
    updateSubAdmin: (formData) => apiClient.put('/staff/update-sub-admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    changeAdminPassword: (id, data) => apiClient.post(`/staff/admin-change-password/${id}`, data),
    changeSubAdminPassword: (id, data) => apiClient.post(`/staff/sub-admin-change-password/${id}`, data),
    
    // User Management
    verifyUserStatus: (userId, data) => apiClient.put(`/users/verify-status/${userId}`, data),
    
    // Vendor Management
    createVendor: (formData) => apiClient.post('/users/create-vendor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAllVendors: () => apiClient.get('/users/get-vendor-list'),
    getVendorById: (id) => apiClient.get(`/users/get-vendor/${id}`),
    updateVendor: (id, formData) => apiClient.put(`/users/update-vendor/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteVendor: (id) => apiClient.delete(`/users/delete-vendor/${id}`),
    
    // Delivery Partner Management
    createDeliveryPartner: (formData) => apiClient.post('/users/create-delivery-partner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAllDeliveryPartners: () => apiClient.get('/users/get-delivery-partner-list'),
    getDeliveryPartnerById: (id) => apiClient.get(`/users/get-delivery-partner/${id}`),
    updateDeliveryPartner: (id, formData) => apiClient.put(`/users/update-delivery-partner/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteDeliveryPartner: (id) => apiClient.delete(`/users/delete-delivery-partner/${id}`),
    
    // Customer Management
    createCustomer: (formData) => apiClient.post('/users/create-customer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAllCustomers: () => apiClient.get('/users/get-customer-list'),
    getCustomerById: (id) => apiClient.get(`/users/get-customer/${id}`),
    updateCustomer: (id, formData) => apiClient.put(`/users/update-customer/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteCustomer: (id) => apiClient.delete(`/users/delete-customer/${id}`),
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
  
  // Product endpoints (Vendor)
  products: {
    create: (formData) => apiClient.post('/products/add-product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: (params = {}) => apiClient.get('/products/get-products-list', { params }),
    getById: (id) => apiClient.get(`/products/get-productsById/${id}`),
    update: (id, formData) => apiClient.put(`/products/update-productsById/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => apiClient.delete(`/products/delete-products/${id}`),
    getCategories: () => apiClient.get('/products/categories/list'),
    
    // Admin product endpoints
    admin: {
      create: (formData) => apiClient.post('/products/admin/add-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      getAll: (params = {}) => apiClient.get('/products/admin/get-products-list', { params }),
      getById: (id) => apiClient.get(`/products/admin/get-product/${id}`),
      update: (id, formData) => apiClient.put(`/products/admin/update-product/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      delete: (id) => apiClient.delete(`/products/admin/delete-product/${id}`),
    },
  },

  // Cart endpoints (Customer)
  cart: {
    addToCart: (data) => apiClient.post('/customers/cart/add-to-cart', data),
    getCart: () => apiClient.get('/customers/cart/get-cart'),
    updateItem: (productId, data) => apiClient.put(`/customers/cart/update-item/${productId}`, data),
    removeItem: (productId) => apiClient.delete(`/customers/cart/remove-item/${productId}`),
  },

  // Order endpoints (Customer)
  orders: {
    create: (data) => apiClient.post('/customers/order/create', data),
    getAll: () => apiClient.get('/customers/order/list'),
    getById: (orderId) => apiClient.get(`/customers/order/get-order/${orderId}`),
    getHistory: (orderId) => apiClient.get(`/customers/order/get-order-history/${orderId}/history`),
    addHistory: (orderId, data) => apiClient.post(`/customers/order/${orderId}/history`, data),
    updatePayment: (orderId, data) => apiClient.post(`/customers/order/${orderId}/payment`, data),
  },

  // Store endpoints
  store: {
    // Customer store endpoints
    customer: {
      getOpenStores: (params = {}) => apiClient.get('/customers/store/open-stores', { params }),
      getStoreProducts: (storeId) => apiClient.get(`/customers/store/products/${storeId}`),
    },
    // Vendor/Admin store endpoints
    toggleStatus: (storeId, data) => apiClient.put(`/store/${storeId}/open-close`, data),
    // Admin store endpoints
    admin: {
      getAll: (params = {}) => apiClient.get('/store/admin/get-store', { params }),
      getById: (id) => apiClient.get(`/store/admin/get-store-by-id/${id}`),
      update: (id, data) => apiClient.put(`/store/admin/update-store-by-id/${id}`, data),
    },
  },

  // Vendor order endpoints
  vendorOrders: {
    respond: (orderId, data) => apiClient.post(`/vendors/order/${orderId}/respond`, data),
    getAll: () => apiClient.get('/vendors/orders'),
    getById: (orderId) => apiClient.get(`/vendors/order/${orderId}`),
  },

  // Vendor subscription endpoints
  vendorSubscription: {
    purchase: (data) => apiClient.post('/vendors/purchase-subscription', data),
    getMySubscriptions: () => apiClient.get('/vendors/get-subscription'),
    renew: (id, data) => apiClient.put(`/vendors/renew-subscription/${id}`, data),
  },

  // Delivery Partner order endpoints
  deliveryOrders: {
    respond: (orderId, data) => apiClient.post(`/delivery-order/respond-order/${orderId}`, data),
    pickup: (orderId, data) => apiClient.put(`/delivery-order/pickup-order/${orderId}`, data),
    deliver: (orderId, data) => apiClient.put(`/delivery-order/deliver-order/${orderId}`, data),
    getMyStats: () => apiClient.get('/delivery-order/my-stats'),
  },

  // Admin order endpoints
  adminOrders: {
    getOrdersByVendor: (vendorId) => apiClient.get(`/admin/orders/vendor/${vendorId}`),
    getOrderHistory: (orderId) => apiClient.get(`/admin/order/${orderId}/history`),
  },

  // Admin vendor subscription endpoints
  adminVendorSubscription: {
    create: (data) => apiClient.post('/admin/vendor-subscription', data),
    getAll: () => apiClient.get('/admin/vendor-subscription'),
    getById: (id) => apiClient.get(`/admin/vendor-subscription/${id}`),
    assign: (subscriptionId, data) => apiClient.put(`/admin/vendor-subscription/${subscriptionId}/assign`, data),
    renew: (id, data) => apiClient.put(`/admin/vendor-subscription/${id}/renew`, data),
    cancel: (id) => apiClient.delete(`/admin/cancel-vendor-subscription/${id}`),
  },

  // Mappls endpoints (location services)
  mappls: {
    autosuggest: (params = {}) => apiClient.get('/mappls/places/autosuggest', { params }),
    geocode: (params = {}) => apiClient.get('/mappls/places/geocode', { params }),
    reverseGeocode: (params = {}) => apiClient.get('/mappls/places/reverse-geocode', { params }),
  },
};

export default apiClient;

