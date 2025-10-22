import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-animation">
          <span className="not-found-emoji">🤔</span>
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved or deleted.
        </p>
        <div className="not-found-actions">
          <Link to="/dashboard">
            <Button variant="primary" size="lg">Go to Dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;