// components/ViewJobs.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { parseJwt } from '../utils/jwtUtils';
import GoogleMapComponent from './GoogleMap';

const ViewJobs = () => {
  const mapRef = useRef(null);
  const { jobID } = useParams(); // Extract username from URL parameters
  const [jobData, setJobData] = useState([]);
  const token = localStorage.getItem('token');
  const decodedtoken = token ? parseJwt(token) : null;
  const usertype = decodedtoken ? decodedtoken.usertype : null;
  const navigate = useNavigate();

  const handleDeleteJob = async (jobID) => {
    const confirmed = window.confirm("Are you sure you want to proceed?");
    if (confirmed) {
      await axios.post('/api/deleteJob', { jobID });
      navigate('/mngjob');
    }
  }

  useEffect(() => {
    const fetchJobData = async () => {
      const response = await axios.get('/api/runner-job/', { params: { jobID } });
      setJobData(response.data);
    };

    if (jobID) {
      fetchJobData();
    }
  }, [jobID]); // Add username as a dependency

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
        <div className="job-container">
          <div className="job-description">
            <div className="job-details">
              <h1 className="job-title">View Job</h1>
              <h2 className="job-id">Job ID: {jobData.jobID}</h2>
      
              <div className="address-box">
                <h3>Address</h3>
                <ul>
                  <li><strong>Street:</strong> {jobData.street || 'N/A'}</li>
                  <li><strong>Block:</strong> {jobData.block || 'N/A'}</li>
                  <li><strong>Unit Number:</strong> {jobData.unitNumber || 'N/A'}</li>
                  <li><strong>Postal Code:</strong> {jobData.postalCode || 'N/A'}</li>
                </ul>
              </div>
      
              <div className="job-meta">
                <p><strong>Note:</strong> {jobData.note || 'No notes provided'}</p>
                <p><strong>Priority:</strong> {jobData.priority ? 'High' : 'Low'}</p>
              </div>
      
              {(usertype === "operator" && jobData.status === "waiting") && (
                <button
                  style={{
                    marginTop: "20px",
                    padding: "10px 15px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleDeleteJob(jobID)}
                >
                  Delete Job
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default ViewJobs;
