import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GoogleMapComponent from './GoogleMap';

const OperatorMainMenu = () => {
  const mapRef = useRef(null); // Reference to the Google Map instance
  const [postalCode, setPostalCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRunners, setActiveRunners] = useState([]);

  // Fetch active runners from the backend
  useEffect(() => {
    const fetchActiveRunners = async () => {
      try {
        const response = await axios.get('/api/activerunner');
        setActiveRunners(response.data);
      } catch (error) {
        console.error('Error fetching active runners:', error);
      }
    };

    fetchActiveRunners();
  }, []);

  const createMarker = (lat, lng) => {
    if (mapRef.current && window.google?.maps?.Marker) {
      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current, // Make sure we are passing the correct map instance
      });
    } else {
      console.error("Google Maps Marker not available or map not loaded");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const geocodeResult = await geocodePostalCode(postalCode);

    if (geocodeResult) {
      const { lat, lng } = geocodeResult;
      createMarker(lat, lng);
      setIsModalOpen(false);
      setPostalCode('');
    } else {
      alert('Unable to find location for the given postal code.');
    }
  };

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Render the Google Map Component and pass the map reference */}
      <GoogleMapComponent mapRef={mapRef} />

      {/* Button to open modal for adding marker */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
      }}>
        <button onClick={toggleModal} style={{
          padding: '10px',
          backgroundColor: '#fff',
          border: '2px solid #000',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add Marker by Postal Code
        </button>
      </div>

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

      {/* Active Runners Container */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        padding: '10px',
        width: '300px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h3>Active Runners</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {activeRunners.map((runner, index) => (
            <li key={runner._id} style={{
              margin: '10px 0',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '5px',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            }}>
              {index + 1}: {runner.username} ({runner.email})
            </li>
          ))}
        </ul>
      </div>

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

export default OperatorMainMenu;
