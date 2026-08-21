import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink, Database, Server, Monitor } from "lucide-react";

function ProjectInspector({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="inspector-backdrop" onClick={onClose}>
      <motion.div
        className="project-inspector"
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 30 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          type="button"
          className="inspector-close"
          onClick={onClose}
          aria-label="Close project inspector"
        >
          <X size={22} />
        </button>

        {/* PROJECT IMAGE */}
        {project.imageUrl && (
          <div className="inspector-image-wrapper">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="inspector-image"
            />
          </div>
        )}

        {/* HEADER */}
        <div className="inspector-header">
          <div>
            <span className="inspector-label">
              PROJECT INSPECTOR
            </span>

            <h2>{project.title}</h2>

            {project.tagline && (
              <h3 className="inspector-tagline">
                {project.tagline}
              </h3>
            )}

            <p>{project.description}</p>
          </div>

          <div className="project-status">
            <span className="status-dot"></span>
            {project.status || "ONLINE"}
          </div>
        </div>

        <div className="inspector-divider" />

        {/* PROJECT PROFILE */}
        <section className="inspector-section">
          <span className="inspector-label">
            PROJECT PROFILE
          </span>

          <div className="inspector-meta-grid">
            <div className="meta-card">
              <span>CATEGORY</span>
              <strong>
                {project.category || "FULL STACK"}
              </strong>
            </div>

            <div className="meta-card">
              <span>STATUS</span>
              <strong>
                {project.status || "ONLINE"}
              </strong>
            </div>

            <div className="meta-card">
              <span>TYPE</span>
              <strong>
                {project.featured
                  ? "FEATURED"
                  : "PROJECT"}
              </strong>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section className="inspector-section">
          <span className="inspector-label">
            ARCHITECTURE
          </span>

          <div className="architecture">
            <div className="architecture-node">
              <Monitor size={20} />
              <span>React Frontend</span>
            </div>

            <div className="architecture-arrow">
              ↓
            </div>

            <div className="architecture-node">
              <Server size={20} />
              <span>Express API</span>
            </div>

            <div className="architecture-arrow">
              ↓
            </div>

            <div className="architecture-node">
              <Database size={20} />
              <span>MongoDB Atlas</span>
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section className="inspector-section">
          <span className="inspector-label">
            TECH STACK
          </span>

          <div className="inspector-tech">
            {project.techStack?.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </section>

        {/* PROJECT DATA */}
        <section className="inspector-section">
          <span className="inspector-label">
            PROJECT DATA
          </span>

          <div className="data-row">
            <span>API Endpoint</span>
            <code>GET /api/projects</code>
          </div>

          <div className="data-row">
            <span>Database</span>
            <code>MongoDB Atlas</code>
          </div>

          <div className="data-row">
            <span>Collection</span>
            <code>projects</code>
          </div>

          <div className="data-row">
            <span>Project ID</span>
            <code>{project._id}</code>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="inspector-actions">
          {project.liveUrl && project.liveUrl.trim() !== "" && (
            <a
              href={project.liveUrl.trim()}
              target="_blank"
              rel="noreferrer"
              className="inspector-button"
            >
              <ExternalLink size={17} />
              Live Demo
            </a>
          )}

          {project.githubUrl && project.githubUrl.trim() !== "" && (
            <a
              href={project.githubUrl.trim()}
              target="_blank"
              rel="noreferrer"
              className="inspector-button"
            >
              GitHub
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ProjectInspector;
