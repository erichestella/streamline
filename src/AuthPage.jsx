import React, { useState, useEffect } from 'react';
import './AuthPage.css';
// Import your custom illustration graphic
import graphicLogo from './logo.png';

export default function AuthPage({ onSwitchToRegister }) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // Steps: 1 (Choose Method), 2 (Sent Status/Timer), 3 (Create New Password)
  
  // Login Form States
  const [idNumber, setIdNumber] = useState('');
  const [githubUser, setGithubUser] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password Wizard States - Empty initially so no input fields are displayed
  const [recoveryMethod, setRecoveryMethod] = useState(''); // '', 'email', or 'phone'
  const [timer, setTimer] = useState(59);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OPTION B: New Dynamic Inputs for Recovery
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userPhoneInput, setUserPhoneInput] = useState('');

  // Countdown effect for the activation step timer
  useEffect(() => {
    let interval = null;
    if (isForgotPassword && forgotStep === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isForgotPassword, forgotStep, timer]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { idNumber, githubUser, password, rememberMe });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Updating password to:", newPassword);
    alert("Password updated successfully!");
    
    // Reset all states and wizard flow
    setIsForgotPassword(false);
    setForgotStep(1);
    setTimer(59);
    setNewPassword('');
    setConfirmPassword('');
    setUserEmailInput('');
    setUserPhoneInput('');
    setRecoveryMethod('');
  };

  return (
    <div className="auth-container">
      {/* Left Column: Interactive Forms */}
      <div className="auth-form-side">
        <div className="brand">
          {/* Brand Lock Icon - Fixed to #FF7517 */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7517" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="brand-icon">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="brand-name">STREAMLINE</span>
        </div>

        {!isForgotPassword ? (
          /* =========================================================
             LOGIN PAGE SCREEN
             ========================================================= */
          <div className="form-box">
            <h2>Hi,<br />Welcome Back!</h2>

            <form onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <label>ID Number</label>
                <input 
                  type="text" 
                  placeholder="Enter your ID Number" 
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label>GitHub Username</label>
                <input 
                  type="text" 
                  placeholder="e.g., octocat" 
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="form-actions">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => { setIsForgotPassword(true); setForgotStep(1); }}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="primary-btn">Log In</button>
            </form>

            <p className="footer-text">
              Don't have an account?{" "}
              <button
                type="button"
                className="link-btn link-text"
                onClick={onSwitchToRegister}
              >
                Register
              </button>
            </p>
          </div>
        ) : (
          /* =========================================================
             FORGOT PASSWORD PAGE (WIZARD FLOW)
             ========================================================= */
          <div className="form-box">
            {/* Contextual Back Navigation */}
            <button 
              className="back-arrow" 
              onClick={() => {
                if (forgotStep > 1) setForgotStep(forgotStep - 1);
                else setIsForgotPassword(false);
              }}
            >
              ← Back
            </button>

            {forgotStep === 1 && (
              /* STEP 1: Select Method & Dynamic Inputs inside Card Container */
              <div>
                <h2>Forgot Password</h2>
                <p className="subtitle">Select which contact details we should use to reset your password</p>
                
                {/* EMAIL CARD CONTAINER */}
                <div style={{ marginBottom: '16px' }}>
                  <div 
                    className={`selection-card ${recoveryMethod === 'email' ? 'active' : ''}`}
                    onClick={() => setRecoveryMethod('email')}
                    style={{ margin: 0 }}
                  >
                    <div className="card-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </div>
                    <div className="card-info">
                      <span>By Email</span>
                      <p>{userEmailInput ? userEmailInput : "Enter your registered email"}</p>
                    </div>
                  </div>

                  {/* DYNAMIC EMAIL INPUT - Lalabas sa ilalim ng email card pagka-click */}
                  {recoveryMethod === 'email' && (
                    <div className="input-group" style={{ marginTop: '12px', marginBottom: '8px' }}>
                      <input 
                        type="email" 
                        placeholder="e.g., yourname@domain.com" 
                        value={userEmailInput}
                        onChange={(e) => setUserEmailInput(e.target.value)}
                        required 
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* PHONE CARD CONTAINER */}
                <div style={{ marginBottom: '24px' }}>
                  <div 
                    className={`selection-card ${recoveryMethod === 'phone' ? 'active' : ''}`}
                    onClick={() => setRecoveryMethod('phone')}
                    style={{ margin: 0 }}
                  >
                    <div className="card-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                        <path d="M12 18h.01"/>
                      </svg>
                    </div>
                    <div className="card-info">
                      <span>By Phone Number</span>
                      <p>{userPhoneInput ? userPhoneInput : "Enter your registered mobile number"}</p>
                    </div>
                  </div>

                  {/* DYNAMIC PHONE INPUT - Lalabas sa ilalim ng phone card pagka-click */}
                  {recoveryMethod === 'phone' && (
                    <div className="input-group" style={{ marginTop: '12px', marginBottom: '8px' }}>
                      <input 
                        type="tel" 
                        placeholder="e.g., +639123456789" 
                        value={userPhoneInput}
                        onChange={(e) => setUserPhoneInput(e.target.value)}
                        required 
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                <button 
                  className="primary-btn" 
                  onClick={() => {
                    if (!recoveryMethod) {
                      alert("Please select a recovery method first.");
                      return;
                    }
                    if (recoveryMethod === 'email' && !userEmailInput) {
                      alert("Please enter your email address.");
                      return;
                    }
                    if (recoveryMethod === 'phone' && !userPhoneInput) {
                      alert("Please enter your mobile number.");
                      return;
                    }
                    
                    console.log(`Sending recovery payload to: ${recoveryMethod === 'email' ? userEmailInput : userPhoneInput}`);
                    setForgotStep(2);
                  }}
                >
                  Continue
                </button>
              </div>
            )}

            {forgotStep === 2 && (
              /* STEP 2: Structural Link Sent Notification Screen */
              <div className="text-center">
                <div className="status-image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                    <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <h2>We have sent you an activation link.</h2>
                <p className="subtitle">
                  An active verification package has been dispatched to{' '}
                  <strong style={{ color: 'var(--text-main)' }}>
                    {recoveryMethod === 'email' ? userEmailInput : userPhoneInput}
                  </strong>{' '}
                  containing custom recovery steps.
                </p>
                <p className="timer-text">
                  Your link will expire soon: <span className="timer-countdown">00:{timer < 10 ? `0${timer}` : timer}</span>
                </p>
                
                <button className="primary-btn" onClick={() => setForgotStep(3)}>Open Link (Simulate Redirect)</button>
              </div>
            )}

            {forgotStep === 3 && (
              /* STEP 3: Create Brand New Secure Password Credentials */
              <div>
                <h2>Create a New Password</h2>
                <p className="subtitle">Please enter your new structural credentials below</p>
                
                <form onSubmit={handleResetSubmit}>
                  <div className="input-group">
                    <label>New Password <span className="required">*</span></label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="input-group">
                    <label>Confirm New Password <span className="required">*</span></label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-actions">
                    <label className="checkbox-container">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                  </div>

                  <button type="submit" className="primary-btn">Save Password</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Original Stable Layout Setup for Rocket Image */}
      <div className="auth-graphic-side">
        <div className="graphic-content">
          <img 
            src={graphicLogo} 
            alt="Streamline Graphic Illustration" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      </div>
    </div>
  );
}