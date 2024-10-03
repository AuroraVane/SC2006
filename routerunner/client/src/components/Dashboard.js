import React,{useState} from 'react';
import GoogleMapComponent from './GoogleMap';
import CarparkAvailability from './CarparkAvailability';
const Dashboard = () => {
  const [showCarpark, setShowCarpark] = useState(false); // State to show/hide carpark data

  const handleCarparkClick = () => {
    setShowCarpark(!showCarpark); // Toggle the carpark availability display
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Google Map component */}
      <GoogleMapComponent />
      {/* Button to fetch and show carpark availability */}
      <button onClick={handleCarparkClick}>
        {showCarpark ? 'Hide Carpark Availability' : 'Show Carpark Availability'}
      </button>
      
      {/* Conditional rendering: Only show carpark availability when button is clicked */}
      {showCarpark && <CarparkAvailability />}
    </div>
  );
};

export default Dashboard;
