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
