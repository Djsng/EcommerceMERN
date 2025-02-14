import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/SignUp.css'; // Assuming the CSS is stored in SignUp.css file

function AdminLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        const { username, password } = credentials;

        if (username === 'admin' && password === 'Admin@118') {
            alert('Welcome, Admin!');
            navigate('/admin-dashboard'); // Redirect to Admin Dashboard
        } else {
            setError('Invalid username or password!');
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-h2">Admin Login</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="signup-form-group">
                    <input
                        type="text"
                        className="signup-input"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        placeholder="Username"
                    />
                </div>
                <div className="signup-form-group">
                    <input
                        type={showPassword ? 'text' : 'password'} // Toggle between text and password type
                        className="signup-input"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        placeholder="Password"
                    />
                    <span
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Display eye or eye-slash based on visibility */}
                    </span>
                </div>
                <button type="submit" className="signup-button">Login</button>
            </form>
            {error && <p className="signup-error-message">{error}</p>}
        </div>
    );
}

export default AdminLogin;
