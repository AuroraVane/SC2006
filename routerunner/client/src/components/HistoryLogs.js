// components/HistoryLogs.js
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoryLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch history logs from the server
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/historylogs');
        console.log(response.data);
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
            <th>Address</th>
            <th>Runner Username</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            log.job ? ( // Ensure job is not null before accessing its properties
              <tr key={log._id}>
                <td>{log.job.jobID || 'N/A'}</td>
                <td>
                  {log.job.address
                    ? `${log.job.address.street}, Block ${log.job.address.block}, Unit ${log.job.address.unitNumber}, Postal Code ${log.job.address.postalCode}`
                    : 'N/A'}
                </td>
                <td>{log.job.runnerUsername || 'N/A'}</td>
                <td>{log.job.status || 'N/A'}</td>
                <td>{log.date}</td>
              </tr>
            ) : (
              <tr key={log._id}>
                <td colSpan="5">Job details unavailable</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
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
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/historylogs');
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching history logs:', error);
      }
    };

    fetchLogs();
  }, []);

  // Define styles for the component
  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '20px 0',
    },
    th: {
      padding: '12px 15px',
      border: '1px solid #ddd',
      textAlign: 'left',
      backgroundColor: '#f2f2f2',
    },
    td: {
      padding: '12px 15px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    trEven: {
      backgroundColor: '#f9f9f9',
    },
    trHover: {
      backgroundColor: '#f1f1f1',
    },
    statusBadge: {
      padding: '5px 10px',
      borderRadius: '5px',
      color: 'white',
    },
    waiting: {
      backgroundColor: 'orange',
    },
    ongoing: {
      backgroundColor: 'blue',
    },
    completed: {
      backgroundColor: 'green',
    },
  };

  return (
    <div>
      <h1>History Logs</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Job ID</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Runner Username</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => {
            const rowStyle = index % 2 === 0 ? {} : styles.trEven; // Alternate row colors
            return log.job ? (
              <tr key={log._id} style={rowStyle}>
                <td style={styles.td}>{log.job.jobID || 'N/A'}</td>
                <td style={styles.td}>
                  {log.job.address
                    ? `${log.job.address.street}, Block ${log.job.address.block}, Unit ${log.job.address.unitNumber}, Postal Code ${log.job.address.postalCode}`
                    : 'N/A'}
                </td>
                <td style={styles.td}>{log.job.runnerUsername || 'N/A'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, ...(log.job.status ? styles[log.job.status] : {}) }}>
                    {log.job.status || 'N/A'}
                  </span>
                </td>
                <td style={styles.td}>{log.date|| 'N/A'}</td>
              </tr>
            ) : (
              <tr key={log._id}>
                <td colSpan="5">Job details unavailable</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryLogs;



