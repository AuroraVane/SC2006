// components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../utils/jwtUtils';
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a POST request to the backend login API
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            });

            // If login is successful
            console.log('Login successful:', response.data);
            console.log('User type:', response.data.userType);
            const token = response.data.token;

            if (token) {
                // Store the token in local storage

                localStorage.setItem('token', token);
                const decodedToken = parseJwt(token);
                const userType = decodedToken.usertype;

                console.log('User type:', userType);
                // Redirect based on login success
                if (userType === 'operator'){
                    navigate('/omm');
                }
                else if (userType === 'runner'){
                    navigate('/rmm');
                }
            }
            // Redirect based on login success
        } catch (error) {
            // Handle error cases
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error logging in, please try again.');
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
