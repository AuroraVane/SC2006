import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GoogleMapComponent from './GoogleMap';

const OperatorMainMenu = () => {
  const mapRef = useRef(null); // Reference to the Google Map instance
  const [activeRunners, setActiveRunners] = useState([]);
  const [runnerLocations, setRunnerLocations] = useState([]);

  // Function to create markers on the map with different colors
  const createMarker = (lat, lng, color) => {
    if (mapRef.current && window.google?.maps?.Marker) {
      new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current, // Make sure we are passing the correct map instance
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png` // Set the color for the marker
        }
      });
    } else {
      console.error('Google Maps Marker not available or map not loaded');
    }
  };

  // Function to geocode postal codes into lat/lng
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

  // Fetch active runners and their locations
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

  // Geocode postal codes and create markers
  useEffect(() => {
    const createMarkersForLocations = async () => {
      const colors = ['red', 'blue', 'green', 'purple', 'yellow']; // Define a set of colors
      for (const [index, runner] of runnerLocations.entries()) {
        const lastLoc = await geocodePostalCode(runner.lastlocation);
        const newLoc = await geocodePostalCode(runner.newlocation);
        const color = colors[index % colors.length]; // Cycle through colors

        if (lastLoc) {
          createMarker(lastLoc.lat, lastLoc.lng, color); // Create marker for last location with color
        }
        if (newLoc) {
          createMarker(newLoc.lat, newLoc.lng, color); // Create marker for new location with color
        }
      }
    };

    if (runnerLocations.length > 0) {
      createMarkersForLocations(); // Create markers for all runners
    }
  }, [runnerLocations]); // Runs when runnerLocations is updated
  //viewrunner/:username
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
        <ul style={{ listStyleType: 'none', padding: 0, }}>
          {activeRunners.map((runner, index) => (
            <><button 
              onClick = {() => { window.location.href = `/viewrunner/${runner.username}`}}
              style={{
                margin: '7px 0',
                display: 'flex',               // Flexbox for alignment
                alignItems: 'center',           // Center content vertically
                justifyContent: 'center',       // Center content horizontally
                width: '100%',                  // Full width
                padding: '15px 10px',           // Padding for spacing
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                border: 'none',                 // Remove border
                cursor: 'pointer',              // Pointer cursor
                textAlign: 'center',            // Center text inside
                fontSize: '16px',               // Font size for readability
                color: '#333'  , 
            }}>{runner.username}: {runner.lastlocation}</button></>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OperatorMainMenu;
