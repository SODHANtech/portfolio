import { useEffect, useState } from "react";
import api from "../../services/api";
import ProjectCard from "./ProjectCard";
import "./projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/projects")
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load projects.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Separate flagship from secondary operations
  const flagship = projects.find((p) => p.featured) || projects[0];
  const secondaries = projects.filter((p) => p !== flagship);

  return (
    <section id="projects" className="projects-section">
      <div className="section-container">
        <div className="projects-heading">
          <p className="section-small">ACTIVE OPERATIONS</p>

          <h2>Tactical Mission Dossiers</h2>

          <p className="section-description">
            Inspect detailed telemetry readouts, system architectures, and secure
            logs of modules I have deployed.
          </p>
        </div>

        {loading && (
          <div className="projects-message">
            <div className="loading-spinner"></div>
            <p>Loading projects...</p>
          </div>
        )}

        {error && (
          <p className="projects-message error-message">
            {error}
          </p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="projects-message">
            No projects found.
          </p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="projects-dossier-layout">
            {/* Flagship Operation Dossier */}
            {flagship && (
              <div className="flagship-wrapper">
                <ProjectCard
                  project={flagship}
                  index={projects.indexOf(flagship)}
                  isFlagship={true}
                />
              </div>
            )}

            {/* Secondary operations separator line */}
            {secondaries.length > 0 && (
              <div className="secondaries-header-hud">
                <span>ACTIVE_OPERATIONS_INDEX</span>
                <span className="hud-line-glow"></span>
              </div>
            )}

            {/* Secondaries Bento Grid */}
            {secondaries.length > 0 && (
              <div className="secondaries-grid">
                {secondaries.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={projects.indexOf(project)}
                    isFlagship={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
