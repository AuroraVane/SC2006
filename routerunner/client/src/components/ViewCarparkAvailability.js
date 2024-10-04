import React, { useState } from 'react';
import axios from 'axios';

const ViewCarparkAvailability = () => {
    const [carparkData, setCarparkData] = useState(null);
    const [carparkNumber, setCarparkNumber] = useState(''); // State to store the input carpark number
    const [selectedCarpark, setSelectedCarpark] = useState(null); // State to store the selected carpark's data
    const [loading, setLoading] = useState(false);
    const [showAvailability, setShowAvailability] = useState(false); // Toggle for show/hide

    // Fetch carpark data when the button is clicked
    const fetchCarparkAvailability = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/carpark-availability');
            setCarparkData(response.data.items[0].carpark_data); // Access the nested carpark_data
            console.log('Fetched Carpark Data:', response.data.items[0].carpark_data); // Log data to understand its structure
        } catch (error) {
            console.error('Error fetching carpark availability:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search for a specific carpark by its number
    const handleSearch = () => {
        if (carparkData && Array.isArray(carparkData)) {
            const foundCarpark = carparkData.find(carpark => carpark.carpark_number === carparkNumber);
            console.log('Found Carpark:', foundCarpark); // Log the found carpark for debugging
            setSelectedCarpark(foundCarpark || null); // Set the found carpark or null if not found
        }
    };

    const handleToggleAvailability = async () => {
        if (!carparkData) {
            await fetchCarparkAvailability();
        }
        setShowAvailability(!showAvailability);
    };

    return (
        <div>
            <h1>Carpark Availability</h1>

            {/* Input for Carpark Number */}
            <div>
                <label htmlFor="carparkNumber">Enter Carpark Number: </label>
                <input 
                    type="text" 
                    id="carparkNumber" 
                    value={carparkNumber} 
                    onChange={(e) => setCarparkNumber(e.target.value)} 
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Display the selected carpark's information */}
            {selectedCarpark ? (
                <div>
                    <h3>Carpark Information</h3>
                    <p>Carpark Number: {selectedCarpark.carpark_number}</p>
                    <p>Last Updated: {selectedCarpark.update_datetime}</p>
                    <p>Capacity: {selectedCarpark.carpark_info?.[0]?.lots_available || 'N/A'}</p> {/* Accessing the first element in carpark_info for capacity */}
                </div>
            ) : carparkNumber && (
                <p>No carpark found with number: {carparkNumber}</p>
            )}

            {/* Toggle button to show/hide carpark availability */}
            <button onClick={handleToggleAvailability} disabled={loading}>
                {loading ? 'Loading...' : showAvailability ? 'Hide Carpark Availability' : 'Show Carpark Availability'}
            </button>

            {/* Scrollable container for carpark data */}
            {showAvailability && carparkData && Array.isArray(carparkData) && (
                <div style={{ maxHeight: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
                    <h2>Carpark List</h2>
                    <ul>
                        {carparkData.map(carpark => (
                            <li key={carpark.carpark_number}>
                                <strong>Carpark Number:</strong> {carpark.carpark_number}, 
                                <strong>Last Updated:</strong> {carpark.update_datetime}, 
                                <strong>Capacity:</strong> {carpark.carpark_info?.[0]?.lots_available || 'N/A'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ViewCarparkAvailability;
