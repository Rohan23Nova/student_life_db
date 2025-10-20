# Frontend Setup Instructions

This document explains how to build the React frontend for Student Life Management System.

## Prerequisites

- Node.js and npm installed
- Backend server running on http://localhost:8000

## Create React App
```bash
cd ~/Desktop
npx create-react-app student_life_frontend
cd student_life_frontend
```

## Install Dependencies
```bash
npm install axios react-router-dom
```

## Project Structure
```
student_life_frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Dashboard.js
│   │   ├── Courses.js
│   │   ├── Finance.js
│   │   ├── Messages.js
│   │   └── Profile.js
│   ├── services/
│   │   └── api.js (API calls to backend)
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## API Service Setup

Create `src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests
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
  getGrades: () => api.get('/academics/grades'),
  getAttendance: () => api.get('/academics/attendance')
};

export const financeAPI = {
  getFees: () => api.get('/finance/fees'),
  payFee: (feeId, amount) => api.post('/finance/pay-fee', { fee_id: feeId, amount, payment_method: 'online' }),
  getPaymentHistory: () => api.get('/finance/payment-history'),
  getScholarships: () => api.get('/finance/scholarships'),
  getDashboard: () => api.get('/finance/dashboard')
};

export const messagingAPI = {
  sendMessage: (recipientId, content) => api.post('/messaging/send', { recipient_id: recipientId, content }),
  getConversations: () => api.get('/messaging/conversations'),
  getMessages: (userId) => api.get(`/messaging/messages/${userId}`),
  getAnnouncements: () => api.get('/messaging/announcements'),
  getNotifications: () => api.get('/messaging/notifications')
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getAcademicStats: () => api.get('/dashboard/academic-stats'),
  getFinancialStats: () => api.get('/dashboard/financial-stats'),
  getCalendarView: () => api.get('/dashboard/calendar-view')
};

export default api;
```

## Key Components to Build

### 1. Login Component
- Email and password input
- Submit to backend
- Store JWT token in localStorage
- Redirect to dashboard

### 2. Dashboard Component
- Display personal stats
- Show upcoming assignments
- Display fee status
- Show unread messages count

### 3. Courses Component
- List all available courses
- Enroll in courses
- View enrolled courses
- Display grades

### 4. Finance Component
- View fees
- Make payments
- View payment history
- View scholarships

### 5. Messaging Component
- List conversations
- Send/receive messages
- View announcements
- Display notifications

### 6. Profile Component
- Display user info
- Edit profile
- Change password

## Running the Frontend
```bash
npm start
```

App will run on http://localhost:3000

## Next Steps

1. Build Login/Signup pages
2. Create Dashboard with stats
3. Add Courses management UI
4. Add Finance/Payment UI
5. Add Messaging UI
6. Add Profile settings
7. Deploy to production