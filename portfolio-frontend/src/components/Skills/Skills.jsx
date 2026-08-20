import { useEffect, useState } from "react";
import api from "../../services/api";
import KatanaRack from "./KatanaRack";
import SkillTerminal from "./SkillTerminal";
import "./skills.css";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    api
      .get("/skills")
      .then((res) => {
        setSkills(res.data);
        if (res.data && res.data.length > 0) {
          const firstCat = res.data[0].category || "GENERAL SYSTEMS";
          setActiveCategory(firstCat);
        }
      })
      .catch((err) => {
        console.error("Failed to load skills data:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Group skills dynamically by their category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "GENERAL SYSTEMS";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const getCategoryGlowClass = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes("programming")) return "blade-glow-programming";
    if (c.includes("backend")) return "blade-glow-backend";
    if (c.includes("ai")) return "blade-glow-ai";
    if (c.includes("frontend") || c.includes("stack")) return "blade-glow-frontend";
    if (c.includes("database")) return "blade-glow-database";
    if (c.includes("hardware") || c.includes("logic")) return "blade-glow-hardware";
    return "blade-glow-development";
  };

  const getCategoryColor = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes("programming")) return "#06b6d4"; // cyan
    if (c.includes("backend")) return "#8b5cf6"; // purple
    if (c.includes("ai")) return "#ec4899"; // pink
    if (c.includes("frontend") || c.includes("stack")) return "#a855f7"; // violet
    if (c.includes("database")) return "#10b981"; // green
    if (c.includes("hardware") || c.includes("logic")) return "#f59e0b"; // amber
    return "#cbd5e1"; // grey
  };

  return (
    <section id="skills" className="skills-section">
      <div className="section-container">
        <div className="skills-heading">
          <p className="section-small">POWER MODULES</p>
          <h2>System Toolkit</h2>
          <p className="section-description">
            The underlying frameworks, libraries, and tools that drive my
            applications. Select a domain weapon below to inspect its detailed specifications.
          </p>
        </div>

        {loading && (
          <div className="skills-message">
            <div className="loading-spinner"></div>
            <p className="hud-text glow-cyan">LOADING SYSTEM...</p>
          </div>
        )}

        {error && (
          <div className="skills-message error-message">
            <p className="hud-text glow-red">SYSTEM CONNECTION UNAVAILABLE</p>
          </div>
        )}

        {!loading && !error && skills.length === 0 && (
          <div className="skills-message">
            <p className="hud-text glow-yellow">NO RECORDS AVAILABLE</p>
          </div>
        )}

        {!loading && !error && skills.length > 0 && (
          <div className="skills-armory-layout">
            <KatanaRack
              groupedSkills={groupedSkills}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              getCategoryGlowClass={getCategoryGlowClass}
              getCategoryColor={getCategoryColor}
            />

            <SkillTerminal
              activeCategory={activeCategory}
              groupedSkills={groupedSkills}
              getCategoryColor={getCategoryColor}
            />
          </div>
        )}
      </div>
    </section>
  );
}
