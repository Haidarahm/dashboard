import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useRef, useMemo, Suspense, useState } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import SearchControl from "./SearchControl";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

const ClickHandler = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

// Error boundary component
const MapErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        style={{
          height: "300px",
          width: "100%",
          borderRadius: 12,
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          border: "1px solid #d9d9d9",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p>Map failed to load. Please refresh the page.</p>
          <button
            onClick={() => setHasError(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1890ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "300px",
            width: "100%",
            borderRadius: 12,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <div>Loading map...</div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

const MapWithMovableMarker = ({
  position = [34.6402, 39.0494],
  setPosition,
}) => {
  const initialCenter = useRef(position);

  // Move the marker icon setup inside the component
  useMemo(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  return (
    <MapErrorBoundary>
      <MapContainer
        center={initialCenter.current}
        zoom={7}
        style={{
          height: "300px",
          width: "100%",
          borderRadius: 12,
          marginTop: 8,
        }}
        // Add performance optimizations
        preferCanvas={true}
        zoomControl={true}
        attributionControl={true}
        // Add loading optimizations
        loading="lazy"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          // Add tile loading optimizations
          maxZoom={18}
          minZoom={2}
          updateWhenZooming={false}
          updateWhenIdle={true}
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
    </MapErrorBoundary>
  );
};

export default MapWithMovableMarker;
