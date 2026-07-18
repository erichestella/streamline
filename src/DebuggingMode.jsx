import React from 'react';
import './DebuggingMode.css';

const DebuggingMode = ({ status, logs = [], previewUrl }) => {
  return (
    <div className="debug-container">
      <header className="debug-header">
        <div className={`status-indicator ${status}`}>
          ● {status === 'live' ? 'Live' : 'Build Failed'}
        </div>
        
        {status === 'live' && (
          <div className="comment-panel">
            <input type="text" placeholder="Add annotation to this build..." />
            <button type="button">Share Feedback</button>
          </div>
        )}
      </header>

      <div className="split-panel">
        <section className="left-panel">
          {/* ONLY render the iframe if the URL actually exists */}
          {previewUrl ? (
            <iframe 
              src={previewUrl}
              title="Live Preview"
            />
          ) : (
            <div className="iframe-placeholder">
              <p>
                {status === 'building' ? 'Building preview...' : 'No preview available'}
              </p>
            </div>
          )}
        </section>
        
        <section className="right-panel">
          <div className="panel-header">
            <h3>Real-time Anomaly Logs</h3>
          </div>
          <div className="log-scroll">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className={`log-item ${log.type || 'info'}`}>
                  <p>{log.message}</p>
                </div>
              ))
            ) : (
              <p className="no-logs">No logs to display.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DebuggingMode;