import React, { useState } from "react";
import './index.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const validateEmail = () => {
        if (email === '') {
            setEmailError('Email cannot be empty');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = () => {
        if (password === '') {
            setPasswordError('Password cannot be empty');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const onSubmit = (event) => {
        event.preventDefault();

        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            console.log('Form submitted');
        }
    };

    return (
        <form className="login-form" onSubmit={onSubmit}>
            <h1>Login</h1>
            <div>
                <label className="label" htmlFor="email">Email</label>
                <input className="input" placeholder="Enter your email" id="email" type="email" value={email} onChange={onChangeEmail} />
                {emailError && <p className="error">{emailError}</p>}
            </div>
            <div>
                <label className="label" htmlFor="password">Password</label>
                <input className="input" placeholder="Enter your password" id="password" type="password" value={password} onChange={onChangePassword} />
                {passwordError && <p className="error">{passwordError}</p>}
            </div>
            <button type="submit" className="login-button"  >Login</button>
        </form>
    );
};

export default LoginForm;