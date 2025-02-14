import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/SignIn.css';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            setErrorMessage('All fields are required');
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert('Sign In Successful');
                localStorage.setItem('token', data.token); // Store token in localStorage
                localStorage.setItem('userEmail', data.email); // Store email in localStorage
                navigate('/dashboard');
            } else {
                setErrorMessage(data.message || 'Sign In failed');
            }
        } catch (error) {
            setErrorMessage('Error: Unable to sign in. Please try again later.');
        }
    };    

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="signin-body">
            <div className="signin-container">
                <h2 className="signin-h2">Sign In</h2>
                <form onSubmit={handleSignIn}>
                    <div className="signin-form-group">
                        <input
                            className="signin-input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="signin-form-group">
                        <input
                            className="signin-input"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="signin-eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errorMessage && <div className="signin-error-message">{errorMessage}</div>}
                    <button className="signin-button" type="submit">Sign In</button>
                </form>
                <div>
                    <a className="signin-go-back-btn" href="/">Go Back</a>
                </div>
                <div>
                    <button className="signin-button forgot-password" onClick={handleForgotPassword}>Forgot Password?</button>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
