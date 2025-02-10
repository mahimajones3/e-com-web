import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './index.css';

class SignupForm extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        usernameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: ''
    };

    validateForm = () => {
        let isValid = true;
        
        // Username validation
        if (!this.state.username.trim()) {
            this.setState({ usernameError: 'Username cannot be empty' });
            isValid = false;
        } else {
            this.setState({ usernameError: '' });
        }

        // Email validation
        if (!this.state.email.trim()) {
            this.setState({ emailError: 'Email cannot be empty' });
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(this.state.email)) {
            this.setState({ emailError: 'Please enter a valid email' });
            isValid = false;
        } else {
            this.setState({ emailError: '' });
        }

        // Password validation
        if (!this.state.password) {
            this.setState({ passwordError: 'Password cannot be empty' });
            isValid = false;
        } else if (this.state.password.length < 6) {
            this.setState({ passwordError: 'Password must be at least 6 characters' });
            isValid = false;
        } else {
            this.setState({ passwordError: '' });
        }

        // Confirm password validation
        if (!this.state.confirmPassword) {
            this.setState({ confirmPasswordError: 'Confirm password cannot be empty' });
            isValid = false;
        } else if (this.state.confirmPassword !== this.state.password) {
            this.setState({ confirmPasswordError: 'Passwords do not match' });
            isValid = false;
        } else {
            this.setState({ confirmPasswordError: '' });
        }

        return isValid;
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.validateForm()) {
            try {
                console.log('Attempting to send data to:', 'http://localhost:5000/api/signup');
                console.log('Sending data:', {
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                });

                const response = await axios.post('http://localhost:5000/api/signup', {
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Server response:', response);
                alert('Registration successful!');

                // Reset form
                this.setState({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    usernameError: '',
                    emailError: '',
                    passwordError: '',
                    confirmPasswordError: ''
                });
            } catch (error) {
                console.error('Full error object:', error);
                console.error('Error response data:', error.response?.data);
                console.error('Error status:', error.response?.status);
                console.error('Error headers:', error.response?.headers);
                
                const errorMessage = error.response?.data?.error || 
                                   error.message || 
                                   'Registration failed - Please check if the server is running';
                alert(errorMessage);
            }
        }
    };

    render() {
        return (
            <form className="signup-form-container" onSubmit={this.handleSubmit}>
                <h1 className="signup-heading">Signup</h1>
                
                <div className="form-group">
                    <label className="input-label" htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        className="input-field"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                    />
                    {this.state.usernameError && 
                        <p className="error-message">{this.state.usernameError}</p>
                    }
                </div>

                <div className="form-group">
                    <label className="input-label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        className="input-field"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                    />
                    {this.state.emailError && 
                        <p className="error-message">{this.state.emailError}</p>
                    }
                </div>

                <div className="form-group">
                    <label className="input-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        className="input-field"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                    />
                    {this.state.passwordError && 
                        <p className="error-message">{this.state.passwordError}</p>
                    }
                </div>

                <div className="form-group">
                    <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        className="input-field"
                        type="password"
                        value={this.state.confirmPassword}
                        onChange={this.handleInputChange}
                    />
                    {this.state.confirmPasswordError && 
                        <p className="error-message">{this.state.confirmPasswordError}</p>
                    }
                </div>

                <button type="submit" className="signup-button">Sign Up</button>
                <Link to="/loginform" className="link">Already have an account? Login</Link>
            </form>
        );
    }
}

export default SignupForm;