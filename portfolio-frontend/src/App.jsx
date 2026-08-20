import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Journey from "./components/Journey/Journey";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import Certifications from "./components/Certifications/Certifications";
import RobotAvatar from "./components/RobotAvatar";
import api from "./services/api";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bootState, setBootState] = useState(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "ready";
    }
    return "idle";
  });

  const startBootSequence = () => {
    setBootState("booting");
    setTimeout(() => {
      setBootState("ready");
    }, 2100);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setBootState("ready");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch profile configuration:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const name = profile?.name || "Sodhan Krishna Sai";
  const email = profile?.email || "";
  const statCards = profile?.statCards || [];

  return (
    <>
      {/* Background Cyber HUD Layer */}
      <div className="hud-grid-overlay" />
      <div className="hud-scanline" />

      {bootState !== "ready" ? (
        <div className="boot-container">
          <div className="boot-content">
            {bootState === "idle" ? (
              <button
                className="reactor-button"
                onClick={startBootSequence}
                aria-label="Initialize Starship Command Systems"
              >
                <div className="reactor-glow" />
                <div className="reactor-core" />
                <span className="reactor-label">SYS_INIT</span>
              </button>
            ) : (
              <div className="boot-terminal">
                <p className="terminal-line">&gt; INITIALIZING TRANSPORTS... OK</p>
                <p className="terminal-line">&gt; BINDING REST API CLIENT... OK</p>
                <p className="terminal-line">&gt; SEEDING TELEMETRY PROFILE... OK</p>
                <p className="terminal-line">&gt; COMPILING COMMAND HUD ENGINE... OK</p>
                <div className="terminal-progress-bar">
                  <div className="progress-fill" />
                </div>
              </div>
            )}

            <button
              className="skip-boot-button"
              onClick={() => setBootState("ready")}
              aria-label="Skip Systems Boot"
            >
              SKIP SYSTEM BOOT [ESC]
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%" }}
        >
          <Navbar name={name} />

      <main>
        <Hero profile={profile} loading={loading} />
        <Journey />
        <Projects />
        <Skills />
        <Certifications />

        {/* ABOUT */}
        <section id="about" className="about-section">
          <div className="section-container">
            <div className="about-heading">
              <p className="section-small">ABOUT ME</p>

              <h2>
                {profile?.aboutHeading ? (
                  <>
                    {profile.aboutHeading.split("useful")[0]}
                    <span>useful, modern, and real.</span>
                  </>
                ) : (
                  <>
                    Building things that are
                    <span> useful, modern, and real.</span>
                  </>
                )}
              </h2>

              {profile?.aboutDescription && (
                <p className="section-description">{profile.aboutDescription}</p>
              )}
            </div>

            <div className="about-grid-3d">
              {/* Left Column: Who I Am */}
              <div className="about-main-card hud-panel">
                <div className="hud-panel-header">
                  <span>SYSTEM_READOUT</span>
                  <div className="hud-panel-status">
                    <span className="hud-status-led active" />
                    <span>ONLINE</span>
                  </div>
                </div>
                <div className="hud-panel-content">
                  <span className="about-card-label">WHO I AM</span>

                  {profile?.whoIAmTitle && (
                    <h3>
                      {profile.whoIAmTitle.split(". ").map((str, idx) => (
                        <span key={idx}>
                          {str}
                          {idx < profile.whoIAmTitle.split(". ").length - 1 && "."}
                          <br />
                        </span>
                      ))}
                    </h3>
                  )}

                  {profile?.whoIAmText1 && <p>{profile.whoIAmText1}</p>}
                  {profile?.whoIAmText2 && <p>{profile.whoIAmText2}</p>}
                </div>
              </div>

              {/* Center Column: 3D Robot Assistant */}
              <div className="about-avatar-center hud-panel">
                <div className="hud-panel-header">
                  <span>TELEMETRY_CORE</span>
                  <span>AVATAR_01</span>
                </div>
                <div className="avatar-canvas-container">
                  <RobotAvatar />
                </div>
              </div>

              {/* Right Column: Telemetry Stats */}
              {statCards.length > 0 && (
                <div className="about-stats-side">
                  {statCards.map((card, idx) => (
                    <div key={card._id || idx} className="about-stat-card hud-panel">
                      <div className="hud-panel-header">
                        <span>METRIC_0{card.number || idx + 1}</span>
                        <span className="glow-cyan">ACTIVE</span>
                      </div>
                      <div className="hud-panel-content">
                        <span>{card.number}</span>
                        <strong>{card.title}</strong>
                        <p>{card.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact-section">
          <div className="section-container">
            <p className="section-small">GET IN TOUCH</p>

            <h2>Let's build something.</h2>

            <p className="section-description">
              Interested in working together or just want to connect? Feel free
              to reach out.
            </p>

            {email && (
              <a href={`mailto:${email}`} className="primary-button">
                Send Me an Email
              </a>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </footer>
        </motion.div>
      )}
    </>
  );
}