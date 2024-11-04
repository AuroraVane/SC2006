// components/ViewRunner.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { deleteUser, sendPasswordResetEmail,getAuth } from 'firebase/auth';

const ViewRunner = () => {
  const navigate = useNavigate();
  const { runnerId } = useParams(); // Get runnerId from the URL
  const [runnerData, setRunnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newLocation, setNewLocation] = useState('');
  const [lastlocation, setLastLocation] = useState('');
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
  useEffect(() => {
    // Temporary runner data for testing
    const tempRunnerData = {
      username: username,
      lastLocation: lastlocation,
      currentDestination: newLocation,
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
  }, [newLocation, lastlocation]);

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
  );
};

export default ViewRunner;
