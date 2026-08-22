export default function Hero({ profile, projectsCount, certsCount: _certsCount, apiLatency }) {
  const name = profile?.name || "Sodhan Krishna Sai";
  const headline = profile?.headline || "FULL-STACK DEVELOPER";
  const description = profile?.description || "I build modern, responsive web applications using React, Node.js, Express, and MongoDB.";
  const techHighlights = profile?.techHighlights || ["React", "Node.js", "Express", "MongoDB", "Python", "Verilog"];

  return (
    <section id="home" className="hero">
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>
      <div className="hero-grid"></div>

      <div className="hero-hud-split">
        {/* Left Side: Profile Dossier */}
        <div className="hero-content left-align">
          <div className="hero-badge">
            <span className="status-dot"></span>
            SYSTEM STATUS — AVAILABLE FOR OPPORTUNITIES
          </div>

          <p className="hero-small">
            {headline.toUpperCase()}
          </p>

          <h1>
            Hi, I'm <br className="hero-br" />
            <span>{name}</span>
          </h1>

          <p className="hero-description">
            {description}
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="primary-button">
              View My Projects <span>↓</span>
            </a>
            <a href="#contact" className="secondary-button">
              Contact Me <span>↗</span>
            </a>
            <a href="/resume.pdf" target="_blank" className="secondary-button cv-btn">
              Download CV <span>⤓</span>
            </a>
          </div>

          <div className="hero-tech">
            {techHighlights.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>

        {/* Right Side: Tactical Telemetry HUD */}
        <div className="hero-telemetry-hud hud-panel compact-hud">
          <div className="hud-panel-header">
            <span>SYSTEM TELEMETRY</span>
            <span className="glow-green">ONLINE</span>
          </div>
          <div className="hud-panel-content telemetry-list-compact">
            <div className="telemetry-row">
              <span className="tel-label">API LATENCY</span>
              <span className="tel-value glow-cyan">
                {apiLatency !== null ? `${apiLatency} MS` : "MEASURING..."}
              </span>
            </div>
            <div className="telemetry-row">
              <span className="tel-label">PROJECTS</span>
              <span className="tel-value glow-cyan">{projectsCount} ACTIVE</span>
            </div>
            <div className="telemetry-row">
              <span className="tel-label">DATABASE</span>
              <span className="tel-value">MONGODB ATLAS</span>
            </div>
            <div className="telemetry-row stack-row">
              <span className="tel-label">STACK</span>
              <span className="tel-value font-mono">
                REACT • NODE • PYTHON • VERILOG
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span className="scroll-arrow">↓</span>
        <span className="scroll-text">SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
}