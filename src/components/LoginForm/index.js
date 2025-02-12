import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom"; // Import withRouter
import axios from "axios";
import './index.css';

class LoginForm extends Component {
    state = {
        username: '',
        password: '',
        usernameError: '',
        passwordError: ''
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

        // Password validation
        if (!this.state.password) {
            this.setState({ passwordError: 'Password cannot be empty' });
            isValid = false;
        } else {
            this.setState({ passwordError: '' });
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
                const response = await axios.post('http://localhost:5000/api/login', {
                    username: this.state.username,
                    password: this.state.password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Server response:', response);
                alert('Login successful!');

                // Navigate to the Home Page after successful login
                this.props.history.push('/home'); // Use this.props.history.push to navigate
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

    render() {
        return (
            <form className="login-form-container" onSubmit={this.handleSubmit}>
                <h1 className="login-heading">Login</h1>

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

                <button type="submit" className="login-button">Login</button>
                <Link to="/signup" className="link">Don't have an account? Sign Up</Link>
            </form>
        );
    }
}

export default withRouter(LoginForm);