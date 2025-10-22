import React from 'react';
import './Input.css';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  icon,
  className = '',
  ...props 
}) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className={`input-container ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="input-field"
          {...props}
        />
      </div>
      
      {error && <p className="input-error-text">{error}</p>}
      {helperText && !error && <p className="input-helper-text">{helperText}</p>}
    </div>
  );
};

export default Input;