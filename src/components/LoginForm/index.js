import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './index.css';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;

        setUsernameError('');
        setPasswordError('');
        setLoginError('');

        if (!username.trim()) {
            setUsernameError('Username cannot be empty');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password cannot be empty');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Login failed');
                }
    
                const data = await response.json();
                
               
    
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                
                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify(data.user));
    
                // Call the onLoginSuccess prop with user data
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                }
    
                // Clear form and errors
                setUsername('');
                setPassword('');
                setLoginError('');
    
                // Navigate to home page
                navigate('/home');
            } catch (error) {
                console.error('Login error:', error);
                setLoginError(error.message || 'Failed to login. Please try again.');
            }
        }
    };

    return (
        <div className="login-page">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <h1 className="login-heading">Welcome Back</h1>
                
                {loginError && (
                    <div className="error-banner">
                        {loginError}
                    </div>
                )}

                <div className="form-group">
                    <label className="input-label" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        className="input-field"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                    {usernameError && (
                        <p className="error-message">{usernameError}</p>
                    )}
                </div>

                <div className="form-group">
                    <label className="input-label" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        className="input-field"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                    {passwordError && (
                        <p className="error-message">{passwordError}</p>
                    )}
                </div>

                <button type="submit" className="login-button">
                    Login
                </button>
                
                <Link to="/signup" className="link">
                    Don't have an account? Sign Up
                </Link>
            </form>
        </div>
    );
};

export default LoginForm;