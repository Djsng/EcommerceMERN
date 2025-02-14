import React, { useState } from 'react';
import './styles/CustomerQuery.css';

function CustomerSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/customer-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          query: formData.query,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', query: '' });
      } else {
        setError(data.message || 'An error occurred while submitting your query');
      }
    } catch (err) {
      setError('Failed to submit query. Please try again.');
    }
  };

  return (
    <div className="customer-support-container">
      <h2>Customer Support</h2>

      {isSubmitted && (
        <div className="success-message">
          <p>Your query has been submitted successfully! Our team will get back to you shortly.</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="ticket-system-section">
        <h3>Support Ticket System</h3>
        <p>Have a specific issue? Create a support ticket:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="query"
            placeholder="Describe your issue"
            value={formData.query}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit Ticket</button>
        </form>
      </div>
      <div className="contact-info-section">
        <h3>Contact Information</h3>
        <p>If you prefer direct communication, please reach us at:</p>
        <p>Email: <a href="mailto:sahadipayan555@gmail.com">support@team.com</a></p>
        <p>Phone: +91 9062425840</p>
      </div>
    </div>
  );
}

export default CustomerSupport;