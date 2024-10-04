import React from 'react';
import { Navigate } from 'react-router-dom';
import { parseJwt } from '../utils/jwtUtils'; // Import the utility function

const ProtectedRoute = ({ element: Component, allowedUsertype, ...rest }) => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        // Decode the token using the utility function
        const decodedToken = parseJwt(token); // Use parseJwt or jwt_decode

        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decodedToken.exp && decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

        // Check if usertype matches
        if (decodedToken.usertype === allowedUsertype) {
            // If usertype matches, render the protected component
            return <Component {...rest} />;
        } else {
            // If usertype does not match, redirect to home
            console.log('Invalid usertype:', decodedToken.usertype);
            if(decodedToken.usertype === 'operator'){
                return <Navigate to="/omm" />;
            }
            else if(decodedToken.usertype === 'runner'){
                return <Navigate to="/rmm" />;
            }
            else{
                return <Navigate to="/" />;}
        }
    } catch (error) {
        // If decoding fails, remove token and redirect to login
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
