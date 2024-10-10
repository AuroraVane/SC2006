// components/ManageRunner.js
import React from 'react';
import { Link } from 'react-router-dom';

const ManageRunner = () => {
  const runnerID = '12345';
  return (
    <div>
      <h1>Manage Runner</h1>
      <p>This is the placeholder for the Manage Runner page.</p>
      
      {/* Buttons to ViewRunner and CreateNewRunner */}
      <div>
        <Link to="/viewrunner/${runnerID}">
          <button>View Runner</button>
        </Link>
        <Link to="/createnewrunner">
          <button>Create New Runner</button>
        </Link>
      </div>
    </div>
  );
};

export default ManageRunner;
