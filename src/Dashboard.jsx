import { useState, useRef } from 'react'
import { 
  Home, 
  Folder, 
  BarChart3, 
  Settings, 
  Zap, 
  Bug, 
  MessageSquare
} from 'lucide-react'
import './Dashboard.css'
import UserIcon from './UserIcon'
import LivePreview from './LivePreview'

function Dashboard() {
  const [activeSidebar, setActiveSidebar] = useState('Home')
  const [activeNav, setActiveNav] = useState('Home')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Refs for the two mobile card carousels (Quick Access + Recent Projects).
  // The arrow buttons just nudge scrollLeft; on tablet/desktop these arrows
  // are hidden via CSS and the containers use their normal flex layout.
  const quickAccessRef = useRef(null)
  const projectListRef = useRef(null)

  const scrollCarousel = (ref, direction) => {
    const node = ref.current
    if (!node) return
    const amount = node.clientWidth * 0.85 * direction
    node.scrollBy({ left: amount, behavior: 'smooth' })
  }
  
  // React State para sa To Do items para gumagana at napipindot kay Sir
  const [todos, setTodos] = useState([
    { id: 1, text: 'Check deployment pipeline status', completed: true },
    { id: 2, text: 'Resolve debugging console errors', completed: false },
    { id: 3, text: 'Review client feedback comments', completed: false },
  ])

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  const navItems = ['Home', 'Live Preview', 'Debugging Mode']

  return (
    <div className={`app-layout ${isDarkMode ? '' : 'light-mode'}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Zap size={28} fill="var(--accent-orange)" color="var(--accent-orange)" />
        </div>
        <button className={`sidebar-icon-btn ${activeSidebar === 'Home' ? 'active' : ''}`} onClick={() => setActiveSidebar('Home')}>
          <Home size={20} color={activeSidebar === 'Home' ? 'var(--accent-orange)' : 'currentColor'} />
        </button>
        <button className={`sidebar-icon-btn ${activeSidebar === 'Projects' ? 'active' : ''}`} onClick={() => setActiveSidebar('Projects')}>
          <Folder size={20} color={activeSidebar === 'Projects' ? 'var(--accent-orange)' : 'currentColor'} />
        </button>
        <button className={`sidebar-icon-btn ${activeSidebar === 'Analytics' ? 'active' : ''}`} onClick={() => setActiveSidebar('Analytics')}>
          <BarChart3 size={20} color={activeSidebar === 'Analytics' ? 'var(--accent-orange)' : 'currentColor'} />
        </button>
        <button className={`sidebar-icon-btn ${activeSidebar === 'Settings' ? 'active' : ''}`} onClick={() => setActiveSidebar('Settings')}>
          <Settings size={20} color={activeSidebar === 'Settings' ? 'var(--accent-orange)' : 'currentColor'} />
        </button>
      </aside>

      <div className="main-content">
        {/* TOP NAVBAR */}
        <header className="top-navbar">
          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileNavOpen}
          >
            <i className={`fa-solid ${isMobileNavOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true"></i>
          </button>

          <div className={`nav-links ${isMobileNavOpen ? 'nav-links-open' : ''}`}>
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                className={`nav-link ${activeNav === item ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav(item)
                  setIsMobileNavOpen(false)
                }}
            >
                {item}
            </button>
            ))}
          </div>          
          <div className="navbar-user-icon-slot">
            <UserIcon isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </header>

        {/* CONTAINER AREA */}
        <main className="dashboard-container"> 
          
          {/* ================= HOME TAB ================= */}
          {activeNav === 'Home' && (
            <>
              <section className="welcome-banner">
                <h1>Welcome Back, Developer</h1>
                <p>Your current workspace status is normal. Select an action to get started.</p>
                <span className="active-area-badge">
                  Active Area: <span className="highlight-text">{activeSidebar} &gt; {activeNav}</span>
                </span>
              </section>

              <div className="dashboard-row-two">            
                <div className="card">
                  <h2 className="card-title">Quick Access</h2>
                  <div className="carousel-wrapper">
                    <button
                      type="button"
                      className="carousel-arrow arrow-left"
                      onClick={() => scrollCarousel(quickAccessRef, -1)}
                      aria-label="Scroll quick access left"
                    >
                      <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                    </button>

                    <div className="quick-access-buttons" ref={quickAccessRef}>
                      <button className="qa-btn" onClick={() => setActiveNav('Live Preview')}>
                        <Zap size={22} color="var(--accent-orange)" />
                        <span>Live</span>
                      </button>
                      <button className="qa-btn" onClick={() => setActiveNav('Debugging Mode')}>
                        <Bug size={22} color="var(--accent-orange)" />
                        <span>Debug</span>
                      </button>
                      <button className="qa-btn" onClick={() => alert('Opening Comments Panel...')}>
                        <MessageSquare size={22} color="var(--accent-orange)" />
                        <span>Comment</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="carousel-arrow arrow-right"
                      onClick={() => scrollCarousel(quickAccessRef, 1)}
                      aria-label="Scroll quick access right"
                    >
                      <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h2 className="card-title">Recent Projects</h2>
                  <div className="carousel-wrapper">
                    <button
                      type="button"
                      className="carousel-arrow arrow-left"
                      onClick={() => scrollCarousel(projectListRef, -1)}
                      aria-label="Scroll recent projects left"
                    >
                      <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                    </button>

                    <div className="project-list" ref={projectListRef}>
                      <div className="project-item">
                        <span>Salesforce-UI-Clone</span>
                        <button className="open-btn" onClick={() => alert('Opening Salesforce-UI-Clone...')}>Open</button>
                      </div>
                      <div className="project-item">
                        <span>Backend-Auth-Service</span>
                        <button className="open-btn" onClick={() => alert('Opening Backend-Auth-Service...')}>Open</button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="carousel-arrow arrow-right"
                      onClick={() => scrollCarousel(projectListRef, 1)}
                      aria-label="Scroll recent projects right"
                    >
                      <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="dashboard-row-three">
                <div className="card">
                  <h2 className="card-title">To Do</h2>
                  <div className="todo-list">
                    {todos.map(todo => (
                      <div key={todo.id} className="todo-item" onClick={() => toggleTodo(todo.id)}>
                        <input 
                          type="checkbox" 
                          checked={todo.completed} 
                          onChange={() => {}} 
                        />
                        <label className={todo.completed ? 'completed' : ''}>
                          {todo.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header-split">
                    <h2 className="card-title">Productivity Rate</h2>
                    <span className="card-subtitle">Weekly</span>
                  </div>
                  <div className="chart-container">
                    <div className="chart-bar-wrapper"><div className="chart-bar" style={{ height: '50%' }}></div><span className="chart-label">Mon</span></div>
                    <div className="chart-bar-wrapper"><div className="chart-bar" style={{ height: '75%' }}></div><span className="chart-label">Tue</span></div>
                    <div className="chart-bar-wrapper"><div className="chart-bar" style={{ height: '40%' }}></div><span className="chart-label">Wed</span></div>
                    <div className="chart-bar-wrapper"><div className="chart-bar" style={{ height: '90%' }}></div><span className="chart-label">Thu</span></div>
                    <div className="chart-bar-wrapper"><div className="chart-bar" style={{ height: '65%' }}></div><span className="chart-label">Fri</span></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= LIVE PREVIEW TAB ================= */}
          {activeNav === 'Live Preview' && <LivePreview />}

          {/* ================= DEBUGGING MODE TAB ================= */}
          {activeNav === 'Debugging Mode' && (
            <div className="debug-container">
              <div className="debug-header">
                <div className="status-indicator live">
                  <span className="dot">●</span> Status: Live Testing
                </div>
                <div className="comment-panel">
                  <input type="text" placeholder="Mag-iwan ng komento para sa ka-grupo..." />
                  <button onClick={() => alert('Comment sent!')}>Send</button>
                </div>
              </div>

              <div className="split-panel">
                <div className="left-panel">
                  <div className="panel-header">
                    <h3>Project Preview</h3>
                  </div>
                  {/* Pwede nyo palitan yung src ng link ng local project nyo or external website */}
                  <iframe src="https://example.com" title="Project Preview HTML"></iframe>
                </div>

                <div className="right-panel">
                  <div className="panel-header">
                    <h3>Console Logs</h3>
                  </div>
                  <div className="log-scroll">
                    <div className="log-item info">[INFO] Pipeline built successfully.</div>
                    <div className="log-item warning">[WARN] Deprecated API call detected on line 42.</div>
                    <div className="log-item error">[ERROR] Failed to load resource: 404 Not Found.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default Dashboard