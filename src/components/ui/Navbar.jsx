import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/courses', label: 'Courses' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/finance', label: 'Finance' },
    { path: '/messages', label: 'Messages' },
    { path: '/social', label: 'Social' },
    { path: '/hostel', label: 'Hostel' },
    { path: '/health', label: 'Health' },
  ];

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-logo">🎓</span>
          <span className="navbar-title">StudentLife</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar-actions">
          {user && (
            <>
              <Link to="/profile" className="navbar-profile">
                <div className="navbar-avatar">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="navbar-username">{user.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar-mobile-footer">
            <Button variant="secondary" fullWidth onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;