// components/ManageRunners.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sample data for runners (replace this with actual data fetching)
const sampleRunners = [
  { id: '1', username: 'runner1', active: true },
  { id: '2', username: 'runner2', active: false },
  { id: '3', username: 'runner3', active: true },
  { id: '4', username: 'runner4', active: false },
  { id: '5', username: 'runner5', active: true },
  { id: '6', username: 'runner6', active: false },
  { id: '7', username: 'runner7', active: true },
  { id: '8', username: 'runner8', active: false },
  { id: '9', username: 'runner9', active: true },
  { id: '10', username: 'runner10', active: false },
];

const ManageRunner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [runners, setRunners] = useState(sampleRunners);

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
            <li key={runner.id} className="runner-item">
              <Link to={`/viewrunner/${runner.id}`} className="runner-link">
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
