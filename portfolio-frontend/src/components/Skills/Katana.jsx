export default function Katana({ category, color, glowClass, idx, isActive, onSelect }) {
  return (
    <div
      className={`katana-item-wrap ${isActive ? "active" : ""}`}
      tabIndex="0"
      onClick={onSelect}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      aria-label={`Inspect ${category} skills`}
    >
      <span className="katana-label-hud">
        SLOT_0{idx + 1} // {category}
      </span>
      
      <svg viewBox="0 0 400 30" className="katana-svg">
        {/* Tsuka (Handle) wrapping */}
        <rect x="25" y="11" width="70" height="8" rx="2" fill="#090d16" stroke={color} strokeWidth="1" />
        {/* Glowing Cyber Hilt Core */}
        <line x1="30" y1="15" x2="90" y2="15" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        <path d="M 35,11 L 45,19 M 45,11 L 55,19 M 55,11 L 65,19 M 65,11 L 75,19 M 75,11 L 85,19" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M 45,11 L 35,19 M 55,11 L 45,19 M 65,11 L 55,19 M 75,11 L 65,19 M 85,11 L 75,19" stroke="#1e293b" strokeWidth="1.5" />
        
        {/* Tsuba (Segmented Cyber-Octagon Guard) */}
        <path d="M 93,6 L 97,6 L 99,10 L 99,20 L 97,24 L 93,24 L 91,20 L 91,10 Z" fill="#0c1326" stroke={color} strokeWidth="1.5" />
        <line x1="95" y1="6" x2="95" y2="24" stroke={color} strokeWidth="1" opacity="0.4" />
        
        {/* Saya (Sheath) */}
        <path d="M 98,14 Q 230,13 360,9 C 363,9 363,17 360,17 Q 230,21 98,16 Z" fill="#090d16" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
        <path d="M 120,15 Q 230,14 340,11" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        
        {/* Holographic Laser Constraint Bands on Sheath */}
        <ellipse cx="140" cy="15.2" rx="2" ry="5.5" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <ellipse cx="220" cy="14.8" rx="2" ry="5.2" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <ellipse cx="300" cy="14.2" rx="2" ry="4.8" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        
        {/* Sliding Blade (Habaki + Nagasa) */}
        <g className="katana-blade-g">
          {/* Habaki (Collar) */}
          <rect x="96" y="12" width="10" height="6" fill="#f59e0b" rx="1" />
          
          {/* Neon-rimmed Energy Blade */}
          <path
            d="M 106,14 Q 230,13 350,9 L 348,11 Q 230,15 106,16 Z"
            fill="#050814"
            stroke={color}
            strokeWidth="1.5"
            className={glowClass}
          />
          {/* Glowing plasma circuitry trace on blade face */}
          <path
            d="M 115,15 Q 230,14 330,11"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.85"
            strokeDasharray="20 15 5 5 10 15"
          />
        </g>
      </svg>
    </div>
  );
}
