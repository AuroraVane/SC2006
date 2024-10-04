// components/ViewRunner.js
import React from 'react';
import { Link } from 'react-router-dom';

const ViewRunner = () => {
  return (
    <div>
      <h1>View Runner</h1>
      <p>This is the placeholder for viewing runner details.</p>

      {/* Button to View Job Details */}
      <Link to="/viewjobdetails">
        <button>View Job Details</button>
      </Link>
    </div>
  );
};

export default ViewRunner;
