import React, { useState, useRef, useEffect } from 'react';
import './UserIcon.css';

// Receiving the theme variables as parameters from Dashboard.jsx
const UserIcon = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Committed profile info (what actually shows in the header/avatar)
  const [username, setUsername] = useState('Juan Dela   Cruz');
  const [profilePic, setProfilePic] = useState('https://api.dicebear.com/7.x/initials/svg?seed=JDC&backgroundColor=ff7517&textColor=f6f4f4');

  // Draft copies used only while the "Change Name & Pic" form is open.
  // Nothing here touches the committed state above until Save is pressed,
  // so picking a photo (or typing a name) and then closing/backing out
  // leaves the real profile untouched.
  const [draftUsername, setDraftUsername] = useState(username);
  const [draftProfilePic, setDraftProfilePic] = useState(profilePic);
  const objectUrlRef = useRef(null);

  // Sub-panel routing inside the dropdown: 'menu' | 'profile'
  const [activePanel, setActivePanel] = useState('menu');

  // Full-screen modals (styled after FooterLinks' modal pattern) for
  // anything that isn't a quick in-dropdown action.
  const [activeModal, setActiveModal] = useState(null); // null | 'github' | 'notifications' | 'logs' | 'logout'

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

  // Revoke any object URL we created for a picture preview once it's no
  // longer needed, so we don't leak memory across repeated selections.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const openProfileEditor = () => {
    setDraftUsername(username);
    setDraftProfilePic(profilePic);
    setActivePanel('profile');
  };

  const cancelProfileEditor = () => {
    // Discard the draft entirely; committed username/profilePic never changed.
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setActivePanel('menu');
  };

  const saveProfileEditor = () => {
    setUsername(draftUsername.trim() || username);
    setProfilePic(draftProfilePic);
    objectUrlRef.current = null; // now "owned" by committed state, don't revoke it
    setActivePanel('menu');
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const imageUrl = URL.createObjectURL(file);
      objectUrlRef.current = imageUrl;
      setDraftProfilePic(imageUrl); // preview only, not saved yet
    }
  };

  const openModal = (modalName) => {
    setIsOpen(false);
    setActivePanel('menu');
    setActiveModal(modalName);
  };

  const handleLogout = () => {
    // Clear common client-side authentication data before returning to login.
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.clear();

    window.location.href = '/login';
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      {/* Main Avatar Trigger Head */}
      <button className="profile-trigger-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Open account menu">
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
                <button onClick={openProfileEditor}>
                  <i className="fa-solid fa-user icon" aria-hidden="true"></i> Change Name &amp; Pic
                </button>

                {/* Micro Pill Sliding Action Toggle Switch */}
                <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
                  <div className="btn-label-side">
                    <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'} icon`} aria-hidden="true"></i>
                    <span>Theme Mode</span>
                  </div>
                  <div className={`toggle-pill-icon ${isDarkMode ? 'dark-active' : 'light-active'}`}>
                    <span className="toggle-ball"></span>
                  </div>
                </button>

                <button onClick={() => openModal('github')}>
                  <i className="fa-brands fa-github icon" aria-hidden="true"></i> GitHub Integration
                </button>

                <button onClick={() => openModal('notifications')}>
                  <i className="fa-solid fa-bell icon" aria-hidden="true"></i> Notifications
                </button>

                <button onClick={() => openModal('logs')}>
                  <i className="fa-solid fa-clipboard-list icon" aria-hidden="true"></i> Build History Logs
                </button>

                <hr className="menu-divider" />

                <button className="logout-btn" onClick={() => openModal('logout')}>
                  <i className="fa-solid fa-right-from-bracket icon" aria-hidden="true"></i> Logout
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: PROFILE MODIFICATION UTILITY (draft state + explicit Save) */}
          {activePanel === 'profile' && (
            <div className="panel-fade-in panel-padding">
              <button className="back-btn" onClick={cancelProfileEditor}>
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Back
              </button>
              <h3>Edit Profile</h3>

              <div className="edit-avatar-container">
                <img src={draftProfilePic} alt="Preview" className="edit-avatar-preview" />
                <label className="upload-label">
                  Upload Image
                  <input type="file" accept="image/*" onChange={handlePictureChange} hidden />
                </label>
              </div>

              <div className="input-group">
                <label htmlFor="display-name-input">Display Name</label>
                <input
                  id="display-name-input"
                  type="text"
                  value={draftUsername}
                  onChange={(e) => setDraftUsername(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <p className="panel-desc unsaved-note">
                Changes here are just a preview until you save them.
              </p>

              <div className="profile-editor-actions">
                <button className="action-btn-secondary" onClick={cancelProfileEditor}>
                  Cancel
                </button>
                <button className="action-btn-primary" onClick={saveProfileEditor}>
                  <i className="fa-solid fa-check" aria-hidden="true"></i> Save Changes
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============ FULL-SCREEN MODALS (same pattern as FooterLinks) ============ */}

      {activeModal === 'github' && (
        <div className="usericon-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="usericon-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="usericon-modal-title">GitHub Integration</h3>
            <div className="usericon-modal-body">
              <p className="panel-desc">Link environments to automate preview deployment urls.</p>
              <div className="github-status-box">
                <i className="fa-brands fa-github github-icon" aria-hidden="true"></i>
                <div>
                  <h5>Status: Connected</h5>
                  <p>Target: streamline-app-repo</p>
                </div>
              </div>
              <button className="action-btn-secondary" onClick={() => setActiveModal(null)}>
                Re-sync Repositories
              </button>
            </div>
            <button type="button" className="usericon-modal-close-btn" onClick={() => setActiveModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'notifications' && (
        <div className="usericon-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="usericon-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="usericon-modal-title">Notifications</h3>
            <div className="usericon-modal-body">
              <div className="checkbox-list">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={notifPreferences.buildSuccess}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, buildSuccess: e.target.checked })}
                  />
                  <span>Successful Builds</span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={notifPreferences.buildFailed}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, buildFailed: e.target.checked })}
                  />
                  <span>Deployment Failures</span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={notifPreferences.teamComments}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, teamComments: e.target.checked })}
                  />
                  <span>Preview Comments</span>
                </label>
              </div>
            </div>
            <button type="button" className="usericon-modal-close-btn" onClick={() => setActiveModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'logs' && (
        <div className="usericon-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="usericon-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="usericon-modal-title">Build History Logs</h3>
            <div className="usericon-modal-body">
              {/* Reuses Dashboard.css's .log-item classes (already global in
                  this app) instead of duplicating the same styles here. */}
              <div className="log-item info">[INFO] Pipeline built successfully. 2 min ago</div>
              <div className="log-item warning">[WARN] Deprecated API call detected on line 42. 18 min ago</div>
              <div className="log-item error">[ERROR] Failed to load resource: 404 Not Found. 1 hr ago</div>
              <div className="log-item info">[INFO] Preview deployed to streamline-app-repo. 3 hr ago</div>
            </div>
            <button type="button" className="usericon-modal-close-btn" onClick={() => setActiveModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'logout' && (
        <div className="usericon-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="usericon-modal-box usericon-modal-box-small" onClick={(e) => e.stopPropagation()}>
            <h3 className="usericon-modal-title">Log Out</h3>
            <div className="usericon-modal-body">
              <p className="panel-desc">Are you sure you want to log out of Streamline?</p>
            </div>
            <div className="usericon-modal-actions">
              <button type="button" className="action-btn-secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </button>
              <button type="button" className="action-btn-primary" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIcon;