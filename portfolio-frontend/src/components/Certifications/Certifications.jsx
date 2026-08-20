import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import "./certifications.css";

const ShieldCheckIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="vault-badge-svg"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/certifications")
      .then((res) => {
        setCerts(res.data);
      })
      .catch((err) => {
        console.error("Failed to load certifications data:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="certifications" className="certifications-section">
      <div className="section-container">
        <div className="certs-heading">
          <p className="section-small">DECRYPTED TRANSMISSIONS</p>
          <h2>Certificate Vault</h2>
          <p className="section-description">
            Verified academic and industry credentials proving system mastery and
            domain competencies.
          </p>
        </div>

        {loading && (
          <div className="certs-message">
            <div className="loading-spinner"></div>
            <p className="hud-text glow-cyan">LOADING SYSTEM...</p>
          </div>
        )}

        {error && (
          <div className="certs-message error-message">
            <p className="hud-text glow-red">SYSTEM CONNECTION UNAVAILABLE</p>
          </div>
        )}

        {!loading && !error && certs.length === 0 && (
          <div className="certs-message">
            <p className="hud-text glow-yellow">NO RECORDS AVAILABLE</p>
          </div>
        )}

        {!loading && !error && certs.length > 0 && (
          <div className="certs-grid">
            {certs.map((cert, index) => (
              <motion.article
                key={cert._id || index}
                className="cert-vault-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <div className="cert-card-inner">
                  {/* Front/Main HUD view */}
                  <div className="cert-panel-top">
                    <span className="transmission-alert">
                      TRANSMISSION DECRYPTED
                    </span>
                    <span className="verified-badge">SECURE_VERIFIED</span>
                  </div>

                  <div className="cert-panel-body">
                    <div className="cert-badge-wrapper">
                      <ShieldCheckIcon />
                    </div>

                    <div className="cert-info">
                      <h3>{cert.name}</h3>
                      <p className="cert-issuer">ISSUER: {cert.issuer}</p>
                    </div>
                  </div>

                  <div className="cert-panel-bottom">
                    <div className="cert-meta-grid">
                      <div>
                        <span className="technical-label">DECRYPT_DATE:</span>
                        <span>{cert.issueDate}</span>
                      </div>
                    </div>

                    {cert.skillsVerified && certs.length > 0 && (
                      <div className="cert-skills">
                        <span className="technical-label">SKILLS_VERIFIED:</span>
                        <div className="cert-skill-tags">
                          {cert.skillsVerified.map((skill, sIdx) => (
                            <span key={sIdx} className="cert-skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="cert-vault-button"
                      >
                        Access Decryption Key <ExternalLinkIcon />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
