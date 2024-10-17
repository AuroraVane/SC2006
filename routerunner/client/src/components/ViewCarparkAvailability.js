import React, { useState } from 'react';
import axios from 'axios';

const ViewCarparkAvailability = () => {
    const [carparkData, setCarparkData] = useState(null);
    const [carparkAddress, setCarparkAddress] = useState(''); // State for input address
    const [foundCarparkNumber, setFoundCarparkNumber] = useState(null); // Store the carpark number from /api/carpark
    const [selectedCarpark, setSelectedCarpark] = useState(null); // State to store the selected carpark's data
    const [loading, setLoading] = useState(false);

    // Combined function to search carpark number by address and fetch availability
    const searchAndFetchAvailability = async () => {
        if (!carparkAddress) {
            return; // If no address is provided, exit early
        }
    
        setLoading(true);
        try {
            // Step 1: Fetch carpark number by address
            const responseCarpark = await axios.get('/api/carpark', {
                params: { address: carparkAddress }
            });
            const carparkNumber = responseCarpark.data.car_park_no; // Store the car_park_no
            setFoundCarparkNumber(carparkNumber);
            
            // Step 2: Fetch carpark availability by carpark number
            const responseAvailability = await axios.get('/api/carpark-availability');
            const carparkData = responseAvailability.data.items[0].carpark_data;
    
            // Find the carpark availability for the fetched carpark number
            const foundCarpark = carparkData.find(carpark => carpark.carpark_number.trim().toLowerCase() === carparkNumber.trim().toLowerCase());
    
            if (foundCarpark) {
                setSelectedCarpark(foundCarpark); // Set the found carpark
            } else {
                setSelectedCarpark(null); // If not found, reset
            }
        } catch (error) {
            setSelectedCarpark(null); // Reset if error occurs
        } finally {
            setLoading(false); // Set loading to false after request is done
        }
    };

    return (
        <div>

            <h1>Carpark Availability</h1>

            {/* Input for Carpark Address */}
            <div style={{ marginTop: '20px' }}>
                <label htmlFor="carparkAddress">Enter Carpark Address: </label>
                <input 
                    type="text" 
                    id="carparkAddress" 
                    value={carparkAddress} 
                    onChange={(e) => setCarparkAddress(e.target.value)} 
                />
                <button onClick={searchAndFetchAvailability} disabled={loading}>
                    {loading ? 'Loading...' : 'Search and Fetch Availability'}
                </button>
            </div>

            {/* Display the car_park_no result */}
            {foundCarparkNumber && !loading && (
                <div>
                    <h3>Carpark Found</h3>
                    <p>Carpark Number: {foundCarparkNumber}</p>
                </div>
            )}

            {/* Display the selected carpark's availability or loading state */}
            {loading ? (
                <p>Loading...</p> 
            ) : selectedCarpark ? (
                <div>
                    <h3>Carpark Information</h3>
                    <p>Carpark Number: {selectedCarpark.carpark_number}</p>
                    <p>Last Updated: {selectedCarpark.update_datetime}</p>
                    <p>Capacity: {selectedCarpark.carpark_info?.[0]?.lots_available || 'N/A'}</p> {/* Accessing the first element in carpark_info for capacity */}
                </div>
            ) : foundCarparkNumber && (
                <p>No availability found for carpark number: {foundCarparkNumber}</p>
            )}
        </div>
    );
};

export default ViewCarparkAvailability;
