import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Spinner from './ui/Spinner';
import Alert from './ui/Alert';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    college: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
      setFormData({
        first_name: response.data.user.first_name || '',
        last_name: response.data.user.last_name || '',
        email: response.data.user.email || '',
        college: response.data.user.college || '',
        phone: response.data.user.phone || ''
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    setSuccessMessage('Profile updated successfully!');
    setEditing(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancelEdit = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      college: user.college || '',
      phone: user.phone || ''
    });
    setEditing(false);
  };

  const getInitials = () => {
    return `${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <Spinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <Alert variant="error">No user data available</Alert>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header-section">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Manage your account settings and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="profile-layout">
        {/* Sidebar */}
        <Card className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">{getInitials()}</div>
            <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
            <p className="profile-email">{user.email}</p>
            <span className="profile-member-badge">
              Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="profile-nav">
            <button
              className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span>Personal Information</span>
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span>Security</span>
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span>Settings</span>
            </button>
          </div>
        </Card>

        {/* Main Content */}
        <div className="profile-main">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card title="Personal Information" subtitle="Update your personal details">
              <div className="profile-form">
                <div className="form-row">
                  <Input
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editing}
                  required
                />

                <Input
                  label="College/University"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  disabled={!editing}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="+1 (555) 000-0000"
                />

                <div className="profile-form-actions">
                  {!editing ? (
                    <Button variant="primary" onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button variant="primary" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                      <Button variant="ghost" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card title="Security Settings" subtitle="Manage your password and account security">
              <div className="security-section">
                <div className="security-info">
                  <h4>Password</h4>
                  <p>Last changed: {new Date(user.created_at).toLocaleDateString()}</p>
                </div>

                <div className="password-form">
                  <Input
                    label="Current Password"
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />

                  <Input
                    label="New Password"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    helperText="Must be at least 8 characters"
                  />

                  <Input
                    label="Confirm New Password"
                    name="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />

                  <Button variant="primary">Update Password</Button>
                </div>
              </div>

              <div className="security-options">
                <h4>Two-Factor Authentication</h4>
                <p className="security-description">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card title="Account Settings" subtitle="Manage your preferences and notifications">
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your account activity</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Assignment Reminders</h4>
                    <p>Get notified about upcoming deadlines</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Privacy Settings</h4>
                    <p>Control who can see your information</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Language & Region</h4>
                    <p>English (US)</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>

                <div className="setting-item danger">
                  <div className="setting-info">
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;