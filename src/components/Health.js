import React, { useState } from 'react';
import '../styles/Health.css';

function Health() {
  const [activeTab, setActiveTab] = useState('records');
  const [records] = useState([
    { id: 1, condition: 'Flu', prescription: 'Rest and fluids', date: '2025-10-15' }
  ]);
  const [appointments] = useState([
    { id: 1, doctor: 'Dr. Smith', date: '2025-10-20', time: '10:00 AM', status: 'scheduled' }
  ]);
  const [gymStatus] = useState({
    level: 'premium',
    expiry: '2025-12-31',
    active: true
  });

  return (
    <div className="health-container">
      <h1>Health & Wellness</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'records' ? 'active' : ''} 
          onClick={() => setActiveTab('records')}
        >
          Medical Records
        </button>
        <button 
          className={activeTab === 'appointments' ? 'active' : ''} 
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={activeTab === 'gym' ? 'active' : ''} 
          onClick={() => setActiveTab('gym')}
        >
          Gym Access
        </button>
      </div>

      {activeTab === 'records' && (
        <div className="records-list">
          {records.map(record => (
            <div key={record.id} className="record-card">
              <h3>{record.condition}</h3>
              <p>Prescription: {record.prescription}</p>
              <p className="date">{record.date}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="appointments-list">
          {appointments.map(appt => (
            <div key={appt.id} className="appointment-card">
              <h3>{appt.doctor}</h3>
              <p>{appt.date} at {appt.time}</p>
              <p className="status">{appt.status}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'gym' && (
        <div className="gym-card">
          <h3>Gym Membership</h3>
          <p>Level: <strong>{gymStatus.level}</strong></p>
          <p>Valid Until: <strong>{gymStatus.expiry}</strong></p>
          <p className={`status ${gymStatus.active ? 'active' : 'inactive'}`}>
            {gymStatus.active ? '✓ Active' : '✗ Inactive'}
          </p>
        </div>
      )}
    </div>
  );
}

export default Health;