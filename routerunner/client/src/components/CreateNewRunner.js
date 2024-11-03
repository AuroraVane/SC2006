import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

const CreateNewRunner = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [email, setEmail] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessages({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setSuccessMessage('Registration successful! A verification email has been sent. Please verify your email.');

      // Send the registration request to the backend
      const response = await axios.post('http://localhost:5001/api/register', {
        username,
        password,
        email,
        usertype: 'runner',
      });

      setErrorMessages({}); // Clear error messages

      // Redirect to login page after registration
      setTimeout(() => {
        navigate('/mngrnr');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const messages = error.response.data.errors.reduce((acc, message) => {
          if (message.includes('Email')) {
            acc.email = message; 
          } else if (message.includes('Username')) {
            acc.username = message; 
          } else if (message.includes('Password')) {
            acc.password = message; 
          }
          return acc;
        }, {});

        setErrorMessages({
          ...messages,
          general: undefined,
        });
      } else {
        setErrorMessages({ general: 'Error registering user. Please try again.' });
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
            style={{ flex: 1, marginLeft: '10px', marginBottom: '2px' }}
          />
        </div>
        {errorMessages.username && (
          <p className="error-message" style={{ fontSize: '12px', color: 'red', margin: '0 0 10px 110px'}}>
            {errorMessages.username}
          </p>
        )}

        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '100px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ flex: 1, marginLeft: '10px', marginBottom: '2px' }} 
          />
        </div>
        {errorMessages.password && (
          <p className="error-message" style={{ fontSize: '12px', color: 'red', margin: '0 0 10px 110px' }}>
            {errorMessages.password}
          </p>
        )}

        {/* Confirm Password Field */}
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '100px' }}>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ flex: 1, marginLeft: '10px', marginBottom: '2px' }}
          />
        </div>
        {errorMessages.confirmPassword && (
          <p className="error-message" style={{ fontSize: '12px', color: 'red', margin: '0 0 10px 110px' }}>
            {errorMessages.confirmPassword}
          </p>
        )}

        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '100px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ flex: 1, marginLeft: '10px', marginBottom: '2px' }} 
          />
        </div>
        {errorMessages.email && (
          <p className="error-message" style={{ fontSize: '12px', color: 'red', margin: '0 0 10px 110px' }}>
            {errorMessages.email}
          </p>
        )}

        {errorMessages.general && (
          <p className="error-message" style={{ fontSize: '12px', color: 'red', margin: '0 0 10px', textAlign: 'left' }}>
            {errorMessages.general}
          </p>
        )}
        {successMessage && (
          <p className="success-message" style={{ fontSize: '12px', color: 'green', margin: '0 0 10px', textAlign: 'left' }}>
            {successMessage}
          </p>
        )}

        <button type="submit">Register</button>

        {/* Back to Manage Runners Button */}
        <Link to="/mngrnr">
          <button className="back-button" style={{ marginTop: '25px', fontSize: '12px', padding: '5px 10px' }}>Back to Manage Runners</button>
        </Link>
      </form>
    </div>
  );
};

export default CreateNewRunner;
