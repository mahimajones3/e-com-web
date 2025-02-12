import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import './index.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const validateForm = () => {
        let isValid = true;

        // Username validation
        if (!username.trim()) {
            setUsernameError('Username cannot be empty');
            isValid = false;
        } else {
            setUsernameError('');
        }

        // Password validation
        if (!password) {
            setPasswordError('Password cannot be empty');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:5000/api/login', {
                    username,
                    password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Server response:', response);
                alert('Login successful!');

                // Navigate to the Home Page after successful login
                navigate('/home'); // Use navigate to redirect
            } catch (error) {
                console.error('Full error object:', error);
                console.error('Error response data:', error.response?.data);
                console.error('Error status:', error.response?.status);
                console.error('Error headers:', error.response?.headers);

                const errorMessage = error.response?.data?.error || 
                                   error.message || 
                                   'Login failed - Please check your credentials and try again';
                alert(errorMessage);
            }
        }
    };

    return (
        <form className="login-form-container" onSubmit={handleSubmit}>
            <h1 className="login-heading">Login</h1>

            <div className="form-group">
                <label className="input-label" htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    className="input-field"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && 
                    <p className="error-message">{usernameError}</p>
                }
            </div>

            <div className="form-group">
                <label className="input-label" htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    className="input-field"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && 
                    <p className="error-message">{passwordError}</p>
                }
            </div>

            <button type="submit" className="login-button">Login</button>
            <Link to="/signup" className="link">Don't have an account? Sign Up</Link>
        </form>
    );
};

export default LoginForm;