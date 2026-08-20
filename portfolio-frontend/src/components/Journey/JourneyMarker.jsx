export default function JourneyMarker({ phase, index }) {
  return (
    <div className="journey-marker">
      <span className="node-glow-effect"></span>
      <span>{String(phase || index + 1).padStart(2, "0")}</span>
    </div>
  );
}
