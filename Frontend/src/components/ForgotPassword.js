import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [generatedCode, setGeneratedCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Generates a 4-digit reset code
    const generateResetCode = () => {
        const code = Math.floor(1000 + Math.random() * 9000);
        return code.toString();
    };

    const handleSendResetCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                const code = generateResetCode();  // Generate code on the frontend
                setGeneratedCode(code);  // Save the generated code
                setIsCodeSent(true);  // Indicate that code has been sent
                alert(`Your reset code is: ${code}`);  // Show the reset code to the user
                setSuccessMessage('Check your email for the reset code'); // This could also be handled by email if desired
            } else {
                setErrorMessage(data.message || 'Error sending reset code');
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage('Error while sending reset code. Please try again.');
        }
    };

    const handleSubmitCodeAndPassword = async (e) => {
        e.preventDefault();

        // Check if the entered reset code matches the generated code
        if (resetCode !== generatedCode) {
            setErrorMessage('Incorrect reset code. Please try again.');
            return;
        }

        if (!newPassword) {
            setErrorMessage('New password is required');
            return;
        }

        // Proceed with password reset
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resetCode, newPassword })
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setSuccessMessage(data.message);
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/signin'); // Redirect to sign-in page after password reset
                }, 2000);
            } else {
                setErrorMessage(data.message || 'Error resetting password');
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage('Error while resetting password. Please try again.');
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            {!isCodeSent ? (
                <form onSubmit={handleSendResetCode}>
                    <div className="formGroup">
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button type="submit" className="submitButton" disabled={loading}>
                        {loading ? 'Sending code...' : 'Send Reset Code'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmitCodeAndPassword}>
                    <div className="formGroup">
                        <input
                            type="text"
                            className="input"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            placeholder="Enter reset code"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <input
                            type="password"
                            className="input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <button type="submit" className="submitButton" disabled={loading}>
                        {loading ? 'Resetting password...' : 'Reset Password'}
                    </button>
                </form>
            )}

            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            {successMessage && <p className="successMessage">{successMessage}</p>}
        </div>
    );
};

export default ForgotPassword;
