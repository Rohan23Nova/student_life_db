import React, { useState } from 'react';
import '../styles/Hostel.css';

function Hostel() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms] = useState([
    { id: 1, number: '101', capacity: 2, status: 'available' },
    { id: 2, number: '102', capacity: 2, status: 'booked' },
    { id: 3, number: '103', capacity: 3, status: 'available' },
    { id: 4, number: '104', capacity: 2, status: 'available' }
  ]);
  const [complaints] = useState([
    { id: 1, location: 'Room 101', issue: 'Broken window', status: 'pending' },
    { id: 2, location: 'Corridor', issue: 'Light not working', status: 'resolved' }
  ]);

  return (
    <div className="hostel-container">
      <h1>Hostel Management</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'rooms' ? 'active' : ''} 
          onClick={() => setActiveTab('rooms')}
        >
          Available Rooms
        </button>
        <button 
          className={activeTab === 'complaints' ? 'active' : ''} 
          onClick={() => setActiveTab('complaints')}
        >
          Complaints
        </button>
      </div>

      {activeTab === 'rooms' && (
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room.id} className={`room-card ${room.status}`}>
              <h3>Room {room.number}</h3>
              <p>Capacity: {room.capacity} persons</p>
              <p className="status">{room.status}</p>
              {room.status === 'available' && (
                <button className="book-btn">Book Now</button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="complaints-list">
          {complaints.map(complaint => (
            <div key={complaint.id} className={`complaint-card ${complaint.status}`}>
              <h3>{complaint.issue}</h3>
              <p>Location: {complaint.location}</p>
              <p className="status">{complaint.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Hostel;