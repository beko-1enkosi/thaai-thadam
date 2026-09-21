import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import SafetyScoreInfo from "../components/SafetyScoreInfo";
import SafetyScore from "../components/SafetyScore";
import HubCard from "../components/HubCard";
import {
  demoHubs,
  filterDemoHubs,
  hubAmenities,
  hubDistanceOrigin,
} from "../data/demoHubs";

export default function SafeHubsPage() {
  const [params, setParams] = useSearchParams();
  const [directionsFor, setDirectionsFor] = useState(null);
  const searchRef = useRef(null);
  const detailRef = useRef(null);
  const lastSelectionRef = useRef(null);
  const query = params.get("q") || "";
  const filters = params.getAll("amenity");
  const visibleHubs = filterDemoHubs(query, filters);
  const selectedId = params.get("hub");
  const selectedHub = demoHubs.find((hub) => hub.id === selectedId);

  useEffect(() => {
    document.title = "Safe hubs | Thaai Thadam";
  }, []);

  useEffect(() => {
    setDirectionsFor(null);
    if (selectedHub) detailRef.current?.focus();
  }, [selectedHub]);

  // Keep filters and hub selection in the URL so links, reload, and Back work.
  function updateSearch(value) {
    const next = new URLSearchParams(params);
    value ? next.set("q", value) : next.delete("q");
    next.delete("hub");
    setParams(next, { replace: true });
  }

  function toggleAmenity(id, checked) {
    const next = new URLSearchParams(params);
    const updated = checked
      ? [...filters, id]
      : filters.filter((value) => value !== id);
    next.delete("amenity");
    updated.forEach((value) => next.append("amenity", value));
    next.delete("hub");
    setParams(next, { replace: true });
  }

  function clearFilters() {
    setParams({}, { replace: true });
    searchRef.current.focus();
  }

  function selectHub(hub, button) {
    lastSelectionRef.current = button;
    const next = new URLSearchParams(params);
    next.set("hub", hub.id);
    setParams(next);
    if (selectedId === hub.id) detailRef.current?.focus();
  }

  function closeDetails() {
    const next = new URLSearchParams(params);
    next.delete("hub");
    setParams(next, { replace: true });
    const button = lastSelectionRef.current;
    if (button?.isConnected) button.focus();
    else searchRef.current.focus();
  }

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">PLACES TO PAUSE</p>
        <h1>Safe mobility hubs</h1>
        <p>Explore waiting points and the support they could offer.</p>
      </div>
      <p className="field-help">
        Distances are measured from {hubDistanceOrigin}, not your current
        location. Hub locations, facilities and access hours have not been
        confirmed.
      </p>
      <SafetyScoreInfo />

      <form
        className="planner-form hub-search"
        role="search"
        aria-label="Search and filter hubs"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="field">
          <label htmlFor="hub-search">Search by hub name or area</label>
          <input
            ref={searchRef}
            type="search"
            id="hub-search"
            value={query}
            placeholder="For example, Chathiram or Thillai Nagar"
            onChange={(event) => updateSearch(event.target.value)}
            aria-controls="hub-results"
          />
        </div>
        <fieldset className="hub-filters" aria-describedby="hub-filter-help">
          <legend>Filter by amenities</legend>
          <p id="hub-filter-help" className="field-help">
            Results must include all selected amenities.
          </p>
          <div className="hub-filter-options">
            {hubAmenities
              .filter((amenity) => amenity.filterable)
              .map((amenity) => (
                <label key={amenity.id} htmlFor={`filter-${amenity.id}`}>
                  <input
                    type="checkbox"
                    id={`filter-${amenity.id}`}
                    checked={filters.includes(amenity.id)}
                    onChange={(event) =>
                      toggleAmenity(amenity.id, event.target.checked)
                    }
                  />
                  {amenity.label}
                </label>
              ))}
          </div>
        </fieldset>
        <button
          type="button"
          className="button button-secondary"
          onClick={clearFilters}
        >
          Clear search and filters
        </button>
      </form>

      {selectedId && !selectedHub && (
        <p role="status" className="inline-note">
          That hub could not be found. Choose a hub below or clear search and
          filters.
        </p>
      )}

      <section
        id="hub-results"
        className="route-results"
        aria-labelledby="hub-results-title"
      >
        <h2 id="hub-results-title">Mobility hubs</h2>
        <p role="status" aria-atomic="true">
          {visibleHubs.length} {visibleHubs.length === 1 ? "hub" : "hubs"}{" "}
          found.
        </p>
        {visibleHubs.length ? (
          <div className="route-grid">
            {visibleHubs.map((hub) => (
              <HubCard
                key={hub.id}
                hub={hub}
                selected={selectedId === hub.id}
                onSelect={(event) => selectHub(hub, event.currentTarget)}
              />
            ))}
          </div>
        ) : (
          <div className="page hub-empty">
            <h3>No matching hubs</h3>
            <p>
              Try another name or area, or remove an amenity filter. Only the
              six listed hubs are searchable.
            </p>
            <button
              type="button"
              className="button button-secondary"
              onClick={clearFilters}
            >
              Clear filters and show all hubs
            </button>
          </div>
        )}
      </section>

      <section id="hub-details" aria-label="Selected hub details">
        {selectedHub && (
          <div className="route-detail">
            <div className="section-heading">
              <div>
                <p className="eyebrow">HUB DETAILS</p>
                <h2 id="hub-detail-title" ref={detailRef} tabIndex={-1}>
                  {selectedHub.name}
                </h2>
                <p>{selectedHub.area}</p>
              </div>
              <SafetyScore score={selectedHub.score} />
            </div>
            <dl className="hub-facts">
              <div>
                <dt>Approximate location</dt>
                <dd>{selectedHub.address}</dd>
              </div>
              <div>
                <dt>Approximate distance</dt>
                <dd>
                  ~{selectedHub.distanceKm.toFixed(1)} km from{" "}
                  {hubDistanceOrigin}.
                </dd>
              </div>
              <div>
                <dt>Access status</dt>
                <dd>{selectedHub.status}</dd>
              </div>
              <div>
                <dt>Opening and access information</dt>
                <dd>{selectedHub.access}</dd>
              </div>
              <div>
                <dt>Example review date</dt>
                <dd>
                  <time dateTime={selectedHub.lastReviewed}>
                    {selectedHub.lastReviewed}
                  </time>{" "}
                  (illustrative date, not an inspection)
                </dd>
              </div>
            </dl>
            <div className="detail-columns">
              <div>
                <h3>Amenities</h3>
                <ul className="hub-amenities">
                  {hubAmenities
                    .filter((amenity) =>
                      selectedHub.amenities.includes(amenity.id),
                    )
                    .map((amenity) => (
                      <li key={amenity.id}>{amenity.label}</li>
                    ))}
                </ul>
                <p className="small-label">
                  Check the access information before planning a visit.
                </p>
                <h3>Transport connections</h3>
                <ul>
                  {selectedHub.transport.map((connection) => (
                    <li key={connection}>{connection}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Why this score?</h3>
                <ul className="rating-reasons">
                  {selectedHub.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <p className="small-label">
                  These factors explain the rating. Conditions need to be
                  checked locally.
                </p>
              </div>
            </div>
            <div className="hub-actions">
              <Link
                className="button button-primary"
                to={`/journey?hub=${selectedHub.id}`}
              >
                Use in journey
              </Link>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setDirectionsFor(selectedHub.id)}
              >
                Get directions
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={closeDetails}
              >
                Back to hub results
              </button>
            </div>
            <div role="status">
              {directionsFor === selectedHub.id && (
                <p className="journey-confirmation">
                  Map directions will be available when mapping is connected. No
                  navigation or location tracking has started.
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
