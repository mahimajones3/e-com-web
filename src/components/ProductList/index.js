import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import './index.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (productId) => {
        alert(`Product ${productId} added to cart!`);
    };

    return (
        <div>
        <Header />
        <div className="product-list">
            <h1>Product Listing</h1>
            <div className="products">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        <h2 className="product-name">{product.name}</h2>
                        <p className="product-price">rs{product.price}</p>
                        <button
                            className="add-to-cart-button"
                            onClick={() => handleAddToCart(product.id)}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default ProductList;