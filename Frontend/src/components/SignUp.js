import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons from react-icons
import './styles/SignUp.css'; // Assuming the CSS is stored in SignUp.css file

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Password strength validation function
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (!username || !email || !password) {
            setErrorMessage('All fields are required');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Sign Up Successful');
                navigate('/'); // Redirect to home page after successful sign-up
            } else {
                setErrorMessage(data.message || 'Sign up failed');
            }
        } catch (error) {
            setErrorMessage('An error occurred while signing up. Please try again later.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-h2">Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div className="signup-form-group">
                    <input
                        type="text"
                        className="signup-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="signup-form-group">
                    <input
                        type="email"
                        className="signup-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="signup-form-group">
                    <input
                        type={showPassword ? 'text' : 'password'} // Toggle between text and password type
                        className="signup-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Display eye or eye-slash based on visibility */}
                    </span>
                </div>
                {errorMessage && <div className="signup-error-message">{errorMessage}</div>}
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            <div>
                <a className="signup-go-back-btn" href="/">Go Back</a>
            </div>
        </div>
    );
}

export default SignUp;
