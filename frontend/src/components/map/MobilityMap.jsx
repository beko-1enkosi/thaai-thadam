import { useEffect, useState } from 'react';
import { divIcon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Link } from 'react-router';

const center = [10.815, 78.69];
const icon = (label, selected = false) => divIcon({
  className: `mobility-marker${selected ? ' is-selected' : ''}`,
  html: label,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});
const hubIcon = icon('H');
const selectedHubIcon = icon('H', true);
const startIcon = icon('S');
const destinationIcon = icon('D');
const currentIcon = icon('You');

function MapView({ boundsKey }) {
  const map = useMap();
  useEffect(() => {
    const points = JSON.parse(boundsKey);
    if (points.length) map.fitBounds(points, { padding: [40, 40], maxZoom: 15, animate: false });
    else map.setView(center, 12, { animate: false });
  }, [map, boundsKey]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export default function MobilityMap({ hubs = [], selectedHubId, onSelectHub, currentLocation, route, start, destination }) {
  const [tilesLoading, setTilesLoading] = useState(true);
  const [tileError, setTileError] = useState(false);
  const selectedHub = hubs.find(hub => hub.id === selectedHubId);
  const points = selectedHub
    ? [[selectedHub.latitude, selectedHub.longitude]]
    : [...hubs.map(hub => [hub.latitude, hub.longitude]), ...(route?.geometry || []),
       ...(start ? [start.coordinates] : []), ...(destination ? [destination.coordinates] : []),
       ...(currentLocation ? [[currentLocation.latitude, currentLocation.longitude]] : [])];
  return (
    <>
      <div className="map-frame">
      {tilesLoading && <div className="map-loading" role="status"><span className="skeleton skeleton-map" aria-hidden="true" /><span>Loading map tiles...</span></div>}
      <MapContainer className="mobility-map" center={center} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          eventHandlers={{ loading: () => setTilesLoading(true), load: () => setTilesLoading(false), tileerror: () => { setTileError(true); setTilesLoading(false); } }}
        />
        <MapView boundsKey={JSON.stringify(points)} />
        {route && <Polyline positions={route.geometry} pathOptions={{ color: '#b64032', weight: 5 }}><Popup>{route.name}</Popup></Polyline>}
        {hubs.map(hub => (
          <Marker key={hub.id} position={[hub.latitude, hub.longitude]} icon={hub.id === selectedHubId ? selectedHubIcon : hubIcon}
            title={`${hub.name}${hub.id === selectedHubId ? ' (selected)' : ''}`} alt={hub.name}
            eventHandlers={onSelectHub ? { click: () => onSelectHub(hub) } : undefined}>
            <Popup><strong>{hub.name}</strong><p>{hub.area}</p>
              {onSelectHub ? <button type="button" onClick={() => onSelectHub(hub)}>View hub details</button>
                : <Link to={`/safe-hubs?hub=${hub.id}`}>View hub details</Link>}
            </Popup>
          </Marker>
        ))}
        {start && <Marker position={start.coordinates} icon={startIcon} title={`Route start: ${start.name}`}><Popup>Route start: {start.name}</Popup></Marker>}
        {destination && <Marker position={destination.coordinates} icon={destinationIcon} title={`Destination: ${destination.name}`}><Popup>Destination: {destination.name}</Popup></Marker>}
        {currentLocation && <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={currentIcon} title="Your captured location"><Popup>Your captured location. This is not continuous tracking.</Popup></Marker>}
      </MapContainer>
      </div>
      {tileError && <p role="status">Some map tiles could not load. Check your connection. The list and details are still available.</p>}
      <p className="field-help">H: Hub. S: Route start. D: Destination. You: Captured location. Use the lists to select hubs and routes without the map.</p>
    </>
  );
}
