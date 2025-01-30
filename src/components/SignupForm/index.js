import { Component} from "react";
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
    }

    onChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    }

    onChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    onChangePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    onChangeConfirmPassword = (event) => {
        this.setState({ confirmPassword: event.target.value });
    }

    validateUsername = () => {
        const { username } = this.state;

        if (username === '') {
            this.setState({ usernameError: 'Username cannot be empty' });
            return false;
        }

        this.setState({ usernameError: '' });
        return true;
    }

    validateEmail = () => {
        const { email } = this.state;

        if (email === '') {
            this.setState({ emailError: 'Email cannot be empty' });
            return false;
        }

        this.setState({ emailError: '' });
        return true;
    }

    validatePassword = () => {
        const { password } = this.state;

        if (password === '') {
            this.setState({ passwordError: 'Password cannot be empty' });
            return false;
        }

        this.setState({ passwordError: '' });
        return true;
    }

    validateConfirmPassword = () => {
        const { confirmPassword, password } = this.state;

        if (confirmPassword === '') {
            this.setState({ confirmPasswordError: 'Confirm password cannot be empty' });
            return false;
        }

        if (confirmPassword !== password) {
            this.setState({ confirmPasswordError: 'Password and confirm password should match' });
            return false;
        }

        this.setState({ confirmPasswordError: '' });
        return true;
    }

    onSubmit = async (event) => {
        event.preventDefault();
    
        const isUsernameValid = this.validateUsername();
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        const isConfirmPasswordValid = this.validateConfirmPassword();
    
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            try {
                const response = await fetch('http://localhost:5000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: this.state.username,
                        email: this.state.email,
                        password: this.state.password
                    })
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    // Handle validation errors from server
                    const errors = data.errors || {};
                    this.setState({
                        usernameError: errors.username || '',
                        emailError: errors.email || '',
                        passwordError: errors.password || ''
                    });
                    return;
                }
    
                // Clear form on success
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
    
                // Add success message or redirect user
                alert('Signup successful!');
                
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during signup');
            }
        }
    }

    render() {
        const { username, email, password, confirmPassword, usernameError, emailError, passwordError, confirmPasswordError } = this.state;

        return (
                <form className="signup-form-container" onSubmit={this.onSubmit}>
                <h1 className="signup-heading">Signup</h1>
                <div className="input-container">
                <label className="input-label" htmlFor="username">Username</label>
                <input
                    id="username"
                    className="input-field"
                    type="text"
                    value={username}
                    onChange={this.onChangeUsername}
                    placeholder="Enter your username"
                />
                <p className="error-message">{usernameError}</p>
                </div>
                
                <div className="input-container">
                <label className="input-label" htmlFor="email">Email</label>
                <input
                    id="email"
                    className="input-field"
                    type="email"
                    value={email}
                    onChange={this.onChangeEmail}
                    placeholder="Enter your email"
                />
                <p className="error-message">{emailError}</p>
                </div>
                <div className="input-container"> 
                <label className="input-label" htmlFor="password">Password</label>
                <input
                    id="password"
                    className="input-field"
                    type="password"
                    value={password}
                    onChange={this.onChangePassword}
                    placeholder="Enter your password"
                />
                <p className="error-message">{passwordError}</p>
                </div>
                <div className="input-container">
                <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    className="input-field"
                    type="password"
                    value={confirmPassword}
                    onChange={this.onChangeConfirmPassword}
                    placeholder="Enter your confirm password"
                />
                <p className="error-message">{confirmPasswordError}</p>
                </div>
                <button type="submit" className="signup-button">Signup</button>
            </form>
            
        );
    }

    

}
export default SignupForm;