import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'; 
import axios from 'axios'; // Ensure axios is imported

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

const Dashboard = () => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [postalCode, setPostalCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRunners, setActiveRunners] = useState([]); // State for active runners

  // Fetch active runners from the API when the component loads
  useEffect(() => {
    const fetchActiveRunners = async () => {
      try {
        const response = await axios.get('/api/activerunner');
        setActiveRunners(response.data); // Store active runners in state
      } catch (error) {
        console.error('Error fetching active runners:', error);
      }
    };

    fetchActiveRunners();
  }, []); // Empty dependency array means it runs once when the component mounts

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

  const addButtonToMap = (map) => {
    const buttonDiv = document.createElement('div');
    buttonDiv.innerHTML = '<button>Add Marker by Postal Code</button>';
    buttonDiv.style.margin = '10px';
    buttonDiv.style.padding = '5px';
    buttonDiv.style.backgroundColor = '#fff';
    buttonDiv.style.border = '2px solid #000';
    buttonDiv.style.borderRadius = '4px';
    buttonDiv.style.cursor = 'pointer';

    buttonDiv.addEventListener('click', toggleModal);

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
            mapTypeControl: false,
            zoomControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          }}
          onLoad={(map) => {
            mapRef.current = map;
            addButtonToMap(map);
          }}
        />
      </LoadScriptNext>

      {/* Active Runner List at the bottom */}
      <div className="active-runner-container">
        <h3>Active Runner</h3>
        <div className="runner-list">
          {activeRunners.map((runner, index) => (
            <div key={index} className="runner-item">
              <span>{runner.username} </span>
            </div>
          ))}
        </div>
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

        /* Active Runner Box Styles */
        .active-runner-container {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          background-color: #f8f8f8;
          border: 2px solid #ccc;
          border-radius: 12px;
          padding: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .runner-list {
          max-height: 150px;
          overflow-y: auto;
        }

        .runner-item {
          background-color: #ffffff;
          margin: 5px 0;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
