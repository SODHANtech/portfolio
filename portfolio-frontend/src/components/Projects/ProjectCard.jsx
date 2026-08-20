import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import ProjectInspector from "./ProjectInspector";

export default function ProjectCard({ project, index, isFlagship }) {
  const [showInspector, setShowInspector] = useState(false);

  const cardContent = (
    <article className={`project-card hud-panel ${isFlagship ? "flagship-dossier" : "secondary-dossier"}`}>
      <div className="hud-panel-header">
        <span>{isFlagship ? "FLAGSHIP_OPERATION" : `SEC_LOG_0${index + 1}`}</span>
        <span className={project.featured ? "glow-purple" : "glow-cyan"}>
          {project.featured ? "FEATURED_CORE" : "SYS_MODULE"}
        </span>
      </div>

      <div className="hud-panel-content">
        {project.imageUrl && (
          <div className="project-image-wrapper">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="project-image"
            />
            <div className="project-scanlines"></div>

            {/* Tactical Targeting Scope Overlay */}
            <div className="project-target-box">
              <span className="target-corner tl"></span>
              <span className="target-corner tr"></span>
              <span className="target-corner bl"></span>
              <span className="target-corner br"></span>
            </div>

            <div className="project-crosshair">
              <svg viewBox="0 0 100 100" className="crosshair-svg">
                <circle
                  cx="50"
                  cy="50"
                  r="12"
                  stroke="var(--hud-cyan)"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.35"
                  strokeDasharray="2 2"
                />
                <line x1="50" y1="32" x2="50" y2="42" stroke="var(--hud-cyan)" strokeWidth="0.8" opacity="0.6" />
                <line x1="50" y1="58" x2="50" y2="68" stroke="var(--hud-cyan)" strokeWidth="0.8" opacity="0.6" />
                <line x1="32" y1="50" x2="42" y2="50" stroke="var(--hud-cyan)" strokeWidth="0.8" opacity="0.6" />
                <line x1="58" y1="50" x2="68" y2="50" stroke="var(--hud-cyan)" strokeWidth="0.8" opacity="0.6" />
              </svg>
            </div>

            {/* Tactical Matrix Stats */}
            <div className="project-hud-metrics">
              <div className="metric-line">ADDR_REF: {String(index + 1).padStart(2, "0")}XF</div>
              <div className="metric-line">OPER: SEC_VERIFY</div>
            </div>

            <div className="project-number">
              {project.status || "ACTIVE"}
            </div>
          </div>
        )}

        <div className="project-info-wrap">
          <div className="project-meta-top">
            <span className="project-category-hud">
              [{project.category || "MODULE"}]
            </span>
          </div>

          <h3>{project.title}</h3>

          {project.tagline && (
            <div className="project-tagline-hud">
              {project.tagline}
            </div>
          )}

          <p className="project-desc-hud">{project.description}</p>

          {project.techStack?.length > 0 && (
            <div className="project-tech-hud">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-badge-hud">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="project-actions-hud">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="project-hud-btn primary"
              >
                [ LIVE_DEMO ]
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="project-hud-btn"
              >
                [ CODE_BASE ]
              </a>
            )}

            <button
              type="button"
              className="project-hud-btn"
              onClick={() => setShowInspector(true)}
            >
              [ INSPECT_SYS ]
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.6,
          delay: isFlagship ? 0 : index * 0.1,
        }}
        style={{ height: "100%" }}
      >
        {isFlagship ? (
          // Disable 3D tilt on Flagship to preserve readability of split layout
          cardContent
        ) : (
          <Tilt
            tiltMaxAngleX={4}
            tiltMaxAngleY={4}
            perspective={1000}
            scale={1.01}
            transitionSpeed={1500}
            glareEnable={true}
            glareMaxOpacity={0.05}
            style={{ height: "100%" }}
          >
            {cardContent}
          </Tilt>
        )}
      </motion.div>

      <AnimatePresence>
        {showInspector && (
          <ProjectInspector
            project={project}
            onClose={() => setShowInspector(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
