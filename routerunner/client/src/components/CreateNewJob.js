// components/CreateNewJob.js
/*
import React from 'react';

const CreateNewJob = () => {
  return (
    <div>
      <h1>Create New Job</h1>
      <p>This is the placeholder for the Create New Job page.</p>
    </div>
  );
};


export default CreateNewJob;
*/

import React, { useState } from 'react';
import axios from 'axios';

const CreateNewJob = () => {
  const [postalCode, setPostalCode] = useState('');
  const [streetName, setStreetName] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const checkPostalCodeExists = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("https://www.onemap.gov.sg/api/common/elastic/search", {
        params: {
            searchVal: postalCode,
            returnGeom: 'Y',
            getAddrDetails: 'Y',
            pageNum: 1
          },
        });

      const results = response.data.results;
      if (results.length > 0) {

        // Extract Street Name and Block Number
        const streetComponent = results[0]["ROAD_NAME"]
        const blockComponent = results[0]["BLK_NO"]

        setStreetName(streetComponent ? streetComponent: 'N/A');
        setBlockNumber(blockComponent ? blockComponent : 'N/A');
        setError(null);
      } else {
        setStreetName('N/A');
        setBlockNumber('N/A');
        setError('Postal code not found');
      }
    } catch (err) {
      console.error('Error fetching postal code:', err);
      setError('Error fetching postal code data');
    }
  };

  const handleAddJob = async () => {
    // startAddress & runner on hold, await viewRunner/viewJob, right now is just tmp values
    const job = {
      jobID: Date.now()%100000000000,
      address: {
        postalCode: postalCode,
        street: streetName,
        block: blockNumber,
        unitNumber: unitNumber,
      },
      note: note,
      priority: priority,
      runnerID: null,
      status: 'waiting',
    };

    try {
      const response = await axios.post('http://localhost:5001/api/jobs', job); // Replace with your API endpoint
      console.log('Job added:', response.data);
      setSuccess('Job successfully created!');
      setError(null);
    } catch (err) {
      console.error('Error creating job:', err);
      setError('Error creating job');
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>Create New Job</h1>
      <form onSubmit={checkPostalCodeExists}>
        <div>
          <label>
            Postal Code:
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter postal code"
              required
            />
          </label>
          <button type="submit">Check Postal Code</button>
        </div>

        <div>
          <label>
            Street Name:
            <input
              type="text"
              value={streetName}
              readOnly
              placeholder="Street Name will autofill"
            />
          </label>
        </div>

        <div>
          <label>
            Block Number:
            <input
              type="text"
              value={blockNumber}
              readOnly
              placeholder="Block Number will autofill"
            />
          </label>
        </div>

        <div>
          <label>
            Floor and Apartment [optional]:
            <input
              type="text"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              placeholder="Enter unit number"
            />
          </label>
        </div>
        <div>
          <label>
            Notes [optional]:
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note"
            />
          </label>
        </div>
        <div>
          <label>
            Priority:
            <input
              type="checkbox"
              checked={priority}
              onChange={() => setPriority(!priority)}
            />
          </label>
        </div>

        <button type="button" onClick={handleAddJob}>
          Create Job
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default CreateNewJob;



