// components/ManageJobs.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ManageJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);

  const handleDeleteJob = async (jobID) => {
    const confirmed = window.confirm("Are you sure you want to proceed?");
    if (confirmed) {
      await axios.post('/api/deleteJob', { jobID });
      fetchAllJobs();
    }
  }
  const fetchAllJobs = async () => {
    try {
      const response = await axios.get('/api/joblist'); // Ensure this endpoint returns all runners
      setJobs(response.data); // Update runners with fetched data
    } catch (error) {
      console.error('Error fetching runners:', error);
    }
  };
  useEffect(() => {
    fetchAllJobs();
  }, [jobs]);

  return (
    <div className='manage-runner-container'>
      <h1>Manage Jobs</h1>
      <input
        type="text"
        placeholder="Search for job"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="job-list-container">
        <table>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Username</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="job-item">
                <td>
                  <Link to={`/viewjobs/${job.jobID}`} className="job-link">
                    {job.jobID}
                  </Link>
                </td>
                <td>
                  <Link to={`/viewjobs/${job.jobID}`} className="job-link">
                    {job.runnerUsername}
                  </Link>
                </td>
                <td>
                  {job.status === 'ongoing' ? '🟢' : '🔴'} {/* Green circle for active, red for inactive */}
                </td>
                <td>
                  {job.status !== 'ongoing' && (
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        color: 'red',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        padding: '10px'
                      }}
                      onClick={() => handleDeleteJob(job.jobID)}
                    />
                  )}

                  {job.status === 'ongoing' && (
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        color: 'grey',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        padding: '10px'
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  );
};

export default ManageJobs;