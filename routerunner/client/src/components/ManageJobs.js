// components/ManageJobs.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await axios.get('/api/joblist'); // Ensure this endpoint returns all runners
        setJobs(response.data); // Update runners with fetched data
      } catch (error) {
        console.error('Error fetching runners:', error);
      }
    };

    fetchAllJobs();
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="job-item">
                <td>
                  <Link to={`/viewjobs/${job.runnerUsername}`} className="job-link">
                    {job.jobID}
                  </Link>
                </td>
                <td>
                  <Link to={`/viewjobs/${job.runnerUsername}`} className="job-link">
                    {job.runnerUsername}
                  </Link>
                </td>
                <td>
                  {job.status === 'ongoing' ? '🟢' : '🔴'} {/* Green circle for active, red for inactive */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons to CreateNewJob and HistoryLogs */}
      <div>
        <Link to="/createnewjob">
          <button>Create New Job</button>
        </Link>
        <Link to="/historylogs">
          <button>History Logs</button>
        </Link>
      </div>
    </div>
  );
};

export default ManageJobs;
