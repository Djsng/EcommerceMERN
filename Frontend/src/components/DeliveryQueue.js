import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/DeliveryQueue.css';

const DeliveryQueue = () => {
    const [deliveryItems, setDeliveryItems] = useState([]);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            axios.get(`http://localhost:5000/api/delivery-queue?email=${userEmail}`)
                .then(response => {
                    setDeliveryItems(response.data);
                })
                .catch(error => {
                    console.error('Error fetching delivery queue:', error);
                });
        } else {
            alert('Please log in first.');
        }
    }, []);

    return (
        <div className="delivery-queue-container">
            <h2>Your Delivery Queue</h2>
            <table className="delivery-queue-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Estimated Delivery</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveryItems.length > 0 ? (
                        deliveryItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productName}</td>
                                <td>${item.price}</td>
                                <td>{item.status}</td>
                                <td>{item.deliveryTimer} day(s)</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No products found in your delivery queue.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DeliveryQueue;
