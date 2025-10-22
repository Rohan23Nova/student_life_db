import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const academicsAPI = {
  getCourses: () => api.get('/academics/courses'),
  enrollCourse: (courseId) => api.post('/academics/enroll', { course_id: courseId }),
  getMyCourses: () => api.get('/academics/my-courses'),
  getGrades: () => api.get('/academics/grades')
};

export const financeAPI = {
  getFees: () => api.get('/finance/fees'),
  payFee: (feeId, amount) => api.post('/finance/pay-fee', { fee_id: feeId, amount, payment_method: 'online' }),
  getDashboard: () => api.get('/finance/dashboard')
};

export const messagingAPI = {
  sendMessage: (recipientId, content) => api.post('/messaging/send', { recipient_id: recipientId, content }),
  getConversations: () => api.get('/messaging/conversations'),
  getMessages: (userId) => api.get(`/messaging/messages/${userId}`)
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getAcademicStats: () => api.get('/dashboard/academic-stats'),
  getFinancialStats: () => api.get('/dashboard/financial-stats')
};

export default api;