// SearchControl.jsx
import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const SearchControl = ({ setPosition }) => {
  const map = useMap();
  const searchControlRef = useRef(null);
  const providerRef = useRef(null);

  // Memoize the event handler to prevent unnecessary re-renders
  const handleGeosearchResult = useCallback(
    (result) => {
      const { x: lng, y: lat } = result.location;
      setPosition([lat, lng]);
      map.setView([lat, lng], 13);
    },
    [map, setPosition]
  );

  useEffect(() => {
    // Create provider only once
    if (!providerRef.current) {
      providerRef.current = new OpenStreetMapProvider();
    }

    // Create search control only once
    if (!searchControlRef.current) {
      searchControlRef.current = new GeoSearchControl({
        provider: providerRef.current,
        style: "bar",
        showMarker: false,
        showPopup: false,
        autoClose: true,
        keepResult: true,
        // Add performance options
        animateZoom: true,
        autoComplete: true,
        autoCompleteDelay: 250,
        showPopup: false,
        retainZoomLevel: false,
        draggable: false,
      });
    }

    // Add control to map
    map.addControl(searchControlRef.current);

    // Add event listener
    map.on("geosearch/showlocation", handleGeosearchResult);

    // Cleanup function
    return () => {
      if (searchControlRef.current) {
        map.removeControl(searchControlRef.current);
        searchControlRef.current = null;
      }
      map.off("geosearch/showlocation", handleGeosearchResult);
    };
  }, [map, handleGeosearchResult]);

  return null;
};

export default SearchControl;
