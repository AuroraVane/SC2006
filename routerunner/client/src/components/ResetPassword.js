import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { username } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            // Send the reset password request to the backend
            const response = await axios.post('http://localhost:5001/api/resetpassword/', {
                username: username,
                password: password
            });
            setIsSuccess(true);
            setMessage('Success! Password has been reset.');
            console.log(response.data)
        } catch (error) {
            setIsSuccess(false);
            setMessage('Error changing password: ' + error.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleReset}>
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
                <button type="submit">Reset Password</button>
            </form>
            {message && (
                <div style={{ marginTop: '10px', color: isSuccess ? 'green' : 'red' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
