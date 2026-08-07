import { useState, useRef, useEffect } from 'react'
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
import DebuggingMode from './DebuggingMode'

function Dashboard() {
  const [activeSidebar, setActiveSidebar] = useState('Home')
  const [activeNav, setActiveNav] = useState('Home')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)


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
  
  // ============================================================
  // SHARED "Live Preview" <-> "Debugging Mode" state.
  // Both tabs read/write the same previewUrl + linkStatus so the
  // link you load in one tab is exactly what shows in the other.
  // ============================================================
  const [previewUrl, setPreviewUrl] = useState('')
  const [linkStatus, setLinkStatus] = useState('idle') // idle | checking | ready | notready
  const [debugLogs, setDebugLogs] = useState([])
  const logIdRef = useRef(0)
  const prevNavRef = useRef(activeNav)

  const addLog = (message, type = 'info') => {
    logIdRef.current += 1
    const time = new Date().toLocaleTimeString([], { hour12: false })
    setDebugLogs(prev => [...prev.slice(-49), { id: logIdRef.current, type, message, time }])
  }

  // Pings the host (no-cors, so we only learn "it responded" vs "it didn't")
  // and logs the result like a terminal running a command.
  const checkLinkStatus = async (url) => {
    if (!url) return
    setLinkStatus('checking')
    addLog(`Checking connection to ${url} ...`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: controller.signal })
      setLinkStatus('ready')
      addLog('Connection established — preview is live.', 'success')
    } catch (error) {
      setLinkStatus('notready')
      addLog('Unable to reach host. It may be down, blocking requests, or the URL is invalid.', 'error')
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // Called from Live Preview when a new URL is loaded, or cleared ('').
  const loadPreviewUrl = (url) => {
    if (!url) {
      setPreviewUrl('')
      setLinkStatus('idle')
      setDebugLogs([])
      return
    }
    setPreviewUrl(url)
    addLog(`$ Loading preview -> ${url}`)
    checkLinkStatus(url)
  }

  // Shared refresh: remounts the iframe (in whichever tab is showing it)
  // and re-checks the link, instead of leaving a stale preview sitting there.
  const refreshPreview = () => {
    if (!previewUrl) return
    const current = previewUrl
    addLog('$ Refreshing preview...')
    setPreviewUrl('')
    setTimeout(() => setPreviewUrl(current), 50)
    checkLinkStatus(current)
  }

  // Re-verify the connection whenever the user switches INTO Debugging Mode,
  // so the status/logs shown there are never left over from before.
  // (Intentionally only re-runs on activeNav changes — checkLinkStatus/previewUrl
  // are read fresh via closure each render, not deps we want retriggering this.)
  useEffect(() => {
    if (activeNav === 'Debugging Mode' && prevNavRef.current !== 'Debugging Mode' && previewUrl) {
      addLog('Switched to Debugging Mode — re-verifying connection...')
      checkLinkStatus(previewUrl)
    }
    prevNavRef.current = activeNav
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNav])

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
          {activeNav === 'Live Preview' && (
            <LivePreview
              previewUrl={previewUrl}
              linkStatus={linkStatus}
              onLoadPreview={loadPreviewUrl}
              onRefresh={refreshPreview}
            />
          )}

          {/* ================= DEBUGGING MODE TAB ================= */}
          {activeNav === 'Debugging Mode' && (
            <DebuggingMode
              status={linkStatus}
              logs={debugLogs}
              previewUrl={previewUrl}
              onRefresh={refreshPreview}
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default Dashboard