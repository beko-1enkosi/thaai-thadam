import { useEffect, useRef, useState } from 'react';
import { emergencyContacts } from '../config/emergencyContacts';

const locationErrors = {
  1: 'Location permission was denied. Allow location in your browser settings, then try again.',
  2: 'Your location could not be found. Check that location services are enabled, then try again.',
  3: 'Finding your location took too long. Try again when you have a better signal.',
};

export default function EmergencyPage() {
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [sharing, setSharing] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const request = useRef(0);
  const copyText = useRef(null);

  useEffect(() => {
    document.title = 'Emergency Help | Thaai Thadam';
    return () => { request.current += 1; };
  }, []);

  useEffect(() => {
    if (manualCopy) {
      copyText.current?.focus();
      copyText.current?.select();
    }
  }, [manualCopy]);

  function getLocation() {
    setLocationError('');
    setFeedback('');
    setManualCopy(false);
    setLocation(null);
    if (!navigator.geolocation) {
      setLocationError('This browser cannot access your location. Try a supported browser. You can still use the call links above.');
      return;
    }
    setLocating(true);
    const currentRequest = ++request.current;
    function failed(error) {
      if (currentRequest !== request.current) return;
      setLocating(false);
      setLocationError(locationErrors[error?.code] || 'We could not get your location. Please try again. You can still use the call links above.');
    }
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        if (currentRequest !== request.current) return;
        const { latitude, longitude, accuracy } = position.coords;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          failed();
          return;
        }
        setLocation({
          latitude: latitude.toFixed(5),
          longitude: longitude.toFixed(5),
          accuracy: Number.isFinite(accuracy) ? Math.ceil(accuracy) : null,
          capturedAt: new Date(position.timestamp).toISOString(),
        });
        setLocating(false);
      }, failed, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    } catch {
      failed();
    }
  }

  const mapUrl = location
    ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
    : '';
  const message = location
    ? `I need help. This is my current location from Thaai Thadam.\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}\nCaptured: ${new Date(location.capturedAt).toLocaleString()}${location.accuracy !== null ? `\nAccuracy: about ${location.accuracy} metres` : ''}\n${mapUrl}`
    : '';

  async function copyLocation() {
    setFeedback('');
    try {
      await navigator.clipboard.writeText(message);
      setManualCopy(false);
      setFeedback('Location details copied. Paste them into a message to someone you trust.');
    } catch {
      setManualCopy(true);
      setFeedback('Automatic copying is unavailable. Select and copy the location details below.');
      copyText.current?.focus();
      copyText.current?.select();
    }
  }

  async function shareLocation() {
    if (!navigator.share) {
      await copyLocation();
      return;
    }
    setSharing(true);
    setFeedback('');
    try {
      await navigator.share({ title: 'My location | Thaai Thadam', text: message });
      setFeedback('Location details passed to your sharing options. Check your chosen app to confirm they were sent.');
    } catch (error) {
      setFeedback(error.name === 'AbortError'
        ? 'Sharing was cancelled. You can try again or copy your location details.'
        : 'Sharing is unavailable right now. Use Copy location details instead.');
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <div className="page-heading">
        <h1>Emergency Help</h1>
        <p>Call for help or share your location with someone you trust.</p>
      </div>
      <div className="emergency-sections">
        <section className="page" aria-labelledby="immediate-help-title">
          <h2 id="immediate-help-title">Immediate help</h2>
          <div className="hub-actions">
            <a className="button button-primary" href={`tel:${emergencyContacts.emergency.number}`}>
              {emergencyContacts.emergency.label}: {emergencyContacts.emergency.number}
            </a>
            <a className="button button-secondary" href={`tel:${emergencyContacts.women.number}`}>
              {emergencyContacts.women.label}: {emergencyContacts.women.number}
            </a>
          </div>
          <p>These links open the phone dialler on supported devices. You choose whether to place the call.</p>
        </section>
        <section className="page" aria-labelledby="my-location-title">
          <h2 id="my-location-title">My location</h2>
          <p>Capture your location once. It stays on this page until you leave or refresh. Sharing sends it only through the app you choose.</p>
          <button className="button button-secondary" onClick={getLocation} disabled={locating || sharing}>
            {locating ? 'Finding your location...' : location ? 'Update my current location' : 'Get my current location'}
          </button>
          <p role="status">{locating ? 'Waiting for your location. Your browser may ask for permission.' : location ? 'Location captured. Check the time and accuracy before sharing.' : ''}</p>
          {locationError && <p className="form-error" role="alert">{locationError}</p>}
          {location && (
            <>
              <dl className="hub-facts">
                <div><dt>Latitude</dt><dd>{location.latitude}</dd></div>
                <div><dt>Longitude</dt><dd>{location.longitude}</dd></div>
                <div><dt>Accuracy</dt><dd>{location.accuracy !== null ? `About ${location.accuracy} metres` : 'Not provided by your device'}</dd></div>
                <div><dt>Time captured</dt><dd><time dateTime={location.capturedAt}>{new Date(location.capturedAt).toLocaleString()}</time></dd></div>
              </dl>
              <p>This is a captured location, not continuous tracking. Update it if you move.</p>
              <div className="hub-actions">
                <button className="button button-primary" onClick={shareLocation} disabled={sharing}>{sharing ? 'Opening sharing options...' : 'Share my location'}</button>
                <button className="button button-secondary" onClick={copyLocation} disabled={sharing}>Copy location details</button>
                <a className="button button-secondary" href={mapUrl} target="_blank" rel="noopener noreferrer">Open location in Google Maps (new tab)</a>
              </div>
              {manualCopy && (
                <div className="field emergency-copy">
                  <label htmlFor="location-message">Location details to copy</label>
                  <textarea id="location-message" ref={copyText} readOnly value={message} rows={7} />
                </div>
              )}
            </>
          )}
          <p role="status">{feedback}</p>
        </section>
        <aside className="page" aria-labelledby="safety-reminder-title">
          <h2 id="safety-reminder-title">Safety reminder</h2>
          <p>Thaai Thadam provides quick access to emergency tools. It does not dispatch emergency responders or send alerts on your behalf.</p>
        </aside>
      </div>
    </>
  );
}
