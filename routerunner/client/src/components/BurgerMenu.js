// components/BurgerMenu.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../utils/jwtUtils';

const BurgerMenu = () => {
  const navigate = useNavigate();
  
  // Decode the token to get usertype
  const token = localStorage.getItem('token');
  const decodedtoken = token ? parseJwt(token) : null;
  const usertype = decodedtoken?.usertype;
  const username = decodedtoken?.username;
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login after logout
  };

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
              <li><Link to={`/viewjobs/${username}`}>View Jobs</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;
