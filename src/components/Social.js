import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import '../styles/Social.css';

function Social() {
  const [activeTab, setActiveTab] = useState('groups');
  
  const [groups] = useState([
    { id: 1, name: 'Computer Science Club', members: 24, description: 'Connect with fellow CS students, share resources, and collaborate on projects.', category: 'Academic' },
    { id: 2, name: 'Sports Enthusiasts', members: 45, description: 'Join us for various sports activities, tournaments, and fitness events.', category: 'Sports' },
    { id: 3, name: 'AI & Machine Learning', members: 18, description: 'Discuss latest trends in AI, share research papers, and work on ML projects.', category: 'Academic' },
    { id: 4, name: 'Photography Club', members: 32, description: 'For photography lovers. Share tips, organize photo walks, and exhibitions.', category: 'Arts' }
  ]);

  const [events] = useState([
    { id: 1, name: 'Coding Hackathon', date: '2025-11-05', time: '9:00 AM', location: 'Tech Hub, Building A', group: 'CS Club', attendees: 35, category: 'Workshop' },
    { id: 2, name: 'Cricket Tournament Finals', date: '2025-11-08', time: '4:00 PM', location: 'Sports Complex', group: 'Sports Club', attendees: 120, category: 'Sports' },
    { id: 3, name: 'AI Research Symposium', date: '2025-11-12', time: '2:00 PM', location: 'Auditorium', group: 'AI & ML', attendees: 45, category: 'Conference' },
    { id: 4, name: 'Campus Photo Exhibition', date: '2025-11-15', time: '10:00 AM', location: 'Art Gallery', group: 'Photography', attendees: 28, category: 'Exhibition' }
  ]);

  const [connections] = useState([
    { id: 1, name: 'John Smith', college: 'MIT', course: 'Computer Science', mutualFriends: 12, status: 'connected' },
    { id: 2, name: 'Sarah Johnson', college: 'Stanford', course: 'Data Science', mutualFriends: 8, status: 'connected' },
    { id: 3, name: 'Mike Chen', college: 'Berkeley', course: 'AI Research', mutualFriends: 5, status: 'pending' },
    { id: 4, name: 'Emily Davis', college: 'Harvard', course: 'Software Engineering', mutualFriends: 15, status: 'connected' }
  ]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Academic': 'blue',
      'Sports': 'green',
      'Arts': 'purple',
      'Workshop': 'orange',
      'Conference': 'blue',
      'Exhibition': 'pink'
    };
    return colors[category] || 'gray';
  };

  return (
    <div className="social-container">
      {/* Header */}
      <div className="social-header">
        <div>
          <h1 className="social-title">Social & Networking</h1>
          <p className="social-subtitle">Connect with students, join groups, and attend events</p>
        </div>
      </div>

      {/* Stats */}
      <div className="social-stats">
        <Card className="social-stat-card">
          <div className="stat-number">{connections.filter(c => c.status === 'connected').length}</div>
          <div className="stat-label">Connections</div>
        </Card>
        <Card className="social-stat-card">
          <div className="stat-number">{groups.length}</div>
          <div className="stat-label">Groups Joined</div>
        </Card>
        <Card className="social-stat-card">
          <div className="stat-number">{events.length}</div>
          <div className="stat-label">Events</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="social-tabs">
        <button
          className={`social-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
        <button
          className={`social-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button
          className={`social-tab ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          Connections
        </button>
      </div>

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="social-content">
          <div className="content-header">
            <h2>Discover Groups</h2>
            <Button variant="primary" size="sm">+ Create Group</Button>
          </div>
          <div className="groups-grid">
            {groups.map(group => (
              <Card key={group.id} hoverable className="group-card">
                <div className="group-header">
                  <div className="group-avatar">{getInitials(group.name)}</div>
                  <span className={`category-badge ${getCategoryColor(group.category)}`}>
                    {group.category}
                  </span>
                </div>
                <h3 className="group-name">{group.name}</h3>
                <p className="group-description">{group.description}</p>
                <div className="group-footer">
                  <span className="group-members">{group.members} members</span>
                  <Button variant="primary" size="sm">Join Group</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="social-content">
          <div className="content-header">
            <h2>Upcoming Events</h2>
            <Button variant="primary" size="sm">+ Create Event</Button>
          </div>
          <div className="events-grid">
            {events.map(event => (
              <Card key={event.id} hoverable className="event-card-social">
                <div className="event-date-badge-social">
                  <div className="event-month-social">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div className="event-day-social">
                    {new Date(event.date).getDate()}
                  </div>
                </div>
                <div className="event-content-social">
                  <div className="event-header-social">
                    <h3 className="event-name-social">{event.name}</h3>
                    <span className={`category-badge ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  <p className="event-group-social">Organized by {event.group}</p>
                  <div className="event-details-grid">
                    <div className="event-detail-item">
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{event.time}</span>
                    </div>
                    <div className="event-detail-item">
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{event.location}</span>
                    </div>
                    <div className="event-detail-item">
                      <span className="detail-label">Attendees</span>
                      <span className="detail-value">{event.attendees} going</span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" fullWidth>Attend Event</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="social-content">
          <div className="content-header">
            <h2>Your Network</h2>
            <Button variant="primary" size="sm">+ Find People</Button>
          </div>
          <div className="connections-grid">
            {connections.map(conn => (
              <Card key={conn.id} hoverable className="connection-card">
                <div className="connection-avatar">{getInitials(conn.name)}</div>
                <h3 className="connection-name">{conn.name}</h3>
                <p className="connection-college">{conn.college}</p>
                <p className="connection-course">{conn.course}</p>
                <p className="connection-mutual">{conn.mutualFriends} mutual connections</p>
                <div className="connection-actions">
                  {conn.status === 'connected' ? (
                    <>
                      <Button variant="outline" size="sm" fullWidth>Message</Button>
                      <Button variant="ghost" size="sm">✓ Connected</Button>
                    </>
                  ) : (
                    <Button variant="primary" size="sm" fullWidth>Accept Request</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Social;