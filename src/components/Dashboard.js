import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dashboard) return <div>No data</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {dashboard.user?.first_name}</h1>
      
      <div className="dashboard-grid">
        
        <div className="card">
          <h3>Academics</h3>
          <p>Enrolled Courses: {dashboard.academics?.total_courses || 0}</p>
          <p>Average GPA: {dashboard.academics?.average_gpa?.toFixed(2) || 'N/A'}</p>
        </div>

        <div className="card">
          <h3>Finance</h3>
          <p>Outstanding Fees: ${dashboard.finances?.outstanding_fees || 0}</p>
        </div>

        <div className="card">
          <h3>Schedule</h3>
          <p>Upcoming Assignments: {dashboard.schedule?.upcoming_assignments || 0}</p>
        </div>

        <div className="card">
          <h3>Messages</h3>
          <p>Unread: {dashboard.communication?.unread_messages || 0}</p>
        </div>

        <div className="card">
          <h3>Hostel</h3>
          <p>Active Bookings: {dashboard.hostel?.active_bookings || 0}</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;