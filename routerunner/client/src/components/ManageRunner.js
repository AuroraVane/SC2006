// components/ManageRunners.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageRunner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [runners, setRunners] = useState([]);

  // Fetch all runners from API on component mount
  useEffect(() => {
    const fetchAllRunners = async () => {
      try {
        const response = await axios.get('/api/runners'); // Ensure this endpoint returns all runners
        setRunners(response.data); // Update runners with fetched data
      } catch (error) {
        console.error('Error fetching runners:', error);
      }
    };

    fetchAllRunners();
  }, []);

  // Filter runners based on search term
  const filteredRunners = runners.filter(runner =>
    runner.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort runners: active first
  const sortedRunners = filteredRunners.sort((a, b) => {
    return (a.active === b.active) ? 0 : a.active ? -1 : 1;
  });

  return (
    <div className="manage-runner-container">
      <h1>Manage Runners</h1>
      <input
        type="text"
        placeholder="Search for Runner"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="runner-list-container">
        <ul>
          {sortedRunners.map((runner) => (
            <li key={runner._id} className="runner-item">
              <Link to={`/viewrunner/${runner._id}`} className="runner-link">
                {runner.username}
                <span style={{ marginLeft: '10px' }}>
                  {runner.active ? '🟢' : '🔴'} {/* Green circle for active, red for inactive */}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/createnewrunner">
        <button>Create New Runner</button>
      </Link>
    </div>
  );
};

export default ManageRunner;
