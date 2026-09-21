import { useEffect, useRef, useState } from 'react';

// One request per button press. Coordinates never leave this hook for storage or API calls.
export default function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(0);
  useEffect(() => () => { request.current += 1; }, []);

  function clearLocation() {
    request.current += 1;
    setLocation(null);
    setPending(false);
    setError('');
  }

  function getLocation(onSuccess) {
    const currentRequest = ++request.current;
    setLocation(null);
    setError('');
    if (!navigator.geolocation) {
      setError('This browser cannot get your location. You can still choose an area manually.');
      return;
    }
    setPending(true);
    function failed(reason) {
      if (currentRequest !== request.current) return;
      setPending(false);
      const messages = {
        1: 'Location permission was denied. Allow it in browser settings or choose an area manually.',
        2: 'Your location is unavailable. Check location services or choose an area manually.',
        3: 'Finding your location took too long. Try again or choose an area manually.',
      };
      setError(messages[reason?.code] || 'We could not get your location. Try again or choose an area manually.');
    }
    try {
      navigator.geolocation.getCurrentPosition(position => {
        if (currentRequest !== request.current) return;
        const { latitude, longitude, accuracy } = position.coords;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) { failed(); return; }
        const captured = { latitude, longitude, accuracy, capturedAt: position.timestamp };
        setLocation(captured);
        setPending(false);
        onSuccess?.(captured);
      }, failed, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    } catch { failed(); }
  }
  return { location, pending, error, getLocation, clearLocation };
}
