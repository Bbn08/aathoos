import { useEffect, useMemo, useState } from 'react'
import './App.css'

const features = [
  {
    icon: '*',
    title: 'Dashboard',
    desc: "A bird's-eye view of your day, week, and semester.",
  },
  {
    icon: '*',
    title: 'Task Tracker',
    desc: 'Deadlines, priorities, and progress in one place.',
  },
  {
    icon: '*',
    title: 'Notes',
    desc: 'Structured note-taking linked to subjects and topics.',
  },
  {
    icon: '*',
    title: 'Study Planner',
    desc: 'Build study schedules around your calendar.',
  },
  {
    icon: '*',
    title: 'Goal Tracking',
    desc: 'Set semester goals and stay accountable.',
  },
  {
    icon: '*',
    title: 'Focus Mode',
    desc: "Minimize distractions when it's time to work.",
  },
]

const STORAGE_KEY = 'aathoos-theme-preference'

function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialThemePreference() {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const storedPreference = window.localStorage.getItem(STORAGE_KEY)
  if (storedPreference === 'dark' || storedPreference === 'light' || storedPreference === 'system') {
    return storedPreference
  }

  return 'system'
}

function App() {
  const [themePreference, setThemePreference] = useState(getInitialThemePreference)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)

  const resolvedTheme = useMemo(() => {
    if (themePreference === 'system') {
      return systemTheme
    }

    return themePreference
  }, [themePreference, systemTheme])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onThemeChange = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', onThemeChange)
    return () => mediaQuery.removeEventListener('change', onThemeChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, themePreference)
  }, [themePreference])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const toggleTheme = () => {
    setThemePreference((currentPreference) => {
      const currentTheme = currentPreference === 'system' ? systemTheme : currentPreference
      return currentTheme === 'dark' ? 'light' : 'dark'
    })
  }

  return (
    <div className="page">
      <nav className="nav">
        <span className="nav-logo">aathoos</span>
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#contribute">Contribute</a></li>
            <li>
              <a href="https://github.com/aathoos/aathoos" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
          <div className="theme-controls">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
              aria-pressed={resolvedTheme === 'dark'}
            >
              <span className="theme-toggle-label">
                {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
            {themePreference !== 'system' && (
              <button
                type="button"
                className="theme-reset"
                onClick={() => setThemePreference('system')}
              >
                Use system
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <span className="hero-badge">Open Source - Early Stage</span>
        <h1>Your student OS.</h1>
        <p>
          One place to manage academics, tasks, goals, notes, and life.
          No more juggling five different apps.
        </p>
        <div className="hero-actions">
          <a
            className="btn-primary"
            href="https://github.com/aathoos/aathoos"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
          <a className="btn-secondary" href="#features">
            See features
          </a>
        </div>
      </section>

      <section className="features" id="features">
        <div className="features-inner">
          <p className="section-label">Planned Features</p>
          <h2>Built for how students actually work.</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta" id="contribute">
        <h2>Come build with us.</h2>
        <p>
          aathoos is open source and community-driven. Whether you code,
          design, or just have good ideas - there's a place for you.
        </p>
        <a
          className="btn-primary"
          href="https://github.com/aathoos/aathoos"
          target="_blank"
          rel="noreferrer"
        >
          Start contributing
        </a>
      </section>

      <footer className="footer">
        <p>
          <a href="https://github.com/aathoos/aathoos" target="_blank" rel="noreferrer">
            aathoos
          </a>{' '}
          - MIT License. Built with focus, for the student life.
        </p>
      </footer>
    </div>
  )
}

export default App
