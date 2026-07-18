import React, { useState, useRef, useEffect } from 'react';
import './UserIcon.css';

// Receiving the theme variables as parameters from App.jsx
const UserIcon = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Profile Information States
  const [username, setUsername] = useState('Juan Dela Cruz');
  const [profilePic, setProfilePic] = useState('https://api.dicebear.com/7.x/initials/svg?seed=JDC&backgroundColor=ff7517&textColor=f6f4f4');
  
  // Sub-panel routing: 'menu', 'profile', 'github', 'notifications'
  const [activePanel, setActivePanel] = useState('menu');
  
  // Notification Toggles
  const [notifPreferences, setNotifPreferences] = useState({
    buildSuccess: true,
    buildFailed: true,
    teamComments: false,
  });

  const menuRef = useRef(null);

  // Structural UI event: Closes context popover if user clicks outside container boundary
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setActivePanel('menu');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      {/* Main Avatar Trigger Head */}
      <button className="profile-trigger-btn" onClick={() => setIsOpen(!isOpen)}>
        <img src={profilePic} alt="User Avatar" className="trigger-avatar" />
        <span className="online-indicator"></span>
      </button>

      {/* Floating Action Menu Card */}
      {isOpen && (
        <div className="usermenu-dropdown">
          
          {/* VIEW 1: HOME PANEL SELECTIONS */}
          {activePanel === 'menu' && (
            <div className="panel-fade-in">
              <div className="user-summary-header">
                <img src={profilePic} alt="Avatar" className="header-avatar" />
                <div className="header-info">
                  <h4>{username}</h4>
                  <p>Developer Account</p>
                </div>
              </div>
              
              <hr className="menu-divider" />

              <div className="menu-items-list">
                <button onClick={() => setActivePanel('profile')}>
                  <span className="icon">👤</span> Change Name & Pic
                </button>
                
                {/* Micro Pill Sliding Action Toggle Switch */}
                <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
                  <div className="btn-label-side">
                    <span className="icon">{isDarkMode ? '🌙' : '☀️'}</span> 
                    <span>Theme Mode</span>
                  </div>
                  <div className={`toggle-pill-icon ${isDarkMode ? 'dark-active' : 'light-active'}`}>
                    <span className="toggle-ball"></span>
                  </div>
                </button>

                <button onClick={() => setActivePanel('github')}>
                  <span className="icon">🐙</span> GitHub Integration
                </button>

                <button onClick={() => setActivePanel('notifications')}>
                  <span className="icon">🔔</span> Notifications
                </button>
                
                <button onClick={() => alert('Opening Workspace Logs...')}>
                  <span className="icon">📊</span> Build History Logs
                </button>
                
                <hr className="menu-divider" />

                <button className="logout-btn" onClick={() => alert('Logging out...')}>
                  <span className="icon">🚪</span> Logout
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: PROFILE MODIFICATION UTILITY */}
          {activePanel === 'profile' && (
            <div className="panel-fade-in panel-padding">
              <button className="back-btn" onClick={() => setActivePanel('menu')}>← Back</button>
              <h3>Edit Profile</h3>
              
              <div className="edit-avatar-container">
                <img src={profilePic} alt="Preview" className="edit-avatar-preview" />
                <label className="upload-label">
                  Upload Image
                  <input type="file" accept="image/*" onChange={handlePictureChange} hidden />
                </label>
              </div>

              <div className="input-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter your name"
                />
              </div>
            </div>
          )}

          {/* VIEW 3: PIPELINE GITHUB MANAGEMENT */}
          {activePanel === 'github' && (
            <div className="panel-fade-in panel-padding">
              <button className="back-btn" onClick={() => setActivePanel('menu')}>← Back</button>
              <h3>GitHub Integration</h3>
              <p className="panel-desc">Link environments to automate preview deployment urls.</p>
              
              <div className="github-status-box">
                <span className="github-icon">🐱</span>
                <div>
                  <h5>Status: Connected</h5>
                  <p>Target: streamline-app-repo</p>
                </div>
              </div>

              <button className="action-btn-secondary" onClick={() => alert('Re-syncing repo...')}>
                Re-sync Repositories
              </button>
            </div>
          )}

          {/* VIEW 4: SYSTEM ALERT SELECTIONS */}
          {activePanel === 'notifications' && (
            <div className="panel-fade-in panel-padding">
              <button className="back-btn" onClick={() => setActivePanel('menu')}>← Back</button>
              <h3>Notifications</h3>
              
              <div className="checkbox-list">
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={notifPreferences.buildSuccess} 
                    onChange={(e) => setNotifPreferences({...notifPreferences, buildSuccess: e.target.checked})}
                  />
                  <span>Successful Builds</span>
                </label>

                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={notifPreferences.buildFailed} 
                    onChange={(e) => setNotifPreferences({...notifPreferences, buildFailed: e.target.checked})}
                  />
                  <span>Deployment Failures</span>
                </label>

                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={notifPreferences.teamComments} 
                    onChange={(e) => setNotifPreferences({...notifPreferences, teamComments: e.target.checked})}
                  />
                  <span>Preview Comments</span>
                </label>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default UserIcon;