import React, { useRef } from 'react';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';

const mapStyles = {
  width: "100vw",
  height: "100vh",
  position: "absolute",
  top: 0,
  left: 0,
};

const defaultCenter = {
  lat: 1.3418062891738656,
  lng: 103.81035747413657,
};

const GoogleMapComponent = ({ mapRef }) => {
  // If no mapRef is passed, create a local reference
  const localMapRef = useRef(null);
  const reference = mapRef || localMapRef; // Use mapRef if provided, else use local reference

  return (
    <div className="map-container" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          options={{
            mapTypeControl: false,
            zoomControl: true,
            fullscreenControl: false,
            streetViewControl: false,
          }}
          onLoad={(map) => {
            reference.current = map; // Set the reference to the map, either local or from props
          }}
        />
      </LoadScriptNext>
    </div>
  );
};

export default GoogleMapComponent;
