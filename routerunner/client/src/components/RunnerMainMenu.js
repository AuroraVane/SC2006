import React, { useState } from 'react';
import CarparkAvailability from './ViewCarparkAvailability';
import GoogleMapComponent from './GoogleMap';

// Import FontAwesomeIcon and car icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

const RunnerBoard = () => {
    const [showCarpark, setShowCarpark] = useState(false); // State to show/hide carpark data

    const handleCarparkClick = () => {
        setShowCarpark(!showCarpark); // Toggle the carpark availability display
    };

    const closeModal = () => {
        setShowCarpark(false); // Close the carpark modal
    };

    return (
        <div>
            <GoogleMapComponent />
            {/* Button with car icon styled like the example */}
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
                        onClick={closeModal}
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
