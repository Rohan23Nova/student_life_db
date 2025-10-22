import React from 'react';
import './Spinner.css';

const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  text
}) => {
  const spinner = (
    <div className={`spinner spinner-${size} spinner-${color}`}>
      <div className="spinner-circle"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;