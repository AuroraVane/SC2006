import React, { useState, useRef, useEffect } from 'react';
import CarparkAvailability from './ViewCarparkAvailability';
import GoogleMapComponent from './GoogleMap';
import { parseJwt } from '../utils/jwtUtils';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

const RunnerBoard = () => {
    const mapRef = useRef(null);
    const directionsRendererRef = useRef(null); // For route rendering
    const token = localStorage.getItem('token');
    const decodedtoken = token ? parseJwt(token) : null;
    const [lastlocation, setLastLocation] = useState('');
    const [newlocation, setNewLocation] = useState('');
    const [showCarpark, setShowCarpark] = useState(false); // State to show/hide carpark data

    // Function to handle carpark button click
    const handleCarparkClick = () => {
        setShowCarpark(!showCarpark); // Toggle the carpark modal visibility
    };

    // Function to close the carpark modal
    const closeModal = () => {
        setShowCarpark(false); // Set the modal visibility to false
    };

    // Geocoding function
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

    // const createMarker = (lat, lng) => {
    //     if (mapRef.current && window.google?.maps?.Marker) {
    //         new window.google.maps.Marker({
    //             position: { lat, lng },
    //             map: mapRef.current,
    //         });
    //     } else {
    //         console.error('Google Maps Marker not available or map not loaded');
    //     }
    // };

    // Function to display the route
    const displayRoute = (start, end) => {
        if (window.google?.maps?.DirectionsService && window.google?.maps?.DirectionsRenderer) {
            const directionsService = new window.google.maps.DirectionsService();
            if (!directionsRendererRef.current) {
                directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
                directionsRendererRef.current.setMap(mapRef.current);
            }

            directionsService.route(
                {
                    origin: start,
                    destination: end,
                    travelMode: window.google.maps.TravelMode.DRIVING, // Set the travel mode (Driving, Walking, etc.)
                },
                (result, status) => {
                    if (status === 'OK') {
                        directionsRendererRef.current.setDirections(result);
                    } else {
                        console.error('Error fetching directions:', status);
                    }
                }
            );
        } else {
            console.error('Google Maps Directions Service not available');
        }
    };

    const handleCompletedJob = async () => {
        try {
            const response = await axios.get('/api/user/jobCompleted', {
                params:{
                    username: decodedtoken.username,
                }
            });
            setLastLocation(newlocation);
<<<<<<< HEAD
            setNewLocation(response.results[0].postalCode);
=======
            console.log('Job completed:', String(response.data.postalCode));
            setNewLocation(String(response.data.postalCode));
>>>>>>> RunnerMainMenu
        } catch (error) {
            console.error('Error fetching new Job:', error);
        }
    }

    useEffect(() => {
        const fetchNewLocation = async () => {
            try {
                const response = await axios.get('/api/user/location', { params: { username: decodedtoken.username } });
                setLastLocation(response.data.lastlocation); // This will trigger re-render
                setNewLocation(response.data.newlocation); // This will trigger re-render
            } catch (error) {
                console.error('Error fetching active runners:', error);
            }
        };
        fetchNewLocation(); // Start fetching new location
    }, []); // Empty dependency array ensures this runs once on mount

    useEffect(() => {
        const handleRouting = async () => {
            if (lastlocation && newlocation) {
                try {
                    const lastLoc = await geocodePostalCode(lastlocation);
                    const newLoc = await geocodePostalCode(newlocation);
        
                    if (lastLoc && newLoc) {
                        // createMarker(lastLoc.lat, lastLoc.lng);
                        // createMarker(newLoc.lat, newLoc.lng);
                        displayRoute(lastLoc, newLoc);
                    }
                } catch (error) {
                    console.error("Error during geocoding:", error);
                }
            }
        };
        handleRouting(); // Call the routing logic after locations are available
    }, [lastlocation, newlocation]); // Trigger when lastlocation or newlocation changes

    return (
        <div>
            <GoogleMapComponent mapRef={mapRef} />
            <div style={{
                position: 'absolute',
                bottom: '90px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                }}>
                </span>
                <button
                    onClick={handleCompletedJob} // Corrected the syntax for the onClick handler
                    style={{
                        fontSize: '24px',
                        background: '#f0f0f0', // Light grey background
                        border: '2px solid #ccc', // Add a visible border
                        borderRadius: '8px', // Use a smaller border radius for a rectangular button
                        padding: '10px 20px', // Adjust padding for a more rectangular shape
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        width: '100%', // Make button full width
                    }}>
                    <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                    }}>
                    Completed Job
                    </span>
                </button>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                }}>
                    View Carpark
                </span>
                <button
                    onClick={handleCarparkClick}
                    style={{
                        fontSize: '24px',
                        background: '#f0f0f0', // Light grey background
                        border: '2px solid #ccc', // Add a visible border
                        borderRadius: '50%', // Make it circular
                        padding: '10px', // Add padding around the icon
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    <FontAwesomeIcon icon={faCar} style={{ color: 'black' }} /> {/* Car icon */}
                </button>
            </div>

            {/* Modal for carpark availability */}
            {showCarpark && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 999,
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                    width: '400px',
                    textAlign: 'center',
                }}>
                    <button
                        onClick={closeModal} // Added closeModal here
                        style={{
                            position: 'absolute',
                            top: '-10px', // Move slightly above the modal for visibility
                            right: '-10px', // Move to the right
                            fontSize: '24px',
                            background: '#f44336', // Red background for visibility
                            color: '#fff', // White text
                            border: 'none',
                            borderRadius: '50%',
                            width: '35px',
                            height: '35px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        X
                    </button>
                    <CarparkAvailability />
                </div>
            )}

            {/* Background overlay when modal is open */}
            {showCarpark && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 998,
                }} />
            )}
        </div>
    );
};

export default RunnerBoard;
