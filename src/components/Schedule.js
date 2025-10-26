import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import '../styles/Schedule.css';

function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      setEvents([
        { type: 'assignment', name: 'Data Structures Assignment', date: '2025-10-25', time: '11:59 PM', course: 'CS101', priority: 'high' },
        { type: 'exam', name: 'Midterm Examination', date: '2025-10-28', time: '10:00 AM', course: 'CS102', priority: 'high' },
        { type: 'class', name: 'Machine Learning Lecture', date: '2025-10-26', time: '2:00 PM', course: 'CS201', priority: 'medium' },
        { type: 'deadline', name: 'Project Submission', date: '2025-10-30', time: '5:00 PM', course: 'CS301', priority: 'high' },
        { type: 'event', name: 'Career Fair', date: '2025-11-02', time: '9:00 AM', course: 'Campus Event', priority: 'medium' }
      ]);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    const icons = {
      assignment: '📝',
      exam: '📚',
      deadline: '⏰',
      class: '👨‍🏫',
      event: '🎉'
    };
    return icons[type] || '📅';
  };

  const getEventColor = (type) => {
    const colors = {
      assignment: 'blue',
      exam: 'red',
      deadline: 'orange',
      class: 'green',
      event: 'purple'
    };
    return colors[type] || 'gray';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcomingEvents = sortedEvents.filter(e => new Date(e.date) >= new Date());

  if (loading) {
    return (
      <div className="schedule-loading">
        <Spinner size="lg" text="Loading schedule..." />
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div>
          <h1 className="schedule-title">Schedule & Deadlines</h1>
          <p className="schedule-subtitle">Stay on top of your classes and assignments</p>
        </div>
        <div className="schedule-actions">
          <Button variant="outline" size="sm">📅 Export</Button>
          <Button variant="primary" size="sm">➕ Add Event</Button>
        </div>
      </div>

      <div className="schedule-stats">
        <Card className="stat-card-schedule">
          <div className="stat-icon-schedule">📅</div>
          <div className="stat-content-schedule">
            <div className="stat-value-schedule">{upcomingEvents.length}</div>
            <div className="stat-label-schedule">Upcoming</div>
          </div>
        </Card>
        <Card className="stat-card-schedule">
          <div className="stat-icon-schedule">📝</div>
          <div className="stat-content-schedule">
            <div className="stat-value-schedule">{events.filter(e => e.type === 'assignment').length}</div>
            <div className="stat-label-schedule">Assignments</div>
          </div>
        </Card>
        <Card className="stat-card-schedule">
          <div className="stat-icon-schedule">📚</div>
          <div className="stat-content-schedule">
            <div className="stat-value-schedule">{events.filter(e => e.type === 'exam').length}</div>
            <div className="stat-label-schedule">Exams</div>
          </div>
        </Card>
      </div>

      <Card title="Upcoming Events" subtitle="Next 7 days" className="events-section">
        <div className="events-list">
          {upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <p>No upcoming events. Enjoy your free time!</p>
            </div>
          ) : (
            upcomingEvents.map((event, idx) => {
              const dateInfo = formatDate(event.date);
              return (
                <div key={idx} className={`event-card-new event-${getEventColor(event.type)}`}>
                  <div className="event-date-calendar">
                    <div className="calendar-month">{dateInfo.month}</div>
                    <div className="calendar-day">{dateInfo.day}</div>
                  </div>
                  <div className="event-type-badge">{getEventIcon(event.type)}</div>
                  <div className="event-details-new">
                    <div className="event-header-new">
                      <h3 className="event-name-new">{event.name}</h3>
                      {event.priority === 'high' && (
                        <span className="priority-badge-new">High Priority</span>
                      )}
                    </div>
                    <p className="event-course-new">{event.course}</p>
                    <div className="event-meta-new">
                      <span>🕐 {event.time}</span>
                    </div>
                  </div>
                  <div className="event-actions-new">
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

export default Schedule;