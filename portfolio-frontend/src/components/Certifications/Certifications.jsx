import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import "./certifications.css";



export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [chestOpen, setChestOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadCerts = () => {
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
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadCerts();
  };

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
            <button className="hud-retry-btn" onClick={handleRetry} style={{ marginTop: "15px" }}>
              [ RETRY CONNECTION ]
            </button>
          </div>
        )}

        {!loading && !error && certs.length === 0 && (
          <div className="certs-message">
            <p className="hud-text glow-yellow">NO RECORDS AVAILABLE</p>
          </div>
        )}

        {!loading && !error && certs.length > 0 && (
          <>
            {!chestOpen ? (
              /* CLOSED CHEST CENTERPIECE STATE */
              <div className="chest-vault-container">
                <div className="chest-wrapper">
                  <div className="cyber-chest-outer" onClick={() => setChestOpen(true)}>
                    <div className="cyber-chest">
                      {/* 3D lid panels */}
                      <div className="chest-lid">
                        <div className="chest-lid-panel front">
                          <div className="chest-latch">
                            <span className="latch-led"></span>
                          </div>
                        </div>
                        <div className="chest-lid-panel back"></div>
                        <div className="chest-lid-panel top"></div>
                        <div className="chest-lid-panel bottom"></div>
                        <div className="chest-lid-panel left"></div>
                        <div className="chest-lid-panel right"></div>
                      </div>
                      {/* 3D base panels */}
                      <div className="chest-base">
                        <div className="chest-base-panel front"></div>
                        <div className="chest-base-panel back"></div>
                        <div className="chest-base-panel left"></div>
                        <div className="chest-base-panel right"></div>
                        <div className="chest-base-panel bottom"></div>
                      </div>
                    </div>
                  </div>
                  <div className="chest-telemetry">
                    <span className="monospace-label">VAULT_CONTAINER: SEALED</span>
                    <button className="hud-initialize-btn" onClick={() => setChestOpen(true)}>
                      [ CLICK TO INITIALIZE SECURE TRANSFERS ]
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* OPEN STATE: CHEST ON LEFT, INVENTORY / INSPECTOR ON RIGHT */
              <div className="cert-chest-opened-layout">
                {/* Left Side: Open Chest centerpiece */}
                <div className="chest-column">
                  <div className="cyber-chest-outer is-open" onClick={() => { setChestOpen(false); setSelectedCert(null); }}>
                    <div className="cyber-chest is-open">
                      <div className="chest-lid">
                        <div className="chest-lid-panel front">
                          <div className="chest-latch active">
                            <span className="latch-led active"></span>
                          </div>
                        </div>
                        <div className="chest-lid-panel back"></div>
                        <div className="chest-lid-panel top"></div>
                        <div className="chest-lid-panel bottom"></div>
                        <div className="chest-lid-panel left"></div>
                        <div className="chest-lid-panel right"></div>
                      </div>
                      <div className="chest-base">
                        <div className="chest-base-panel front"></div>
                        <div className="chest-base-panel back"></div>
                        <div className="chest-base-panel left"></div>
                        <div className="chest-base-panel right"></div>
                        <div className="chest-base-panel bottom"></div>
                      </div>
                    </div>
                  </div>
                  <div className="chest-telemetry">
                    <span className="monospace-label text-cyan">VAULT_CONTAINER: ACCESS_GRANTED</span>
                    <button className="hud-close-chest-btn" onClick={() => { setChestOpen(false); setSelectedCert(null); }}>
                      [ SEAL VAULT ]
                    </button>
                  </div>
                </div>

                {/* Right Side: Inventory List or Compact Inspector */}
                <div className="content-column">
                  {selectedCert ? (
                    /* COMPACT CERTIFICATE INSPECTOR */
                    <div className="certificate-inspector-panel">
                      <div className="inspector-header">
                        <span className="hud-panel-title">CERTIFICATE_INSPECTOR</span>
                        <div className="hud-status-wrapper">
                          <span className="hud-status-led active" />
                          <span>IMAGE_STREAM: ONLINE</span>
                        </div>
                        <button
                          className="cert-close-btn"
                          onClick={() => setSelectedCert(null)}
                          aria-label="Close inspector"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="inspector-body">
                        <div className="inspector-image-container">
                          <img
                            src={`${api.defaults.baseURL}/certifications/image/${selectedCert._id}`}
                            alt={selectedCert.name}
                            className="cert-inspector-image"
                          />
                        </div>
                        <div className="inspector-details">
                          <h3>{selectedCert.name}</h3>
                          <p className="technical-label">ISSUED BY: {selectedCert.issuer}</p>
                          <p className="technical-label">DATE: {selectedCert.issueDate}</p>
                          
                          {selectedCert.skillsVerified && selectedCert.skillsVerified.length > 0 && (
                            <div className="inspector-skills">
                              <span className="technical-label">SKILLS_VERIFIED:</span>
                              <div className="cert-skill-tags">
                                {selectedCert.skillsVerified.map((skill, idx) => (
                                  <span key={idx} className="cert-skill-tag">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <button className="cert-close-inspector-btn" onClick={() => setSelectedCert(null)}>
                            [ BACK TO INVENTORY ]
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* CERTIFICATE INVENTORY LIST */
                    <div className="certificate-inventory-grid">
                      {certs.map((cert, index) => (
                        <motion.article
                          key={cert._id || index}
                          className="cert-vault-card"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.08 }}
                        >
                          <div className="cert-card-inner">
                            <div className="cert-panel-top">
                              <span className="transmission-alert">TRANS_00{index + 1}</span>
                              <span className="verified-badge">SECURE_VERIFIED</span>
                            </div>

                            <div className="cert-panel-body">
                              <h3>{cert.name}</h3>
                              <p className="cert-issuer">ISSUER: {cert.issuer}</p>
                            </div>

                            <div className="cert-panel-bottom">
                              <div className="cert-meta-grid">
                                <div>
                                  <span className="technical-label">DECRYPT_DATE:</span>
                                  <span>{cert.issueDate}</span>
                                </div>
                              </div>
                              
                              {cert.skillsVerified && cert.skillsVerified.length > 0 && (
                                <div className="cert-skills">
                                  <span className="technical-label">SKILLS_VERIFIED:</span>
                                  <div className="cert-skill-tags">
                                    {cert.skillsVerified.slice(0, 3).map((skill, sIdx) => (
                                      <span key={sIdx} className="cert-skill-tag">
                                        {skill}
                                      </span>
                                    ))}
                                    {cert.skillsVerified.length > 3 && (
                                      <span className="cert-skill-tag">+{cert.skillsVerified.length - 3}</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {cert.certificationImage?.fileId && (
                                <button
                                  onClick={() => setSelectedCert(cert)}
                                  className="cert-vault-button"
                                  style={{ marginTop: "12px" }}
                                >
                                  OPEN CERTIFICATE
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
