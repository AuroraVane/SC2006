// components/ViewRunner.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { deleteUser, sendPasswordResetEmail,getAuth } from 'firebase/auth';
import GoogleMapComponent from './GoogleMap';

const ViewRunner = () => {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const { runnerId } = useParams(); // Get runnerId from the URL
  const [runnerData, setRunnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newLocation, setNewLocation] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [newLocationAddress,setNewLocationAddress] = useState('');
  const [lastLocationAddress,setLastLocationAddress] = useState('');
  const { username } = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchNewLocation = async () => {
      try {
        const response = await axios.get('/api/user/location', { params: { username: username } });
        setNewLocation(response.data.newlocation);
        setLastLocation(response.data.lastlocation);
      } catch (error) {
        console.error('Error fetching new location:', error);
      }
    };
    
    fetchNewLocation();
  }, []);

  useEffect(()=>{
    //fetch address based on postal code
    const fetchAddressFromPostalCode = async(postalCode)=>{
      try{
        const response = await axios.get("https://www.onemap.gov.sg/api/common/elastic/search", {
          params:{
            searchVal: postalCode,
            returnGeom: 'N',
            getAddrDetails: 'Y',
            pageNum: 1
          },
        });

        const results = response.data.results;
        if (results && results.length > 0) {
          return `${results[0].BLK_NO} ${results[0].ROAD_NAME}`;
        }
        return 'Address not found';
      }catch(error){
        console.error('Error fetching address:',error);
        return 'Error fetching address';
      }
    };
    // fetch address for both lastLocation and newLocation
    const fetchAddresses = async () => {
      if (lastLocation){
        const address = await fetchAddressFromPostalCode(lastLocation);
        setLastLocationAddress(address);
      }
      if (newLocation){
        const address = await fetchAddressFromPostalCode(newLocation);
        setNewLocationAddress(address);
      }
      setLoading(false);
    };
    fetchAddresses();
  },[newLocation, lastLocation]);

  useEffect(() => {
    // Temporary runner data for testing
    const tempRunnerData = {
      username: username,
      lastLocation: lastLocationAddress,
      currentDestination: newLocationAddress,
    };

    const fetchRunnerData = async () => {
      try {
        // Uncomment this line when using the actual API
        // const response = await axios.get(`/api/runners/${runnerId}`);
        // setRunnerData(response.data);
        // For now, set the temporary data
        setRunnerData(tempRunnerData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching runner data:', error);
        setLoading(false);
      }
    };

    fetchRunnerData();
  }, [newLocationAddress, lastLocationAddress, username]);

  const handleDeleteRunner = async () => {
    try {
      await axios.delete(`/api/runners/deleteuser`, { params: { username: username } });
      navigate('/mngrnr');
    } catch (error) {
      console.error('Error deleting runner:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.get(`/api/user/email`, { params: { username: username } });
      await sendPasswordResetEmail(auth, response.data.email);
      alert('Reset password email sent!');
    } catch (error) {
      console.error('Error sending reset password email:', error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!runnerData) {
    return <div>No runner data found</div>;
  }

  return (
    <div>
      <GoogleMapComponent mapRef={mapRef} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          maxWidth: "500px"
        }}
      >
    <div className="view-runner-container">
      <h1>Runner Details: {runnerData.username}</h1>
      <p>Last Location: {runnerData.lastLocation}</p>
      <p>Current Destination: {runnerData.currentDestination}</p>
      <div className="button-group">
        <button className="resetpassword-button" onClick = {handleResetPassword}>
          Reset Password
        </button>
        <button className="delete-button" onClick={handleDeleteRunner}>
          Delete Runner
        </button>
      </div>

      <Link to="/mngrnr">
        <button className="back-button">Back to Manage Runners</button>
      </Link>
    </div>
    </div>
    </div>
  );
};

export default ViewRunner;
