// components/BurgerMenu.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../utils/jwtUtils';
import axios from 'axios';

const BurgerMenu = () => {
  const navigate = useNavigate();

  // Decode the token to get usertype
  const token = localStorage.getItem('token');
  const decodedtoken = token ? parseJwt(token) : null;
  const usertype = decodedtoken?.usertype;
  const username = decodedtoken?.username;
  const [jobID, setJobID] = useState(null);

  const handleLogout = async () => {
    await axios.post('/api/logout', {username});
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login after logout
  };

  useEffect(() => {
    console.log("Fetching jobID for user:", username);
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/get-runner-job', { params: { username } });
        console.log("API Response:", response.data);
        setJobID(response.data.jobID);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    if (username) {
      fetchUser();
    }
  }, [username]);

  return (
    <div className="burger-menu">
      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <div className="menu">
        <ul>
          {usertype === 'operator' && (
            <>
              <li><Link to={`/omm/${username}`}>Home</Link></li>
              <li><Link to="/mngjob">Manage Jobs</Link></li>
              <li><Link to="/mngrnr">Manage Runners</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
          {usertype === 'runner' && (
            <>
              <li><Link to={`/rmm/${username}`}>Home</Link></li>
              {jobID !== null && <li><Link to={`/viewjobs/${jobID}`}>View Jobs</Link></li>}
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;
