import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Set up the default map style with a dynamic height and width
const mapStyles = {
  width: "100%", // Full width of the container
  height: "500px", // Fixed height for the map
};

const defaultCenter = {
  lat: 1.3418062891738656, // Latitude (San Francisco example)
  lng: 103.81035747413657 // Longitude (San Francisco example)
};

const GoogleMapComponent = () => {

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
        >
          <Marker position={defaultCenter} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
