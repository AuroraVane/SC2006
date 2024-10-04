import React from 'react';
import { useNavigate } from 'react-router-dom';

navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect back to the login page
  };

return handleLogout;