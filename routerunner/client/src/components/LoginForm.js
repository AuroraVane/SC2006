// components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../utils/jwtUtils';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth'; // Import Firebase functions
import { getAuth } from 'firebase/auth';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);

        try {
            // Use Firebase to authenticate the user
            const userCredential = await doSignInWithEmailAndPassword(username, password);
            const user = userCredential.user;
            
            console.log('User:', username);
            // Get Firebase ID token
            const idToken = await user.getIdToken();
            console.log('ID token:', idToken);
            // Send the Firebase ID token to your backend to create a JWT
            const response = await axios.post('http://localhost:5001/api/login', {
                username,
                idToken, // Send the Firebase token to backend
            });

            // If login is successful
            console.log('Login successful:', response.data);
            const token = response.data.token;

            if (token) {
                // Store the JWT token in local storage
                localStorage.setItem('token', token);
                const decodedToken = parseJwt(token);
                const userType = decodedToken.usertype;

                console.log('User type:', userType);
                
                // Redirect based on user type
                if (userType === 'operator'){
                    navigate(`/omm/${username}`);
                } else if (userType === 'runner'){
                    navigate(`/rmm/${username}`);
                }
            }
        } catch (error) {
            // Handle error cases
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.message || 'Error logging in, please try again.');
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    const onGoogleSignIn = async () => {
        setIsSigningIn(true);
        try {
            // Use Firebase Google sign-in
            const userCredential = await doSignInWithGoogle();
            const user = userCredential.user;

            // Get Firebase ID token
            const idToken = await user.getIdToken();
            
            // Send the Firebase ID token to your backend
            const response = await axios.post('http://localhost:5001/api/login', {
                idToken, // Only the Firebase token in this case
            });

            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                const decodedToken = parseJwt(token);
                const userType = decodedToken.usertype;

                // Redirect based on user type
                if (userType === 'operator') {
                    navigate(`/omm/${user.email}`);
                } else if (userType === 'runner') {
                    navigate(`/rmm/${user.email}`);
                }
            }
        } catch (error) {
            setErrorMessage(error.message || 'Error signing in with Google. Please try again.');
        } finally {
            setIsSigningIn(false);
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
                <button type="submit" disabled={isSigningIn}>Login</button>
            </form>
            <button onClick={onGoogleSignIn} disabled={isSigningIn}>Sign in with Google</button>
        </div>
    );
};

export default LoginForm;
