// components/CreateNewJob.js

import React, { useState } from 'react';
import axios from 'axios';

const CreateNewJob = () => {
  const [postalCode, setPostalCode] = useState('');
  const [streetName, setStreetName] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const checkPostalCodeExists = async (e) => {
    e.preventDefault();
    if(postalcode.length !== 6) {
      setError('Postal code must be 6 digits');
      return;
    }
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
        const streetComponent = results[0]["ROAD_NAME"];
        const blockComponent = results[0]["BLK_NO"];
        setStreetName(streetComponent || 'N/A');
        setBlockNumber(blockComponent || 'N/A');
        setLatitude(results[0]['LATITUDE']);
        setLongitude(results[0]['LONGITUDE']);
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
    const job = {
      jobID: Date.now() % 100000000000,
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
      latitude: latitude,
      longitude: longitude,
    };

    try {
      const response = await axios.post('http://localhost:5001/api/jobs', job);
      console.log('Job added:', response.data);
      setSuccess('Job successfully created!');
      setError(null);
    } catch (err) {
      console.error('Error creating job:', err);
      setError('Error creating job');
      setSuccess(null);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxSizing: 'border-box',
  };

  const inputStyle = {
    width: 'calc(100% - 16px)', // ensures consistent gap inside the container
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center' }}>Create New Job</h1>
      <form onSubmit={checkPostalCodeExists}>
        <div>
          <label style={labelStyle}>Postal Code:</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Enter postal code"
            required
            style={inputStyle}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>Check Postal Code</button>
        </div>

        <div>
          <label style={labelStyle}>Street Name:</label>
          <input
            type="text"
            value={streetName}
            readOnly
            placeholder="Street Name will autofill"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Block Number:</label>
          <input
            type="text"
            value={blockNumber}
            readOnly
            placeholder="Block Number will autofill"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Floor and Apartment [optional]:</label>
          <input
            type="text"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            placeholder="Enter unit number"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Notes [optional]:</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter note"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Priority:</label>
          <input
            type="checkbox"
            checked={priority}
            onChange={() => setPriority(!priority)}
            style={{ marginBottom: '10px' }}
          />
        </div>

        <button type="button" onClick={handleAddJob} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Create Job
        </button>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
    </div>
  );
};

export default CreateNewJob;


