// components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../utils/jwtUtils';
import { doSignInWithEmailAndPassword } from '../firebase/auth'; // Import Firebase functions
import { getAuth } from 'firebase/auth';
import deliveryIcon from '../utils/delivery.jpg';

const LoginForm = () => {
    const [email, setEmail] = useState('');
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
            const userCredential = await doSignInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            if(!user.emailVerified){
                setErrorMessage('Please verify your email first.');
                setIsSigningIn(false);
                return;
            }

            // Get Firebase ID token
            const idToken = await user.getIdToken();
            // Send the Firebase ID token to your backend to create a JWT
            const response = await axios.post('http://localhost:5001/api/login', {
                email,
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
                    navigate(`/omm/${email}`);
                } else if (userType === 'runner'){
                    navigate(`/rmm/${email}`);
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

    return (
        <div className="form-container">
            <h1>Login</h1>
            <img src={deliveryIcon} alt="delivery_icon" />
            <h3></h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password: </label>
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
        </div>
    );
};

export default LoginForm;
