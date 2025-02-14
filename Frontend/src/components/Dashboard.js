import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const userEmail = localStorage.getItem("userEmail"); // Get the email from localStorage

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/searched-product?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <h3>Welcome, {userEmail ? userEmail : "Guest"}</h3> {/* Display the email if available */}
                {/* <Link to="/view-cart">View Cart</Link> */}
                <Link to="/edit-profile">Edit Profile</Link>
                <Link to="/delivery-queue">Delivery Queue</Link>
                <Link to="/customer-query">Customer Query</Link>
                <Link to="/">Sign Out</Link>
            </div>
            <div className="dashboard-main-content">
                <div className="dashboard-search-container">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
