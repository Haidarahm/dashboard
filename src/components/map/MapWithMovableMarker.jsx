import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import SearchControl from './SearchControl';

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Click-to-move marker
const ClickHandler = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

const MapWithMovableMarker = () => {
  const [position, setPosition] = useState([34.6402, 39.0494]);

  return (
    <MapContainer center={position} zoom={7} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      <SearchControl setPosition={setPosition} />
      <ClickHandler setPosition={setPosition} />
      <Marker position={position}>
        <Popup>
          Current Position: <br /> {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapWithMovableMarker;
