// components/ViewJobs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { parseJwt } from '../utils/jwtUtils';

const ViewJobs = () => {
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
    <div className="job-description">
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
        <p>
          <strong>Priority:</strong> {jobData.priority ? 'High' : 'Low'}
        </p>
      </div>
      {((usertype === "operator") && (jobData.status === 'waiting')) &&(
        <button
          style={{
            marginTop: '20px',
            padding: '10px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => handleDeleteJob(jobID)}
        >
          Delete Job
        </button>
      )}
    </div>
  );
};

export default ViewJobs;
