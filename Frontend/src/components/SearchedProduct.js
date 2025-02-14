import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./styles/SearchedProduct.css";

const SearchedProduct = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search"); // Ensure it matches the backend

    useEffect(() => {
        if (searchQuery) {
            axios.get(`http://localhost:5000/products?search=${searchQuery}`)
                .then(response => {
                    console.log("Products fetched:", response.data.products); // Debugging
                    setProducts(response.data.products);
                })
                .catch(error => {
                    console.error("Error fetching products:", error);
                    setProducts([]);
                });
        }
    }, [searchQuery]);

    const handleBuy = (productId) => {
        const userEmail = localStorage.getItem("userEmail"); // Fetch email from localStorage

        if (!userEmail) {
            alert("Please log in first.");
            return;
        }

        axios.post("http://localhost:5000/api/buy", {
            email: userEmail, // Pass email in the request
            productId,
        })
        .then(() => alert("Product added to delivery queue!"))
        .catch(error => console.error("Error adding to queue:", error));
    };

    return (
        <div className="searched-product-container">
            <h2>Search Results for "{searchQuery}"</h2>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="product-card">
                            <h3>{product.productName}</h3>
                            <p>Category: {product.category}</p>
                            <p>Price: ${product.price}</p>
                            <button onClick={() => handleBuy(product._id)}>Buy</button>
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchedProduct;
