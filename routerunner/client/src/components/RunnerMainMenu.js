import React, { useState } from 'react';
import CarparkAvailability from './ViewCarparkAvailability';

// Import FontAwesomeIcon and car icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

const RunnerBoard = () => {
    const [showCarpark, setShowCarpark] = useState(false); // State to show/hide carpark data

    const handleCarparkClick = () => {
        setShowCarpark(!showCarpark); // Toggle the carpark availability display
    };

    return (
        <div>
            {/* Button with car icon */}
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

            {/* Conditional rendering: Only show carpark availability when button is clicked */}
            {showCarpark && <CarparkAvailability />}
        </div>
    );
};

export default RunnerBoard;
