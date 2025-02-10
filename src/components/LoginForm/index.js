import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './index.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const onChangeUsername = (event) => {
        setUsername(event.target.value);
        setUsernameError('');
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
        setPasswordError('');
    };

    const validateUsername = () => {
        if (username.trim() === '') {
            setUsernameError('Username cannot be empty');
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (password.trim() === '') {
            setPasswordError('Password cannot be empty');
            return false;
        }
        return true;
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setUsernameError('');
        setPasswordError('');

        if (validateUsername() && validatePassword()) {
            try {
                const response = await axios.post('http://localhost:5000/api/login', {
                    username,
                    password
                });

                if (response.data.success) {
                    // Store token
                    localStorage.setItem('token', response.data.token);
                    console.log('Login successful', response.data);
                    
                    // Optionally navigate to dashboard or home
                    // navigate('/dashboard');
                }
            } catch (error) {
                console.error('Login error:', error.response ? error.response.data : error.message);
                
                if (error.response) {
                    // Server responded with an error
                    const errorMessage = error.response.data.error;
                    if (errorMessage.includes('User not found')) {
                        setUsernameError(errorMessage);
                    } else if (errorMessage.includes('Invalid password')) {
                        setPasswordError(errorMessage);
                    } else {
                        setUsernameError(errorMessage || 'Login failed');
                    }
                } else {
                    // Network error or other issues
                    setUsernameError('Unable to connect to the server. Please try again.');
                }
            }
        }
    };

    return (
        <form className="login-form" onSubmit={onSubmit}>
            <h1>Login</h1>
            <div>
                <label className="label" htmlFor="username">Username</label>
                <input 
                    className="input" 
                    placeholder="Enter your username" 
                    id="username" 
                    type="text" 
                    value={username} 
                    onChange={onChangeUsername} 
                />
                {usernameError && <p className="error">{usernameError}</p>}
            </div>
            <div>
                <label className="label" htmlFor="password">Password</label>
                <input 
                    className="input" 
                    placeholder="Enter your password" 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={onChangePassword} 
                />
                {passwordError && <p className="error">{passwordError}</p>}
            </div>
            <button type="submit" className="login-button">Login</button>
            <Link to="/" className="link">Don't have an account? Sign up</Link>
        </form>
    );
};

export default LoginForm;