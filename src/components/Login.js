import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Alert from './ui/Alert';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user_id);
      
      // Save user data for navbar
      localStorage.setItem('user', JSON.stringify({
        name: response.data.user?.name || 'Student',
        email: email,
        student_id: response.data.user_id
      }));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h1 className="auth-title">StudentLife</h1>
          <p className="auth-subtitle">Welcome back! Please login to your account.</p>
        </div>

        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<span>📧</span>}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<span>🔒</span>}
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth 
            isLoading={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;