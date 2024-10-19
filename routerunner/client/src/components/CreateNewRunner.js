import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateNewRunner = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const usertype = 'runner';

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/; 
    return re.test(password);
  };

  const checkUsernameUnique = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/check-username?username=${username}`);
      console.log('Username check response:', response.data); // Log the response for debugging
      return response.data.isUnique; // Ensure the backend returns an object with an isUnique boolean property
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      return false; // Assume username is not unique if there's an error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    // Reset error messages
    setErrorMessage({ username: '', password: '', email: '' });

    // Validate email format
    if (!validateEmail(email)) {
      setErrorMessage((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      hasError = true;
    }

    // Validate password format
    if (!validatePassword(password)) {
      setErrorMessage((prev) => ({
        ...prev,
        password: 'Password must be at least 10 characters long, contain upper and lower case letters, and at least one special character.',
      }));
      hasError = true;
    }

    // Check if username is unique
    const isUsernameUnique = await checkUsernameUnique(username);
    if (!isUsernameUnique) {
      setErrorMessage((prev) => ({ ...prev, username: 'Username already exists. Please choose a different username.' }));
      hasError = true;
    }

    // If there are validation errors, do not proceed with registration
    if (hasError) return;

    try {
      // Send the registration request to the backend
      const response = await axios.post('http://localhost:5001/api/register', {
        username,
        password,
        email,
        usertype,
      });

      // Handle success
      setSuccessMessage('User registered successfully! Redirecting to login...');
      setErrorMessage({ username: '', password: '', email: '' });

      // Redirect to login page after registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Handle error
      if (error.response && error.response.data.message) {
        setErrorMessage((prev) => ({ ...prev, email: error.response.data.message })); // Display server error as email error
      } else {
        setErrorMessage((prev) => ({ ...prev, email: 'Error registering user. Please try again.' }));
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '100px' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ flex: 1, marginLeft: '10px', marginBottom: '2px' }} // Adjusted to align input
          />
        </div>
        {errorMessage.username && <p className="error-message" style={{ fontSize: '12px', color: 'red', margin: '0 0 10px 110px' }}>{errorMessage.username}</p>}

        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '100px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ flex: 1, marginLeft: '10px', marginBottom: '2px' }} // Adjusted to align input
          />
        </div>
        {errorMessage.password && <p className="error-message" style={{ fontSize: '12px', color: 'red', margin: '0 0 10px 110px' }}>{errorMessage.password}</p>}

        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '100px' }}>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ flex: 1, marginLeft: '10px', marginBottom: '2px' }} // Adjusted to align input
          />
        </div>
        {errorMessage.email && <p className="error-message" style={{ fontSize: '12px', color: 'red', margin: '0 0 10px 110px' }}>{errorMessage.email}</p>}

        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CreateNewRunner;
