// components/HistoryLogs.js
/*
import React from 'react';

const HistoryLogs = () => {
  return (
    <div>
      <h1>History Logs</h1>
      <p>This is the placeholder for the History Logs page.</p>
    </div>
  );
};

export default HistoryLogs;
*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoryLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch history logs from the server
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/historylogs');
        console.log(response.data)
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching history logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h1>History Logs</h1>
      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Start Address Street Name</th>
            <th>Start Address Block Number</th>
            <th>End Address Street Name</th>
            <th>End Address Block Number</th>
            <th>Runner</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.job.jobID}</td>
              <td>{log.job.startAddress ? log.job.startAddress.streetName : 'N/1'}</td>
              <td>{log.job.startAddress ? log.job.startAddress.blockNumber : 'N/A'}</td>
              <td>{log.job.endAddress ? log.job.endAddress.streetName : 'N/A'}</td>
              <td>{log.job.endAddress ? log.job.endAddress.blockNumber : 'N/A'}</td>
              <td>{log.job.runner ? log.job.runner.username : 'N/A'}</td>
              <td>{log.job.status ? 'Completed' : 'In Progress'}</td>
              <td>{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryLogs;
