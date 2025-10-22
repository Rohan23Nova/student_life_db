import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import '../styles/Schedule.css';

function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      // You'll need to add calendar-view to your API calls
      setEvents([
        { type: 'assignment', name: 'Assignment 1', date: '2025-10-25', course: 'CS101' },
        { type: 'exam', name: 'Midterm Exam', date: '2025-11-20', course: 'CS102' },
        { type: 'deadline', name: 'Project Submission', date: '2025-10-30', course: 'Personal' }
      ]);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="schedule-container">
      <h1>Schedule & Deadlines</h1>
      
      <div className="events-list">
        {events.map((event, idx) => (
          <div key={idx} className={`event-item ${event.type}`}>
            <div className="event-icon">
              {event.type === 'assignment' && '📝'}
              {event.type === 'exam' && '📚'}
              {event.type === 'deadline' && '⏰'}
            </div>
            <div className="event-details">
              <h3>{event.name}</h3>
              <p className="course">{event.course}</p>
              <p className="date">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;