import Icon from "./Icon";
import SafetyScore from "./SafetyScore";

export default function RouteCard({ route, selected, onSelect }) {
  return (
    <article
      className={`route-card${selected ? " is-selected" : ""}`}
      aria-labelledby={`route-${route.id}`}
    >
      <div className="route-card-top">
        <span className="route-tag">{route.highlight}</span>
        <SafetyScore score={route.score} />
      </div>
      <h3 id={`route-${route.id}`}>{route.name}</h3>
      <p className="transport-mode">{route.mode}</p>
      <div className="route-metrics">
        <span>
          <Icon name="clock" size={17} />~{route.minutes} min
        </span>
        <span>~{route.distance.toFixed(1)} km</span>
      </div>
      <p className="route-summary">{route.summary}</p>
      <button
        className="button button-secondary"
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-controls="route-details"
        aria-label={`View details: ${route.name}`}
      >
        {selected ? "Selected route" : "View route details"}
        <Icon name="arrow" size={17} />
      </button>
    </article>
  );
}
