import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Finance from './components/Finance';
import Messages from './components/Messages';
import Schedule from './components/Schedule';
import Hostel from './components/Hostel';
import Health from './components/Health';
import Profile from './components/Profile';
import Social from './components/Social';
import DesignTest from './pages/DesignTest';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  // Hide navbar on landing page and auth pages
  const hideNavbar = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <>
      {isLoggedIn && !hideNavbar && <Navbar user={user} onLogout={handleLogout} />}
      
      <div className={hideNavbar ? '' : 'app-content'}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/courses" element={isLoggedIn ? <Courses /> : <Navigate to="/login" />} />
          <Route path="/finance" element={isLoggedIn ? <Finance /> : <Navigate to="/login" />} />
          <Route path="/messages" element={isLoggedIn ? <Messages /> : <Navigate to="/login" />} />
          <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Navigate to="/login" />} />
          <Route path="/hostel" element={isLoggedIn ? <Hostel /> : <Navigate to="/login" />} />
          <Route path="/health" element={isLoggedIn ? <Health /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/social" element={isLoggedIn ? <Social /> : <Navigate to="/login" />} />
          <Route path="/design-test" element={<DesignTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;