import React, { useState } from "react";
import Header from "../Header";

import axios from "axios";

import './index.css';

const Products = () => {
    
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/products', product);
            setMessage('Product added successfully!');
            setProduct({
                name: '',
                description: '',
                price: '',
                imageUrl: '',
                category: ''
            });
        } catch (error) {
            setMessage('Failed to add product.');
            console.error(error);
        }
    };

    return (
        <div>
        <Header/>
        <form className="product-form" onSubmit={handleSubmit}>
            <h2>Add Product</h2>
            <div>
                <label>Product Name</label>
                <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description</label>
                <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Image URL</label>
                <input
                    type="url"
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Category</label>
                <input
                    type="text"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Add Product</button>
            {message && <p className="message">{message}</p>}
        </form>
        </div>
    );
};

export default Products;