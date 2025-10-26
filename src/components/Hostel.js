import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import '../styles/Hostel.css';

function Hostel() {
  const [activeTab, setActiveTab] = useState('rooms');
  
  const [rooms] = useState([
    { id: 1, number: '101', floor: '1st Floor', capacity: 2, status: 'available', type: 'Standard' },
    { id: 2, number: '102', floor: '1st Floor', capacity: 2, status: 'booked', type: 'Standard' },
    { id: 3, number: '103', floor: '1st Floor', capacity: 3, status: 'available', type: 'Deluxe' },
    { id: 4, number: '104', floor: '1st Floor', capacity: 2, status: 'available', type: 'Standard' },
    { id: 5, number: '201', floor: '2nd Floor', capacity: 2, status: 'booked', type: 'Deluxe' },
    { id: 6, number: '202', floor: '2nd Floor', capacity: 3, status: 'available', type: 'Premium' }
  ]);

  const [complaints] = useState([
    { id: 1, location: 'Room 101', issue: 'Broken window', category: 'Maintenance', status: 'pending', date: '2025-10-20', priority: 'high' },
    { id: 2, location: 'Common Area', issue: 'Light not working', category: 'Electrical', status: 'in-progress', date: '2025-10-18', priority: 'medium' },
    { id: 3, location: 'Bathroom - 2nd Floor', issue: 'Water leakage', category: 'Plumbing', status: 'resolved', date: '2025-10-15', priority: 'high' },
    { id: 4, location: 'Corridor', issue: 'Paint peeling', category: 'Maintenance', status: 'pending', date: '2025-10-22', priority: 'low' }
  ]);

  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const bookedRooms = rooms.filter(r => r.status === 'booked').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;

  return (
    <div className="hostel-container">
      {/* Header */}
      <div className="hostel-header">
        <div>
          <h1 className="hostel-title">Hostel Management</h1>
          <p className="hostel-subtitle">Manage room bookings and facility complaints</p>
        </div>
        <Button variant="primary">+ New Complaint</Button>
      </div>

      {/* Stats */}
      <div className="hostel-stats">
        <Card className="hostel-stat-card">
          <div className="hostel-stat-content">
            <div className="hostel-stat-value">{rooms.length}</div>
            <div className="hostel-stat-label">Total Rooms</div>
          </div>
        </Card>
        <Card className="hostel-stat-card available">
          <div className="hostel-stat-content">
            <div className="hostel-stat-value">{availableRooms}</div>
            <div className="hostel-stat-label">Available</div>
          </div>
        </Card>
        <Card className="hostel-stat-card booked">
          <div className="hostel-stat-content">
            <div className="hostel-stat-value">{bookedRooms}</div>
            <div className="hostel-stat-label">Booked</div>
          </div>
        </Card>
        <Card className="hostel-stat-card complaints">
          <div className="hostel-stat-content">
            <div className="hostel-stat-value">{pendingComplaints}</div>
            <div className="hostel-stat-label">Pending Issues</div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="hostel-tabs">
        <button
          className={`hostel-tab ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Available Rooms
        </button>
        <button
          className={`hostel-tab ${activeTab === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveTab('complaints')}
        >
          Complaints & Issues
        </button>
      </div>

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div className="hostel-content">
          <div className="rooms-grid">
            {rooms.map(room => (
              <Card key={room.id} hoverable className={`room-card ${room.status}`}>
                <div className="room-header">
                  <div className="room-number">Room {room.number}</div>
                  <span className={`room-status-badge ${room.status}`}>
                    {room.status === 'available' ? 'Available' : 'Booked'}
                  </span>
                </div>
                <div className="room-details">
                  <div className="room-detail">
                    <span className="detail-label">Floor</span>
                    <span className="detail-value">{room.floor}</span>
                  </div>
                  <div className="room-detail">
                    <span className="detail-label">Capacity</span>
                    <span className="detail-value">{room.capacity} persons</span>
                  </div>
                  <div className="room-detail">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{room.type}</span>
                  </div>
                </div>
                {room.status === 'available' && (
                  <Button variant="primary" size="sm" fullWidth>
                    Book Now
                  </Button>
                )}
                {room.status === 'booked' && (
                  <Button variant="ghost" size="sm" fullWidth disabled>
                    Currently Occupied
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="hostel-content">
          <div className="complaints-list">
            {complaints.map(complaint => (
              <Card key={complaint.id} hoverable className="complaint-card">
                <div className="complaint-header">
                  <div className="complaint-title-section">
                    <h3 className="complaint-issue">{complaint.issue}</h3>
                    <span className={`priority-badge ${complaint.priority}`}>
                      {complaint.priority} priority
                    </span>
                  </div>
                  <span className={`complaint-status-badge ${complaint.status}`}>
                    {complaint.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="complaint-details">
                  <div className="complaint-info">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{complaint.location}</span>
                  </div>
                  <div className="complaint-info">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{complaint.category}</span>
                  </div>
                  <div className="complaint-info">
                    <span className="info-label">Reported:</span>
                    <span className="info-value">{complaint.date}</span>
                  </div>
                </div>
                <div className="complaint-actions">
                  <Button variant="ghost" size="sm">View Details</Button>
                  {complaint.status === 'pending' && (
                    <Button variant="outline" size="sm">Follow Up</Button>
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

export default Hostel;