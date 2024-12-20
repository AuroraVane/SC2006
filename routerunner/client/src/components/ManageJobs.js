// components/ManageJobs.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import GoogleMapComponent from './GoogleMap';

const ManageJobs = () => {
  const mapRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);

  const handleDeleteJob = async (jobID) => {
    const confirmed = window.confirm("Are you sure you want to proceed?");
    if (confirmed) {
      await axios.post('/api/deleteJob', { jobID });
      fetchAllJobs();
    }
  };

  const fetchAllJobs = async () => {
    try {
      const response = await axios.get('/api/joblist');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, [jobs]);
  
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
        <div className='manage-runner-container'>
          <h1>Manage Jobs</h1>
          <input
            type="text"
            placeholder="Search for Job (by Username)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxSizing: 'border-box'
            }}
          />

          <div
            className="job-list-container"
            style={{
              height: "300px",        // Set a fixed height
              overflowY: "auto",       // Enable vertical scroll when content overflows
              overflowX: "hidden",     // Prevent horizontal scrolling if not needed
              display: "block"         // Ensure it's a block element for proper scrolling
            }}
          >
            {/* Labels aligned above each card field */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', padding: '10px 0', fontWeight: 'bold', color: '#555', textAlign: 'center' }}>
              <span>Job ID</span>
              <span>Username</span>
              <span>Status</span>
              <span></span> {/* Empty column for delete icon */}
            </div>

            <div className="job-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
              {jobs
                .filter(job => job.runnerUsername.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((job) => (
                  <div key={job._id} className="job-card" style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#fff',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s'
                  }}>
                    <Link to={`/viewjobs/${job.jobID}`} style={{ textDecoration: 'none', color: '#0a0a0a', fontSize: '14px' }}>
                      {job.jobID}
                    </Link>
                    <p style={{ margin: '0', fontSize: '14px', color: '#0a0a0a' }}>{job.runnerUsername}</p>
                    <span style={{ fontSize: '14px', color: job.status === 'ongoing' ? 'green' : 'red' }}>
                      {job.status === 'ongoing' ? 'Ongoing' : 'Pending'}
                    </span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: job.status !== 'ongoing' ? 'blue' : 'grey', cursor: job.status !== 'ongoing' ? 'pointer' : 'not-allowed', fontSize: '1.2em' }}
                      title={job.status !== 'ongoing' ? "Delete Job" : "Cannot delete ongoing job"}
                      onClick={() => job.status !== 'ongoing' && handleDeleteJob(job.jobID)}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Buttons to CreateNewJob and HistoryLogs */}
          <div className="button-container">
            <Link to="/createnewjob">
              <button classname="MJobs-button">Create Job</button>
            </Link>
            <Link to="/historylogs">
              <button classname="MJobs-button">History Log</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;