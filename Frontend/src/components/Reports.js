import React, { useState, useEffect } from 'react';
import './styles/Reports.css'; // Import the CSS file

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch reports from the backend when the component mounts
    fetch(`${process.env.REACT_APP_API_URL}/admin-reports`)
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) => console.error('Error fetching reports:', error));
  }, []);

  return (
    <div className="reports-container">
      <h2>Reports & Queries</h2>
      <table className="reports-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Query</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.email}</td>
              <td>{report.query}</td>
              <td>{new Date(report.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;