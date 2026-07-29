import React, { useRef, useEffect } from 'react';
import './DebuggingMode.css';

const STATUS_CONFIG = {
  idle: { label: 'No Preview Loaded', className: 'idle' },
  checking: { label: 'Checking Connection...', className: 'checking' },
  ready: { label: 'Live', className: 'live' },
  notready: { label: 'Build Failed', className: 'failed' },
};

// `status` / `logs` / `previewUrl` all come from Dashboard, shared with
// Live Preview — whatever link is loaded/refreshed there shows up here too.
const DebuggingMode = ({ status = 'idle', logs = [], previewUrl, onRefresh }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  const logEndRef = useRef(null);

  // Auto-scroll to the newest line, like a real terminal.
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [logs]);

  return (
    <div className="debug-container">
      <header className="debug-header">
        <div className={`status-indicator ${config.className}`}>
          <span className="dot">●</span> Status: {config.label}
        </div>

        <div className="comment-panel">
          <input type="text" placeholder="Add annotation to this build..." />
          <button type="button" onClick={onRefresh} disabled={!previewUrl}>
            Re-check
          </button>
        </div>
      </header>

      <div className="split-panel">
        <section className="left-panel">
          <h3>Project Preview</h3>
          {previewUrl ? (
            // key={previewUrl} forces a remount whenever the URL (or a
            // refresh cycle) changes, instead of leaving a stale iframe.
            <iframe key={previewUrl} src={previewUrl} title="Live Preview" />
          ) : (
            <div className="iframe-placeholder">
              <p>No preview loaded — load a URL from Live Preview first.</p>
            </div>
          )}
        </section>

        <section className="right-panel">
          <h3>Console Logs</h3>
          <div className="log-scroll">
            {logs.length > 0 ? (
              <>
                {logs.map((log) => (
                  <div key={log.id} className={`log-item ${log.type || 'info'}`}>
                    <span className="log-time">[{log.time}]</span> {log.message}
                  </div>
                ))}
                {status === 'checking' && (
                  <div className="terminal-cursor-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-cursor" />
                  </div>
                )}
                <div ref={logEndRef} />
              </>
            ) : (
              <p className="no-logs">No logs yet. Load a preview link to get started.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DebuggingMode;