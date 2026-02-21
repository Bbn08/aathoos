import './App.css'

const features = [
  {
    icon: '—',
    title: 'Dashboard',
    desc: "A bird's-eye view of your day, week, and semester.",
  },
  {
    icon: '—',
    title: 'Task Tracker',
    desc: 'Deadlines, priorities, and progress in one place.',
  },
  {
    icon: '—',
    title: 'Notes',
    desc: 'Structured note-taking linked to subjects and topics.',
  },
  {
    icon: '—',
    title: 'Study Planner',
    desc: 'Build study schedules around your calendar.',
  },
  {
    icon: '—',
    title: 'Goal Tracking',
    desc: 'Set semester goals and stay accountable.',
  },
  {
    icon: '—',
    title: 'Focus Mode',
    desc: "Minimize distractions when it's time to work.",
  },
]

function App() {
  return (
    <div className="page">
      {/* Nav */}
      <nav className="nav">
        <span className="nav-logo">aathoos</span>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#contribute">Contribute</a></li>
          <li>
            <a href="https://github.com/aathoos/aathoos" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <span className="hero-badge">Open Source — Early Stage</span>
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

      {/* Features */}
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

      {/* CTA */}
      <section className="cta" id="contribute">
        <h2>Come build with us.</h2>
        <p>
          aathoos is open source and community-driven. Whether you code,
          design, or just have good ideas — there's a place for you.
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

      {/* Footer */}
      <footer className="footer">
        <p>
          <a href="https://github.com/aathoos/aathoos" target="_blank" rel="noreferrer">
            aathoos
          </a>{' '}
          — MIT License. Built with focus, for the student life.
        </p>
      </footer>
    </div>
  )
}

export default App
