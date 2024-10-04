import React, { useState } from 'react';
import axios from 'axios';

const ViewCarparkAvailability = () => {
    const [carparkData, setCarparkData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCarparkAvailability = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/carpark-availability');
      setCarparkData(response.data);
    } catch (error) {
      console.error('Error fetching carpark availability:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
    <h1>Carpark Availability</h1>
      <button onClick={fetchCarparkAvailability} disabled={loading}>
        {loading ? 'Loading...' : 'Check Availability'}
      </button>
      {carparkData && (
        <div>
          <h2>Data Retrieved:</h2>
          <pre>{JSON.stringify(carparkData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
};

export default ViewCarparkAvailability;