import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import './App.css';

function App() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route path="/courses" element={isLoggedIn ? <Courses /> : <Navigate to="/login" />} />
        <Route path="/finance" element={isLoggedIn ? <Finance /> : <Navigate to="/login" />} />
        <Route path="/messages" element={isLoggedIn ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Navigate to="/login" />} />
        <Route path="/hostel" element={isLoggedIn ? <Hostel /> : <Navigate to="/login" />} />
        <Route path="/health" element={isLoggedIn ? <Health /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/social" element={isLoggedIn ? <Social /> : <Navigate to="/login" />} />
        <Route path="/design-test" element={<DesignTest />} />
        
      </Routes>
    </Router>
  );
}

export default App;