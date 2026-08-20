export default function Hero({ profile }) {
  const name = profile?.name || "Sodhan Krishna Sai";
  const headline = profile?.headline || "FULL-STACK DEVELOPER";
  const description = profile?.description || "I build modern, responsive web applications using React, Node.js, Express, and MongoDB.";
  const techHighlights = profile?.techHighlights || ["React", "Node.js", "Express", "MongoDB"];

  return (
    <section id="home" className="hero">
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="hero-grid"></div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="status-dot"></span>
          AVAILABLE FOR OPPORTUNITIES
        </div>

        <p className="hero-small">
          {headline.toUpperCase()}
        </p>

        <h1>
          Hi, I'm{" "}
          <span>{name}</span>
        </h1>

        <p className="hero-description">
          {description}
        </p>

        <div className="hero-buttons">
          <a
            href="#projects"
            className="primary-button"
          >
            View My Projects
            <span>↓</span>
          </a>

          <a
            href="#contact"
            className="secondary-button"
          >
            Contact Me
            <span>↗</span>
          </a>
        </div>

        <div className="hero-tech">
          {techHighlights.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>

      <div className="hero-scroll">
        <span></span>
        Scroll to explore
      </div>
    </section>
  );
}