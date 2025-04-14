import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/me', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData)
};

// Messages API
export const messagesAPI = {
  getMessages: (params) => api.get('/messages', { params }),
  getMessage: (id) => api.get(`/messages/${id}`),
  createMessage: (messageData) => api.post('/messages', messageData),
  updateMessage: (id, messageData) => api.put(`/messages/${id}`, messageData),
  importMessages: (messagesData) => api.post('/messages/import', messagesData),
  createResponse: (messageId, responseData) => api.post(`/messages/${messageId}/responses`, responseData),
  generateResponse: (messageId) => api.post(`/messages/${messageId}/generate-response`)
};

// User API
export const userAPI = {
  getStats: () => api.get('/users/stats'),
  getStylePreferences: () => api.get('/users/style-preferences'),
  updateStylePreferences: (preferencesData) => api.put('/users/style-preferences', preferencesData),
  getAutomationPreferences: () => api.get('/users/automation-preferences'),
  updateAutomationPreferences: (preferencesData) => api.put('/users/automation-preferences', preferencesData)
};

export default {
  auth: authAPI,
  messages: messagesAPI,
  user: userAPI
};
