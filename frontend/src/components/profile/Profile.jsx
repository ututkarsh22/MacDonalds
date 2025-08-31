import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password fields if changing password
    if (activeTab === 'security' && formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    
    try {
      // Only include fields that should be updated
      const dataToUpdate = {};
      
      if (activeTab === 'profile') {
        if (formData.name) dataToUpdate.name = formData.name;
        if (formData.phone) dataToUpdate.phone = formData.phone;
        if (formData.address) dataToUpdate.address = formData.address;
      } else if (activeTab === 'security') {
        if (formData.currentPassword && formData.newPassword) {
          dataToUpdate.currentPassword = formData.currentPassword;
          dataToUpdate.newPassword = formData.newPassword;
        }
      }
      
      await updateUser(dataToUpdate);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      
      // Clear password fields after update
      if (activeTab === 'security') {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2>{user?.name || 'User'}</h2>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Personal Info
        </button>
        <button 
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            <div className="info-header">
              <h3>Personal Information</h3>
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Your name"
                  />
                ) : (
                  <p>{user?.name || 'Not provided'}</p>
                )}
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <p>{user?.email || 'Not provided'}</p>
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                {isEditing ? (
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Your phone number"
                  />
                ) : (
                  <p>{user?.phone || 'Not provided'}</p>
                )}
              </div>
              
              <div className="form-group">
                <label>Address</label>
                {isEditing ? (
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Your delivery address"
                  />
                ) : (
                  <p>{user?.address || 'Not provided'}</p>
                )}
              </div>
              
              {isEditing && (
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              )}
            </form>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="security-info">
            <div className="info-header">
              <h3>Security Settings</h3>
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    name="currentPassword" 
                    value={formData.currentPassword} 
                    onChange={handleChange} 
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    name="newPassword" 
                    value={formData.newPassword} 
                    onChange={handleChange} 
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Confirm new password"
                  />
                </div>
                
                <button type="submit" className="save-button">
                  Update Password
                </button>
              </form>
            ) : (
              <div className="password-info">
                <p>Password: ••••••••</p>
                <p className="last-updated">
                  Last updated: {user?.passwordUpdatedAt ? new Date(user.passwordUpdatedAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;