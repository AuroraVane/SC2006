
import React, {useState,useEffect} from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Set up the default map style with a dynamic height and width
const mapStyles = {
  width: "100%", // Full width of the container
  height: "100%", // Full height of the container
};

const defaultCenter = {
  lat: 37.7749, // Latitude (San Francisco example)
  lng: -122.4194 // Longitude (San Francisco example)
};

const GoogleMapComponent = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Fetch the API key from the backend
    const fetchApiKey = async () => {
      try {
        const response = await axios.get('/api/maps-api-key');
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error('Error fetching Google Maps API Key:', error);
      }
    };
    fetchApiKey();
  }, []);

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

