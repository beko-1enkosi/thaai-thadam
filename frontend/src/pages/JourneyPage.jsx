import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Icon from "../components/Icon";
import SafetyScoreInfo from "../components/SafetyScoreInfo";
import RouteCard from "../components/RouteCard";
import SafetyScore from "../components/SafetyScore";
import { getDemoRoutes, locations } from "../data/demoJourneys";
import { demoHubs } from "../data/demoHubs";

export default function JourneyPage() {
  const [params] = useSearchParams();
  const journeyHub = demoHubs.find((hub) => hub.id === params.get("hub"));
  const [start, setStart] = useState(
    journeyHub?.journeyLocationId === "thillai" ? "chathiram" : "thillai",
  );
  const [destination, setDestination] = useState(
    locations.some((place) => place.id === params.get("to"))
      ? params.get("to")
      : journeyHub?.journeyLocationId || "",
  );
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [locationNotice, setLocationNotice] = useState("");
  const [started, setStarted] = useState(false);
  const resultsRef = useRef(null);
  const detailsRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    document.title = "Plan a journey | Thaai Thadam";
  }, []);
  useEffect(() => {
    if (routes.length) resultsRef.current?.focus();
  }, [routes]);
  useEffect(() => {
    if (selected) detailsRef.current?.focus();
  }, [selected]);

  function resetResults() {
    setRoutes([]);
    setSelected(null);
    setStarted(false);
    setError("");
  }
  function findRoutes(event) {
    event.preventDefault();
    if (start === destination) {
      setError("Choose a destination different from your starting location.");
      destinationRef.current.focus();
      return;
    }
    setError("");
    setSelected(null);
    setStarted(false);
    setRoutes(getDemoRoutes(start, destination));
  }
  function useDemoLocation() {
    resetResults();
    setStart("thillai");
    setLocationNotice(
      "Starting location set to Thillai Nagar. Your device location was not accessed.",
    );
  }
  const placeName = (id) => locations.find((place) => place.id === id)?.name;

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">FROM THE FIRST STEP TO THE LAST</p>
        <h1>Plan your journey</h1>
        <p>A little planning for the walk, the wait, and the ride.</p>
      </div>
      {journeyHub && (
        <div className="demo-notice">
          <span className="demo-label">Selected hub</span>
          <div>
            <p>
              <strong>{journeyHub.name}</strong>. {journeyHub.area}
            </p>
            <p>{journeyHub.status}. Kept as a planning reference only.</p>
            <p>
              {journeyHub.journeyLocationId
                ? "The matching area is prefilled. Routes are examples for the area, not directions to this hub."
                : "This hub's area is outside the three supported journey locations. Choose a supported destination to explore; no route to this hub is calculated."}
            </p>
            <Link
              to={`/safe-hubs?hub=${journeyHub.id}`}
              className="hub-reference-link"
            >
              View selected hub details
            </Link>
          </div>
        </div>
      )}
      <div className="planner-intro">
        <form className="planner-form" onSubmit={findRoutes}>
          <div className="form-heading">
            <h2>Where shall we go?</h2>
            <span className="small-label">Trichy</span>
          </div>
          <div className="location-fields">
            <div className="field">
              <label htmlFor="start">Starting location</label>
              <select
                id="start"
                value={start}
                onChange={(event) => {
                  setStart(event.target.value);
                  setLocationNotice("");
                  resetResults();
                }}
              >
                {locations.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="field-arrow" aria-hidden="true">
              <Icon name="arrow" />
            </span>
            <div className="field">
              <label htmlFor="destination">Destination</label>
              <select
                ref={destinationRef}
                id="destination"
                required
                value={destination}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "journey-error" : undefined}
                onChange={(event) => {
                  setDestination(event.target.value);
                  resetResults();
                }}
              >
                <option value="">Choose a destination</option>
                {locations.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="location-button"
            type="button"
            onClick={useDemoLocation}
          >
            <Icon name="locate" size={18} />
            Use example location
          </button>
          <p className="field-help">
            Choose from three locations. The location button uses Thillai Nagar,
            not GPS.
          </p>
          <p className="sr-only" role="status">
            {locationNotice}
          </p>
          {locationNotice && <p className="inline-note">{locationNotice}</p>}
          {error && (
            <p id="journey-error" className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="button button-primary">
            Find safer routes
            <Icon name="arrow" size={19} />
          </button>
        </form>
        <aside className="planning-note">
          <span className="context-icon">
            <Icon name="shield" size={26} />
          </span>
          <h2>More than the quickest way.</h2>
          <p>
            Compare lighting, street activity, and places to pause along your
            journey.
          </p>
          <p className="small-label">Your comfort matters at every stage.</p>
        </aside>
      </div>
      <SafetyScoreInfo />
      {routes.length > 0 ? (
        <section className="route-results" aria-labelledby="results-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">COMPARE YOUR OPTIONS</p>
              <h2 ref={resultsRef} tabIndex={-1} id="results-title">
                3 route options
              </h2>
              <p>
                {placeName(start)} <span aria-hidden="true">&#8594;</span>
                <span className="sr-only"> to </span> {placeName(destination)}
              </p>
            </div>
            <span className="small-label">Estimates only</span>
          </div>
          <div className="route-grid">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                selected={selected?.id === route.id}
                onSelect={() => {
                  setSelected(route);
                  setStarted(false);
                }}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="planner-empty">
          <Icon name="journey" size={28} />
          <p>Every journey starts with a choice.</p>
          <span>Select your destination to compare three route options.</span>
        </div>
      )}
      <section id="route-details" aria-label="Selected route details">
        {selected && (
          <div className="route-detail">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR SELECTED ROUTE</p>
                <h2 ref={detailsRef} tabIndex={-1}>
                  {selected.name}
                </h2>
                <p>
                  {placeName(start)} to {placeName(destination)}
                </p>
              </div>
              <SafetyScore score={selected.score} />
            </div>
            <div className="detail-stats">
              <span>
                <strong>~{selected.minutes} min</strong>Estimated duration
              </span>
              <span>
                <strong>~{selected.distance.toFixed(1)} km</strong>Approximate
                distance
              </span>
              <span>
                <strong>{selected.mode}</strong>Transport mode
              </span>
            </div>
            <div className="detail-columns">
              <div>
                <h3>Why this rating?</h3>
                <ul className="rating-reasons">
                  {selected.reasons.map(([label, reason]) => (
                    <li key={label}>
                      <strong>{label}</strong>
                      <p>{reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Your journey, step by step</h3>
                <ol className="journey-steps">
                  {selected.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="transport-note">{selected.transport}</p>
                {selected.hub && (
                  <div className="hub-detail">
                    <Icon name="hub" />
                    <div>
                      <span className="small-label">Nearby hub</span>
                      <h4>{selected.hub.name}</h4>
                      <Link
                        className="hub-reference-link"
                        to={`/safe-hubs?hub=${selected.hub.id}`}
                      >
                        View hub details
                      </Link>
                      <p>{selected.hub.amenities}</p>
                      <p>
                        Shown near the transfer. Location and facilities are
                        unverified.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="start-journey">
              <div>
                <strong>Ready to try the next step?</strong>
                <p>
                  This shows a journey summary. No navigation or tracking
                  starts.
                </p>
              </div>
              <button
                type="button"
                className="button button-primary"
                onClick={() => setStarted(true)}
                disabled={started}
              >
                {started ? "Journey ready" : "Start safer journey"}
                <Icon name="arrow" size={18} />
              </button>
            </div>
            <div role="status">
              {started && (
                <p className="journey-confirmation">
                  Journey ready: {placeName(start)} to {placeName(destination)}{" "}
                  via {selected.name.toLowerCase()}. No GPS navigation, booking,
                  location sharing, or emergency monitoring is active.
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
