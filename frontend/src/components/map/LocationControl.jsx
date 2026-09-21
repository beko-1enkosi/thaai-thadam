import { SkeletonText } from '../Skeleton';
export default function LocationControl({ locationState, onRequest }) {
  const { location, pending, error, getLocation, clearLocation } = locationState;
  return (
    <div className="map-location-control">
      <button type="button" className="button button-secondary" disabled={pending} onClick={onRequest || (() => getLocation())}>
        {pending ? 'Finding your location...' : 'Use current location'}
      </button>
      <p className="field-help">Location is captured only when requested. It stays on this page. OpenStreetMap receives map tile requests for the area you view.</p>
      <p role="status">{pending ? 'Your browser may ask for permission.' : ''}</p>
      {pending && <SkeletonText wide />}
      {error && <p role="alert" className="form-error">{error}</p>}
      {location && <div>
        <p role="status">Your captured location: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}.
          {Number.isFinite(location.accuracy) && ` Accuracy: about ${Math.ceil(location.accuracy)} metres.`}
          {' '}Captured at {new Date(location.capturedAt).toLocaleTimeString()}.</p>
        <button type="button" className="button button-secondary" onClick={clearLocation}>Clear current location</button>
      </div>}
    </div>
  );
}
