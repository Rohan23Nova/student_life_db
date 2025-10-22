import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Alert from './ui/Alert';
import '../styles/Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    college: '',
    enrollment_year: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.signup(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user_id);
      
      // Save user data for navbar
      localStorage.setItem('user', JSON.stringify({
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        student_id: response.data.user_id
      }));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box auth-box-large">
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h1 className="auth-title">Join StudentLife</h1>
          <p className="auth-subtitle">Create your account and start managing your student life better.</p>
        </div>

        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <Input
              label="First Name"
              type="text"
              name="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              required
              icon={<span>👤</span>}
            />
            <Input
              label="Last Name"
              type="text"
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              required
              icon={<span>👤</span>}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@university.edu"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<span>📧</span>}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
            helperText="Must be at least 6 characters"
            icon={<span>🔒</span>}
          />

          <Input
            label="College/University"
            type="text"
            name="college"
            placeholder="Your College Name"
            value={formData.college}
            onChange={handleChange}
            icon={<span>🏫</span>}
          />

          <Input
            label="Enrollment Year"
            type="number"
            name="enrollment_year"
            placeholder="2024"
            value={formData.enrollment_year}
            onChange={handleChange}
            icon={<span>📅</span>}
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth 
            isLoading={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;