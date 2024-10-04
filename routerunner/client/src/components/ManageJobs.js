// components/ManageJobs.js
import React from 'react';
import { Link } from 'react-router-dom';

const ManageJobs = () => {
  return (
    <div>
      <h1>Manage Jobs</h1>
      <p>This is the placeholder for the Manage Jobs page.</p>
      
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
