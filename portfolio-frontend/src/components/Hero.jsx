export default function Hero({ profile, projectsCount, certsCount, apiLatency }) {
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
            SYS_STATUS: ACTIVE_FOR_OPPORTUNITIES
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
        <div className="hero-telemetry-hud hud-panel">
          <div className="hud-panel-header">
            <span>SYSTEM_TELEMETRY_LOG</span>
            <span className="glow-cyan">REAL_TIME</span>
          </div>
          <div className="hud-panel-content telemetry-grid">
            <div className="telemetry-item">
              <span className="tel-label">SECURE_LINK</span>
              <span className="tel-value glow-green">ONLINE</span>
            </div>
            <div className="telemetry-item">
              <span className="tel-label">MEASURED_LATENCY</span>
              <span className="tel-value glow-cyan">
                {apiLatency !== null ? `${apiLatency} MS` : "MEASURING..."}
              </span>
            </div>
            <div className="telemetry-item">
              <span className="tel-label">DATABASE_NODE</span>
              <span className="tel-value">MONGO_ATLAS</span>
            </div>
            <div className="telemetry-item">
              <span className="tel-label">DEPLOYED_MODULES</span>
              <span className="tel-value glow-cyan">{projectsCount} ACTIVE</span>
            </div>
            <div className="telemetry-item">
              <span className="tel-label">VAULT_CREDENTIALS</span>
              <span className="tel-value">{certsCount} VAULTED</span>
            </div>
            <div className="telemetry-item">
              <span className="tel-label">SYS_INDEX_STATUS</span>
              <span className="tel-value glow-green">SECURE</span>
            </div>
            <div className="telemetry-item full-width">
              <span className="tel-label">SYSTEM_STACK_CORE</span>
              <span className="tel-value font-mono" style={{ fontSize: "0.82rem" }}>
                React | Node.js | Python | Verilog
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span></span>
        Scroll to explore
      </div>
    </section>
  );
}