// components/ViewRunner.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ViewRunner = () => {
  const { runnerId } = useParams(); // Get runnerId from the URL
  const [runnerData, setRunnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporary runner data for testing
    const tempRunnerData = {
      username: 'runner1',
      lastLocation: 'Location A',
      currentDestination: 'Location B',
      otherLocations: [
        { id: '1', name: 'Location C' },
        { id: '2', name: 'Location D' },
        { id: '3', name: 'Location E' },
        { id: '4', name: 'Location F' },
        { id: '5', name: 'Location G' },
        { id: '6', name: 'Location H' },
        { id: '7', name: 'Location I' },
      ],
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
  }, [runnerId]);

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
      <h3>Location List:</h3>
      <div className="location-list-container">
        <ul>
          {runnerData.otherLocations.map((location) => (
            <li key={location.id} className="location-item">
              {location.name} 
              <Link to={`/viewjobdetails/${location.id}`}>
                <button className="view-job-button">View Job Details</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="button-group">
        <button className="reroute-button" onClick={() => {/* Handle rerouting logic here */}}>
          Reroute
        </button>

        <button className="delete-button" onClick={() => {/* Handle delete runner logic here */}}>
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
