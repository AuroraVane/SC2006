// components/HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };


  return (
    <div className="home-container">
      <div className="content">
        <h1>RouteRunner</h1>
        <p>
          Ming Kai<br />Kan Yui<br />Alvin<br />Anxian<br />Andria
                
        </p>
        <button onClick={handleLoginRedirect}>Go to Login</button>
        
      </div>
    </div>
  );
};

export default HomePage;
