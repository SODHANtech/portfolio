import Katana from "./Katana";

export default function KatanaRack({
  groupedSkills,
  activeCategory,
  setActiveCategory,
  getCategoryGlowClass,
  getCategoryColor,
}) {
  return (
    <div className="katana-rack-panel hud-panel">
      <div className="hud-panel-header">
        <span>ARMORY_STORAGE</span>
        <span>WEAPON_RACK</span>
      </div>

      <div className="katana-rack-stand">
        {Object.entries(groupedSkills).map(([category, _items], idx) => {
          const isActive = activeCategory === category;
          const glowClass = getCategoryGlowClass(category);
          const color = getCategoryColor(category);

          return (
            <Katana
              key={category}
              category={category}
              color={color}
              glowClass={glowClass}
              idx={idx}
              isActive={isActive}
              onSelect={() => setActiveCategory(category)}
            />
          );
        })}
      </div>
    </div>
  );
}
