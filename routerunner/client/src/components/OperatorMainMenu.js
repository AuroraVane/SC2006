import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GoogleMapComponent from './GoogleMap';

const OperatorMainMenu = () => {
  const mapRef = useRef(null);
  const [activeRunners, setActiveRunners] = useState([]);
  const [runnerLocations, setRunnerLocations] = useState([]);
  const [runnerLocationsAddress, setRunnerLocationsAddress] = useState([]);

  // Function to create markers on the map with different colors and labels positioned above the marker
  const createMarker = (lat, lng, color, label) => {
    if (mapRef.current && window.google?.maps?.Marker) {
      new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
          labelOrigin: new window.google.maps.Point(5, -5), // Position label above the marker
        },
        label: {
          text: label,
          color: '#000',
          fontWeight: 'bold',
          fontSize: '12px',
        },
      });
    } else {
      console.error('Google Maps Marker not available or map not loaded');
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

  useEffect(() => {
    const fetchRunnerLocations = async () => {
      try {
        const locationPromises = activeRunners.map(async (runner) => {
          const response = await axios.get('/api/user/location', { params: { username: runner.username } });
          return {
            username: runner.username,
            lastlocation: response.data.lastlocation,
            newlocation: response.data.newlocation,
          };
        });

        const locations = await Promise.all(locationPromises);
        setRunnerLocations(locations);
        
      } catch (error) {
        console.error('Error fetching runner locations:', error);
      }
    };

    if (activeRunners.length > 0) {
      fetchRunnerLocations();
    }
  }, [activeRunners]);

  useEffect(() => {
    const fetchRunnerLocationsAddress = async () => {
      try {
        const locationPromises = activeRunners.map(async (runner) => {
          const response = await axios.get("https://www.onemap.gov.sg/api/common/elastic/search", {
            params: {
              searchVal: runner.lastlocation,
              returnGeom: 'Y',
              getAddrDetails: 'Y',
              pageNum: 1
            },
          });
          return {
            username: runner.username,
            lastlocation: response.data.results[0]["ROAD_NAME"],
          };
        });

        const resolveLocations = await Promise.all(locationPromises);
        setRunnerLocationsAddress(resolveLocations);
      } catch (error) {
        console.error('Error fetching runner locations:', error);
      }
    };
    fetchRunnerLocationsAddress();
  }, [activeRunners]);

  useEffect(() => {
    const createMarkersForLocations = async () => {
      const colors = ['red', 'blue', 'green', 'purple', 'yellow'];
      for (const [index, runner] of runnerLocations.entries()) {
        const lastLoc = await geocodePostalCode(runner.lastlocation);
        const newLoc = await geocodePostalCode(runner.newlocation);
        const color = colors[index % colors.length];

        if (lastLoc) {
          createMarker(lastLoc.lat, lastLoc.lng, color, "Last Location");
        }
        if (newLoc) {
          createMarker(newLoc.lat, newLoc.lng, color, "Current Destination");
        }
      }
    };

    if (runnerLocations.length > 0) {
      createMarkersForLocations();
    }
  }, [runnerLocations]);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Render the Google Map Component and pass the map reference */}
      <GoogleMapComponent mapRef={mapRef} />

      {/* Active Runners List */}
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
            <button 
              onClick={() => { window.location.href = `/viewrunner/${runner.username}` }}
              style={{
                margin: '7px 0',
                display: 'flex',              
                alignItems: 'center',         
                justifyContent: 'center',      
                width: '100%',                
                padding: '15px 10px',         
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                border: 'none',               
                cursor: 'pointer',            
                textAlign: 'center',          
                fontSize: '16px',             
                color: '#333', 
            }}>
              {runner.username}: {runnerLocationsAddress[index]?.lastlocation || 'Loading...'}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OperatorMainMenu;
