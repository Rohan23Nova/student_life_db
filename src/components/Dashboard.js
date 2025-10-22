import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Alert from './ui/Alert';
import '../styles/Dashboard.css';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboard(response.data.dashboard);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <Alert variant="error">{error}</Alert>
        <Button onClick={fetchDashboard} variant="primary">Try Again</Button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-error">
        <Alert variant="warning">No dashboard data available</Alert>
      </div>
    );
  }

  const stats = [
    {
      title: 'Enrolled Courses',
      value: dashboard.academics?.total_courses || 0,
      icon: '📚',
      color: 'blue',
      link: '/courses'
    },
    {
      title: 'Average GPA',
      value: dashboard.academics?.average_gpa?.toFixed(2) || 'N/A',
      icon: '🎓',
      color: 'green',
      link: '/courses'
    },
    {
      title: 'Outstanding Fees',
      value: `$${dashboard.finances?.outstanding_fees || 0}`,
      icon: '💰',
      color: 'orange',
      link: '/finance'
    },
    {
      title: 'Upcoming Assignments',
      value: dashboard.schedule?.upcoming_assignments || 0,
      icon: '📅',
      color: 'purple',
      link: '/schedule'
    },
    {
      title: 'Unread Messages',
      value: dashboard.communication?.unread_messages || 0,
      icon: '💬',
      color: 'pink',
      link: '/messages'
    },
    {
      title: 'Active Bookings',
      value: dashboard.hostel?.active_bookings || 0,
      icon: '🏠',
      color: 'teal',
      link: '/hostel'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {dashboard.user?.first_name}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your student life today.
          </p>
        </div>
        <Button variant="primary" onClick={fetchDashboard}>
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <a href={stat.link} key={index} className="stat-card-link">
            <Card hoverable className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
            </Card>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="quick-actions-card">
        <div className="quick-actions-grid">
          <Button variant="outline" fullWidth>
            📝 View Assignments
          </Button>
          <Button variant="outline" fullWidth>
            💳 Pay Fees
          </Button>
          <Button variant="outline" fullWidth>
            📖 Study Materials
          </Button>
          <Button variant="outline" fullWidth>
            🏥 Book Appointment
          </Button>
        </div>
      </Card>

      {/* Recent Activity Section */}
      <div className="dashboard-bottom">
        <Card title="Recent Activity" subtitle="Your latest updates">
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon blue">📚</div>
              <div className="activity-content">
                <p className="activity-title">New course material uploaded</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon green">✅</div>
              <div className="activity-content">
                <p className="activity-title">Assignment submitted successfully</p>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon orange">💰</div>
              <div className="activity-content">
                <p className="activity-title">Fee payment reminder</p>
                <p className="activity-time">2 days ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Upcoming Events" subtitle="Don't miss these">
          <div className="events-list">
            <div className="event-item">
              <div className="event-date">
                <span className="event-day">24</span>
                <span className="event-month">Oct</span>
              </div>
              <div className="event-details">
                <p className="event-title">Mid-term Exams Begin</p>
                <p className="event-location">Main Campus</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">
                <span className="event-day">28</span>
                <span className="event-month">Oct</span>
              </div>
              <div className="event-details">
                <p className="event-title">Project Submission Deadline</p>
                <p className="event-location">Online Portal</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;