import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons from react-icons
import './styles/SignUp.css';

function EditProfile() {
    const [newUsername, setNewUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);  // Added loading state
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!newUsername || !email || !newPassword) {
            setErrorMessage('All fields are required');
            return;
        }

        if (!validatePassword(newPassword)) {
            setErrorMessage('Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);  // Start loading state

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/edit-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newUsername, newPassword })
            });

            const data = await response.json();

            setLoading(false);  // Stop loading state

            if (response.ok) {
                setSuccessMessage(data.message);
                navigate('/dashboard');
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setLoading(false);  // Stop loading state
            setErrorMessage('Error updating profile. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-h2">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
                <div className="signup-form-group">
                    <input
                        className="signup-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="signup-form-group">
                    <input
                        className="signup-input"
                        type="text"
                        placeholder="New Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                </div>
                <div className="signup-form-group">
                    <input
                        className="signup-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                        className="signup-eye-icon"
                        onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Display eye or eye-slash based on visibility */}
                    </span>
                </div>
                {errorMessage && <div className="signup-error-message">{errorMessage}</div>}
                {successMessage && <div className="signup-success-message">{successMessage}</div>}
                <button className="signup-button" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
            <div>
                <button className="signup-go-back-btn" onClick={() => navigate('/dashboard')}>Go Back</button>
            </div>
        </div>
    );
}

export default EditProfile;
