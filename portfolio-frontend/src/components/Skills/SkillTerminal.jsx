export default function SkillTerminal({
  activeCategory,
  groupedSkills,
  getCategoryColor,
}) {
  const skillsList = groupedSkills[activeCategory] || [];
  const color = getCategoryColor(activeCategory);

  return (
    <div className="readout-terminal hud-panel">
      <div className="hud-panel-header">
        <span>TACTICAL_READOUT</span>
        <span>STATUS_OK</span>
      </div>

      <div className="readout-terminal-content">
        {activeCategory ? (
          <>
            <div className="readout-header-domain">
              <span
                className="readout-led"
                style={{
                  background: color,
                  boxShadow: `0 0 10px ${color}`,
                }}
              />
              <span>{activeCategory}</span>
            </div>

            <div className="readout-skills-container">
              {skillsList.map((skill) => (
                <div key={skill._id || skill.name} className="readout-skill-row">
                  <div className="readout-skill-top">
                    <span className="readout-skill-name">{skill.name}</span>
                    {skill.level && (
                      <span
                        className="readout-skill-level"
                        style={{ color: color }}
                      >
                        {skill.level}
                      </span>
                    )}
                  </div>

                  {skill.description && (
                    <p className="readout-skill-desc">{skill.description}</p>
                  )}

                  {skill.projects && skill.projects.length > 0 && (
                    <div className="readout-skill-integrations">
                      {skill.projects.map((project, pIdx) => (
                        <span key={pIdx} className="integration-tag">
                          {project}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "monospace",
              opacity: 0.5,
            }}
          >
            SELECT WEAPON SYSTEM TO INITIALIZE
          </div>
        )}
      </div>
    </div>
  );
}
