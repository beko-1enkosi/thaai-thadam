import SafetyScore from "./SafetyScore";
import { hubAmenities } from "../data/demoHubs";

export default function HubCard({ hub, selected, onSelect }) {
  return (
    <article
      className={`route-card hub-card${selected ? " is-selected" : ""}`}
      aria-labelledby={`hub-${hub.id}`}
    >
      <div className="route-card-top">
        <span className="demo-label">Demo hub</span>
        <SafetyScore score={hub.score} />
      </div>
      <h3 id={`hub-${hub.id}`}>{hub.name}</h3>
      <p>{hub.area}</p>
      <p className="small-label">
        ~{hub.distanceKm.toFixed(1)} km from demo reference point
      </p>
      <p className="hub-status">{hub.status}</p>
      <ul className="hub-amenities" aria-label="Sample amenities">
        {hubAmenities
          .filter((amenity) => hub.amenities.includes(amenity.id))
          .map((amenity) => (
            <li key={amenity.id}>{amenity.label}</li>
          ))}
      </ul>
      <button
        type="button"
        className="button button-secondary"
        aria-pressed={selected}
        aria-controls="hub-details"
        aria-label={`View hub details: ${hub.name}`}
        onClick={onSelect}
      >
        {selected ? "View selected hub" : "View hub details"}
      </button>
    </article>
  );
}
