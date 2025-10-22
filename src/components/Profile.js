import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user.first_name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{user.first_name} {user.last_name}</h2>
            <p className="email">{user.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <label>College:</label>
            <span>{user.college || 'Not specified'}</span>
          </div>
          <div className="detail-row">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="detail-row">
            <label>Member Since:</label>
            <span>{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}

        {editing && (
          <div className="edit-section">
            <p className="note">Edit feature coming soon</p>
            <button className="cancel-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Settings</h3>
        <div className="setting-item">
          <label>Change Password</label>
          <button>Update</button>
        </div>
        <div className="setting-item">
          <label>Notification Preferences</label>
          <button>Configure</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;