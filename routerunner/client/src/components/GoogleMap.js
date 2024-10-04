import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'; // Use LoadScriptNext

const mapStyles = {
  width: "100vw", // Full viewport width
  height: "100vh", // Full viewport height
  position: "absolute", // Ensure it covers the entire screen
  top: 0,
  left: 0,
};

// Initial center for the map
const defaultCenter = {
  lat: 1.3418062891738656,
  lng: 103.81035747413657,
};

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [postalCode, setPostalCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  // Create marker on the map at the specified lat, lng
  const createMarker = (lat, lng) => {
    if (mapRef.current && window.google?.maps?.Marker) {
      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
      });
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    } else {
      console.error("Google Maps Marker not available or map not loaded");
    }
  };

  // Handle form submission to create a marker
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Call Geocoding API to get lat/lng from postal code
    const geocodeResult = await geocodePostalCode(postalCode);
    
    if (geocodeResult) {
      const { lat, lng } = geocodeResult;
      createMarker(lat, lng);
      setIsModalOpen(false); // Close the modal after submission
      setPostalCode(''); // Clear postal code after submission
    } else {
      alert('Unable to find location for the given postal code.');
    }
  };

  // Call Google Maps Geocoding API to convert postal code to lat/lng
  const geocodePostalCode = async (postalCode) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address: postalCode });
      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        return {
          lat: location.lat(),
          lng: location.lng(),
        };
      }
    } catch (error) {
      console.error('Error with Geocoding:', error);
    }
    return null;
  };

  // Toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Add custom button to map as a control
  const addButtonToMap = (map) => {
    const buttonDiv = document.createElement('div');
    buttonDiv.innerHTML = '<button>Add Marker by Postal Code</button>';
    buttonDiv.style.margin = '10px';
    buttonDiv.style.padding = '5px';
    buttonDiv.style.backgroundColor = '#fff';
    buttonDiv.style.border = '2px solid #000';
    buttonDiv.style.borderRadius = '4px';
    buttonDiv.style.cursor = 'pointer';

    // Add event listener to the button to open the modal
    buttonDiv.addEventListener('click', toggleModal);

    // Add the button to the map as a control
    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(buttonDiv);
  };

  return (
    <div className="map-container" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          options={{
            mapTypeControl: false, // Disable the map/satellite view toggle
            zoomControl: false, // Disable the zoom in/out buttons
            fullscreenControl: false, // Disable the fullscreen control button
            streetViewControl: false, // Disable the street view control
          }}
          onLoad={(map) => {
            mapRef.current = map;
            addButtonToMap(map); // Add button inside the map
          }}
        />
      </LoadScriptNext>

      {/* Modal for the form */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>X</span>
            <form onSubmit={handleSubmit}>
              <label>
                Postal Code:
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </label>
              <br />
              <button type="submit">Add Marker</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal styling */}
      <style jsx="true">{`
        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
        }

        .modal-content {
          background-color: #fefefe;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
          position: relative;
        }

        .close {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

export default GoogleMapComponent;
