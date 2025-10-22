import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle,
  action,
  variant = 'default',
  hoverable = false,
  padding = 'md',
  className = ''
}) => {
  return (
    <div className={`card card-${variant} card-padding-${padding} ${hoverable ? 'card-hoverable' : ''} ${className}`}>
      {(title || subtitle || action) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;