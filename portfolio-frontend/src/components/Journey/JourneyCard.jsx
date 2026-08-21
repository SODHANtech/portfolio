export default function JourneyCard({ item }) {
  return (
    <div className="journey-card hud-panel">
      <div className="hud-panel-header">
        <span className="journey-label">
          {item.label || "PHASE"}
        </span>
        <span className="journey-year">{item.year}</span>
      </div>

      <div className="hud-panel-content">
        <h3>{item.title}</h3>

        <div className="journey-meta-overlay">
          {item.institution && (
            <div className="journey-institution">
              <span className="technical-label">SYS_REF:</span>{" "}
              {item.institution}
            </div>
          )}

          {item.branch && (
            <div className="journey-branch">
              <span className="technical-label">SECTOR:</span>{" "}
              {item.branch}
            </div>
          )}

          {item.status && (
            <div
              className={`journey-status status-${(
                item.status || ""
              ).toLowerCase()}`}
            >
              <span className="status-indicator-dot"></span>
              {item.status}
            </div>
          )}
        </div>

        <p className="journey-description">{item.description}</p>

        <div className="journey-expanded-details">
          {item.objective && (
            <div className="journey-detail-item">
              <span className="technical-label">OBJECTIVE:</span>
              <p className="journey-detail-text">{item.objective}</p>
            </div>
          )}

          {item.whatIBuiltLearned && (
            <div className="journey-detail-item">
              <span className="technical-label">WHAT_I_BUILT_LEARNED:</span>
              <p className="journey-detail-text">{item.whatIBuiltLearned}</p>
            </div>
          )}

          {item.technologies && item.technologies.length > 0 && (
            <div className="journey-detail-item">
              <span className="technical-label">TECHNOLOGIES_LOGGED:</span>
              <div className="journey-badge-wrap">
                {item.technologies.map((tech) => (
                  <span key={tech} className="tech-badge-hud">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.projects && item.projects.length > 0 && (
            <div className="journey-detail-item">
              <span className="technical-label">RELATED_PROJECTS_INDEX:</span>
              <div className="journey-badge-wrap">
                {item.projects.map((proj) => (
                  <span key={proj} className="project-badge-hud">
                    {proj}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {item.milestones && item.milestones.length > 0 && (
          <div className="journey-milestones">
            <span className="technical-label">LOGS_DECRYPTED:</span>
            <ul>
              {item.milestones.map((milestone, idx) => (
                <li key={idx}>{milestone}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
