import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import api from "../../services/api";
import JourneyCard from "./JourneyCard";
import JourneyMarker from "./JourneyMarker";
import "./journey.css";

export default function Journey() {
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== "undefined" && window.innerWidth <= 768;
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);

  // 1. Fetch learning progression phases from MongoDB Atlas
  useEffect(() => {
    api
      .get("/journey")
      .then((res) => {
        const sorted = (res.data || []).sort((a, b) => a.phase - b.phase);
        setJourney(sorted);
      })
      .catch((err) => {
        console.error("Failed to load journey data:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. Manage responsiveness & reduced motion settings
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", checkMobile);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // 3. Scroll tracking setup using framer-motion useScroll hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // Calculate path length dynamically, handling initial delayed/boot render sizes
  useEffect(() => {
    const updateLength = () => {
      if (pathRef.current) {
        const len = pathRef.current.getTotalLength();
        if (len > 0) {
          setPathLength(len);
        }
      }
    };
    updateLength();
    
    // Catch final layout coordinates after boot screen fades out
    const t = setTimeout(updateLength, 2500);

    window.addEventListener("resize", updateLength);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateLength);
    };
  }, [journey, isMobile]);

  const strokeDashoffset = useTransform(smoothProgress, [0, 1], [pathLength, 0]);

  const xPercent = useTransform(smoothProgress, () => {
    if (isMobile) {
      return "20px";
    }
    return "calc(50% - 16px)"; // Center 32px F1 spider on straight line
  });

  const yPercent = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="journey" className="journey-section">
      <div className="section-container">
        <div className="journey-heading">
          <p className="section-small">THE JOURNEY</p>

          <h2>
            From Learning
            <br />
            <span>to Building.</span>
          </h2>

          <p className="section-description">
            A database-driven chronological log of my progression from computer
            science student to full-stack engineer.
          </p>
        </div>

        {/* 
          Keep the timeline-circuit container rendered in DOM continuously 
          so the ref is always bound on hook registration.
        */}
        <div ref={containerRef} className="journey-timeline-circuit">
          {loading && (
            <div className="journey-message">
              <div className="loading-spinner"></div>
              <p className="hud-text glow-cyan">LOADING SYSTEM...</p>
            </div>
          )}

          {error && (
            <div className="journey-message error-message">
              <p className="hud-text glow-red">SYSTEM CONNECTION UNAVAILABLE</p>
            </div>
          )}

          {!loading && !error && journey.length === 0 && (
            <div className="journey-message">
              <p className="hud-text glow-yellow">NO RECORDS AVAILABLE</p>
            </div>
          )}

          {!loading && !error && journey.length > 0 && (
            <>
              {/* The serpentine circuit track vector overlay */}
              <svg
                className="journey-circuit-svg"
                viewBox="0 0 4 1000"
                preserveAspectRatio="none"
              >
                {/* Background trace line */}
                <path
                  d="M 2,0 L 2,1000"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.05)"
                  strokeWidth="1.5"
                />
                {/* Animated active progress tracker (Web Silk thread) */}
                {!reducedMotion && (
                  <motion.path
                    ref={pathRef}
                    d="M 2,0 L 2,1000"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.55)"
                    strokeWidth="1.5"
                    style={{
                      strokeDasharray: pathLength || 1000,
                      strokeDashoffset: strokeDashoffset,
                    }}
                  />
                )}
              </svg>

              {/* Scroll-driven web tracker cyber-spider */}
              {!reducedMotion && !isMobile && (
                <motion.div
                  className="racer-dot"
                  style={{
                    left: xPercent,
                    top: yPercent,
                    transform: "translateY(-16px)", // Centers the 32px height spider on scroll
                  }}
                >
                  <div className="spider-swing-container">
                    <div className="racer-trail" />
                    <svg viewBox="0 0 32 32" width="32" height="32" style={{ display: "block", position: "relative", zIndex: 6 }}>
                      <defs>
                        <filter id="spider-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      {/* Web thread inside box */}
                      <line x1="16" y1="0" x2="16" y2="10" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1" strokeDasharray="1.5 1" />
                      
                      {/* Legs Left */}
                      <path d="M 13 11 C 9 7, 6 10, 5 15" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <path d="M 13 12 C 7 9, 4 14, 3 20" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <path d="M 13 14 C 6 16, 4 22, 5 26" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <path d="M 13 16 C 8 20, 8 26, 11 29" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      
                      {/* Legs Right */}
                      <path d="M 19 11 C 23 7, 26 10, 27 15" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <path d="M 19 12 C 25 9, 28 14, 29 20" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <path d="M 19 14 C 26 16, 28 22, 27 26" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <path d="M 19 16 C 24 20, 24 26, 21 29" fill="none" stroke="#06b6d4" strokeWidth="1.2" />

                      {/* Cephalothorax (Head) */}
                      <circle cx="16" cy="12" r="3.5" fill="#090e1f" stroke="#06b6d4" strokeWidth="1.5" />
                      
                      {/* Abdomen */}
                      <ellipse cx="16" cy="20" rx="5.5" ry="7.5" fill="#090e1f" stroke="#06b6d4" strokeWidth="1.5" />
                      
                      {/* Cyber Neon Emblem */}
                      <path d="M 16 16 L 13.5 20 L 16 24 L 18.5 20 Z" fill="#22d3ee" opacity="0.9" filter="url(#spider-glow)" />
                    </svg>
                  </div>
                </motion.div>
              )}

              {journey.map((item, index) => {
                const isEven = index % 2 === 0;
                const nodeClass = isMobile
                  ? ""
                  : isEven
                  ? "node-left"
                  : "node-right";

                return (
                  <motion.article
                    key={item._id || index}
                    className={`journey-circuit-node ${nodeClass}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6 }}
                  >
                    <JourneyMarker phase={item.phase} index={index} />
                    <JourneyCard item={item} />
                  </motion.article>
                );
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
