// components/ViewJobs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parseJwt } from '../utils/jwtUtils';

const ViewJobs = () => {
  const token = localStorage.getItem('token');
  const decodedtoken = token ? parseJwt(token) : null;
  const username = decodedtoken?.username;
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    const fetchJobData = async () => {
      const response = await axios.get('/api/runner-job/', {params: {username}});
      setJobData(response.data);
    }
    //console.log(jobData)
    fetchJobData();
  },)

  return (
    <div className="job-description">
      <h1 className="job-title">View Job</h1>
      <h2 className="job-id">Job ID: {jobData.jobID}</h2>
      
      <div className="address-box">
        <h3>Address</h3>
        <ul>
          <li><strong>Street:</strong> {jobData.street||'N/A'}</li>
          <li><strong>Block:</strong> {jobData.block||'N/A'}</li>
          <li><strong>Unit Number:</strong> {jobData.unitNumber||'N/A'}</li>
          <li><strong>Postal Code:</strong> {jobData.postalCode||'N/A'}</li>
        </ul>
      </div>

      <div className="job-meta">
        <p><strong>Note:</strong> {jobData.note || 'No notes provided'}</p>
        <p>
          <strong>Priority:</strong> {jobData.priority ? 'High' : 'Low'}
        </p>
      </div>
    </div>
  );
};

export default ViewJobs;
