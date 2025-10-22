import React from 'react';
import './Alert.css';

const Alert = ({ 
  children, 
  variant = 'info',
  title,
  onClose,
  className = ''
}) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`alert alert-${variant} ${className}`}>
      <div className="alert-icon">{icons[variant]}</div>
      <div className="alert-content">
        {title && <p className="alert-title">{title}</p>}
        <p className="alert-message">{children}</p>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>✕</button>
      )}
    </div>
  );
};

export default Alert;