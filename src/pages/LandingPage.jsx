import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      icon: '📚',
      title: 'Academic Management',
      description: 'Track courses, assignments, grades, and academic progress all in one place.'
    },
    {
      icon: '💰',
      title: 'Finance Tracking',
      description: 'Manage expenses, track payments, and maintain your budget effortlessly.'
    },
    {
      icon: '📅',
      title: 'Smart Scheduling',
      description: 'Never miss a class or deadline with intelligent calendar integration.'
    },
    {
      icon: '💬',
      title: 'Instant Messaging',
      description: 'Connect with classmates and faculty through built-in messaging.'
    },
    {
      icon: '🏠',
      title: 'Hostel Management',
      description: 'Handle room assignments, complaints, and hostel activities seamlessly.'
    },
    {
      icon: '❤️',
      title: 'Health & Wellness',
      description: 'Book appointments, track medications, and access health resources.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <div className="landing-brand">
            <span className="landing-logo">🎓</span>
            <span className="landing-title">StudentLife</span>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Complete
            <span className="hero-highlight"> Student Life</span>
            <br />Management Platform
          </h1>
          <p className="hero-subtitle">
            Everything you need to succeed in college - academics, finance, health, social life, and more. All in one beautiful platform.
          </p>
          <div className="hero-actions">
            <Link to="/signup">
              <Button variant="primary" size="lg">Start Free Today</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
          <p className="hero-note">✨ No credit card required. Get started in 2 minutes.</p>
        </div>
        <div className="hero-image">
          <div className="hero-card hero-card-1">
            <div className="hero-card-icon">📚</div>
            <div className="hero-card-text">5 Courses</div>
          </div>
          <div className="hero-card hero-card-2">
            <div className="hero-card-icon">✅</div>
            <div className="hero-card-text">12 Tasks Done</div>
          </div>
          <div className="hero-card hero-card-3">
            <div className="hero-card-icon">📊</div>
            <div className="hero-card-text">GPA: 3.8</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-header">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">
            Powerful features designed specifically for college students
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} hoverable className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Active Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Universities</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Student Life?</h2>
          <p className="cta-subtitle">
            Join thousands of students already managing their college life better
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg">Get Started Free →</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🎓</span>
            <span className="footer-title">StudentLife</span>
          </div>
          <p className="footer-text">
            © 2025 StudentLife. Made with ❤️ for students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;