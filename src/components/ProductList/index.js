import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddToCart = async (productId) => {
        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ product_id: productId, quantity: 1 }) 
            });
    
            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }
    
            const data = await response.json();
            console.log('Product added to cart:', data);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    if (loading) {
        return <div className="loading-state">Loading products...</div>;
    }

    if (error) {
        return <div className="error-state">{error}</div>;
    }

    return (
        <div className="product-page">
           
         <div className="product-list">
                <div className="products">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="product-image"
                                    onError={(e) => {
                                        e.target.src = "/api/placeholder/200/200";
                                    }}
                                />
                            </div>
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-description">{product.description}</p>
                            <p className="product-price">Rs {product.price.toFixed(2)}</p>
                            <p className="product-category">{product.category}</p>
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