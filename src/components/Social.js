import React, { useState } from 'react';
import '../styles/Social.css';

function Social() {
  const [activeTab, setActiveTab] = useState('groups');
  const [groups] = useState([
    { id: 1, name: 'Computer Science Club', members: 24, description: 'For CS students' },
    { id: 2, name: 'Sports Club', members: 45, description: 'For sports enthusiasts' },
    { id: 3, name: 'AI & ML Group', members: 18, description: 'AI discussion group' }
  ]);
  const [events] = useState([
    { id: 1, name: 'Coding Workshop', date: '2025-10-25', group: 'CS Club', attendees: 12 },
    { id: 2, name: 'Cricket Tournament', date: '2025-11-01', group: 'Sports Club', attendees: 30 }
  ]);
  const [connections] = useState([
    { id: 1, name: 'John Doe', college: 'MIT', status: 'connected' },
    { id: 2, name: 'Jane Smith', college: 'Stanford', status: 'connected' }
  ]);

  return (
    <div className="social-container">
      <h1>Social & Networking</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'groups' ? 'active' : ''} 
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''} 
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button 
          className={activeTab === 'connections' ? 'active' : ''} 
          onClick={() => setActiveTab('connections')}
        >
          Connections
        </button>
      </div>

      {activeTab === 'groups' && (
        <div className="groups-grid">
          {groups.map(group => (
            <div key={group.id} className="group-card">
              <h3>{group.name}</h3>
              <p className="description">{group.description}</p>
              <p className="members">👥 {group.members} members</p>
              <button className="join-btn">Join Group</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p className="group">Group: {event.group}</p>
              <p className="date">📅 {event.date}</p>
              <p className="attendees">👥 {event.attendees} attending</p>
              <button className="attend-btn">Attend Event</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="connections-list">
          {connections.map(conn => (
            <div key={conn.id} className="connection-card">
              <div className="conn-avatar">
                {conn.name.charAt(0).toUpperCase()}
              </div>
              <div className="conn-info">
                <h3>{conn.name}</h3>
                <p>{conn.college}</p>
              </div>
              <div className="conn-status">
                <span className="status-badge">{conn.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Social;