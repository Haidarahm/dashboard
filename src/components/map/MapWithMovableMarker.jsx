import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useRef } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import SearchControl from "./SearchControl";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ClickHandler = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapWithMovableMarker = ({
  position = [34.6402, 39.0494],
  setPosition,
}) => {
  const initialCenter = useRef(position);
  return (
    <MapContainer
      center={initialCenter.current}
      zoom={7}
      style={{ height: "300px", width: "100%", borderRadius: 12, marginTop: 8 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      <SearchControl setPosition={setPosition} />
      <ClickHandler setPosition={setPosition} />
      <Marker position={position}>
        <Popup>
          Current Position: <br /> {position[0].toFixed(4)},{" "}
          {position[1].toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapWithMovableMarker;
