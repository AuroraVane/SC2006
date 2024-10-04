import React, { useState } from 'react';
import CarparkAvailability from './ViewCarparkAvailability';

const RunnerBoard = () => {

    const [showCarpark, setShowCarpark] = useState(false); // State to show/hide carpark data

    const handleCarparkClick = () => {
        setShowCarpark(!showCarpark); // Toggle the carpark availability display
    };

    {/* Button to fetch and show carpark availability */ }
    return <div>
    <button onClick={handleCarparkClick}>
        {showCarpark ? 'Hide Carpark Availability' : 'Show Carpark Availability'}
    </button>

    {/* Conditional rendering: Only show carpark availability when button is clicked */ }
    { showCarpark && <CarparkAvailability /> }
    </div>

};

export default RunnerBoard;