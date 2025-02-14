import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css'; // CSS module for styling

function AdminDashboard() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <h3>Admin Dashboard</h3>
                <a href="/admin-dashboard">Dashboard</a>
                <a href="/admin-reports">Reports</a>
                <a href="/add-product">Add Product</a> {/* New Link for Adding Products */}
            </div>

            {/* Main Content Area */}
            <div className="dashboard-main-content">
                <h2>Welcome, Admin!</h2>

                {/* Sign Out Section */}
                <div className="dashboard-card">
                    <div className="dashboard-card-title">
                        <h3>Sign Out</h3>
                    </div>
                    <div className="dashboard-card-body">
                        <button onClick={handleSignOut} className="dashboard-action-btn">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
