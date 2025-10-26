import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import '../styles/Health.css';

function Health() {
  const [activeTab, setActiveTab] = useState('appointments');

  const [records] = useState([
    { id: 1, condition: 'Annual Checkup', prescription: 'Vitamin D supplements', doctor: 'Dr. Sarah Johnson', date: '2025-10-15', type: 'Routine' },
    { id: 2, condition: 'Flu', prescription: 'Rest and fluids, Paracetamol', doctor: 'Dr. Michael Chen', date: '2025-10-10', type: 'Illness' },
    { id: 3, condition: 'Allergy Consultation', prescription: 'Antihistamines', doctor: 'Dr. Emily Brown', date: '2025-09-28', type: 'Consultation' }
  ]);

  const [appointments] = useState([
    { id: 1, doctor: 'Dr. Smith', specialty: 'General Physician', date: '2025-10-28', time: '10:00 AM', status: 'confirmed', type: 'Checkup' },
    { id: 2, doctor: 'Dr. Williams', specialty: 'Dentist', date: '2025-11-05', time: '2:30 PM', status: 'pending', type: 'Dental' },
    { id: 3, doctor: 'Dr. Davis', specialty: 'Ophthalmologist', date: '2025-11-12', time: '11:00 AM', status: 'confirmed', type: 'Eye Exam' }
  ]);

  const [gymStatus] = useState({
    level: 'Premium',
    expiry: '2025-12-31',
    active: true,
    daysLeft: 66
  });

  return (
    <div className="health-container">
      {/* Header */}
      <div className="health-header">
        <div>
          <h1 className="health-title">Health & Wellness</h1>
          <p className="health-subtitle">Manage your health records, appointments, and fitness</p>
        </div>
        <Button variant="primary">+ Book Appointment</Button>
      </div>

      {/* Quick Stats */}
      <div className="health-stats">
        <Card className="health-stat-card">
          <div className="health-stat-content">
            <div className="health-stat-value">{appointments.filter(a => a.status === 'confirmed').length}</div>
            <div className="health-stat-label">Upcoming Appointments</div>
          </div>
        </Card>
        <Card className="health-stat-card">
          <div className="health-stat-content">
            <div className="health-stat-value">{records.length}</div>
            <div className="health-stat-label">Medical Records</div>
          </div>
        </Card>
        <Card className={`health-stat-card ${gymStatus.active ? 'active-gym' : ''}`}>
          <div className="health-stat-content">
            <div className="health-stat-value">{gymStatus.active ? '✓' : '✗'}</div>
            <div className="health-stat-label">Gym Membership</div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="health-tabs">
        <button
          className={`health-tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button
          className={`health-tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          Medical Records
        </button>
        <button
          className={`health-tab ${activeTab === 'gym' ? 'active' : ''}`}
          onClick={() => setActiveTab('gym')}
        >
          Gym Access
        </button>
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="health-content">
          <div className="appointments-list">
            {appointments.map(appt => (
              <Card key={appt.id} hoverable className="appointment-card">
                <div className="appointment-date-badge">
                  <div className="appointment-month">
                    {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div className="appointment-day">
                    {new Date(appt.date).getDate()}
                  </div>
                </div>
                <div className="appointment-details">
                  <div className="appointment-header">
                    <div>
                      <h3 className="appointment-doctor">{appt.doctor}</h3>
                      <p className="appointment-specialty">{appt.specialty}</p>
                    </div>
                    <span className={`appointment-status-badge ${appt.status}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="appointment-info">
                    <div className="info-item">
                      <span className="info-label">Time</span>
                      <span className="info-value">{appt.time}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Type</span>
                      <span className="info-value">{appt.type}</span>
                    </div>
                  </div>
                </div>
                <div className="appointment-actions">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="ghost" size="sm">Cancel</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Medical Records Tab */}
      {activeTab === 'records' && (
        <div className="health-content">
          <div className="records-list">
            {records.map(record => (
              <Card key={record.id} hoverable className="record-card">
                <div className="record-header">
                  <div>
                    <h3 className="record-condition">{record.condition}</h3>
                    <p className="record-doctor">Dr. {record.doctor}</p>
                  </div>
                  <span className="record-type-badge">{record.type}</span>
                </div>
                <div className="record-details">
                  <div className="record-section">
                    <span className="section-label">Prescription</span>
                    <p className="section-value">{record.prescription}</p>
                  </div>
                  <div className="record-section">
                    <span className="section-label">Date</span>
                    <p className="section-value">{record.date}</p>
                  </div>
                </div>
                <div className="record-actions">
                  <Button variant="ghost" size="sm">View Full Record</Button>
                  <Button variant="outline" size="sm">Download PDF</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Gym Access Tab */}
      {activeTab === 'gym' && (
        <div className="health-content">
          <Card className="gym-membership-card">
            <div className="gym-card-header">
              <div className="gym-icon">
                <div className="gym-icon-inner">GYM</div>
              </div>
              <div className="gym-status-section">
                <h2 className="gym-title">Gym Membership</h2>
                <span className={`gym-status-badge ${gymStatus.active ? 'active' : 'inactive'}`}>
                  {gymStatus.active ? '✓ Active' : '✗ Inactive'}
                </span>
              </div>
            </div>

            <div className="gym-details">
              <div className="gym-detail-item">
                <span className="gym-detail-label">Membership Level</span>
                <span className="gym-detail-value">{gymStatus.level}</span>
              </div>
              <div className="gym-detail-item">
                <span className="gym-detail-label">Valid Until</span>
                <span className="gym-detail-value">{gymStatus.expiry}</span>
              </div>
              <div className="gym-detail-item">
                <span className="gym-detail-label">Days Remaining</span>
                <span className="gym-detail-value">{gymStatus.daysLeft} days</span>
              </div>
            </div>

            {gymStatus.active && (
              <div className="gym-progress">
                <div className="progress-bar-label">
                  <span>Membership Progress</span>
                  <span>{Math.round((gymStatus.daysLeft / 365) * 100)}%</span>
                </div>
                <div className="gym-progress-bar">
                  <div 
                    className="gym-progress-fill" 
                    style={{ width: `${(gymStatus.daysLeft / 365) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="gym-actions">
              <Button variant="primary" fullWidth>Renew Membership</Button>
              <Button variant="outline" fullWidth>View Access History</Button>
            </div>
          </Card>

          {/* Gym Features */}
          <Card title="Premium Membership Benefits" className="gym-features-card">
            <div className="gym-features">
              <div className="gym-feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  <h4>24/7 Access</h4>
                  <p>Unlimited gym access anytime</p>
                </div>
              </div>
              <div className="gym-feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  <h4>Personal Training</h4>
                  <p>2 sessions per month included</p>
                </div>
              </div>
              <div className="gym-feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  <h4>Group Classes</h4>
                  <p>Yoga, Zumba, CrossFit & more</p>
                </div>
              </div>
              <div className="gym-feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  <h4>Premium Equipment</h4>
                  <p>Access to all advanced machines</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Health;