import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AddProduct.css'; // CSS file for styling

function AddProduct() {
    const [category, setCategory] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:5000/add-product', {
                category,
                productName,
                price: Number(price), // Ensure price is a number
            });

            alert(response.data.message);
            navigate('/admin-dashboard');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product.');
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <label>Category:</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

                <label>Product Name:</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />

                <label>Price:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
