import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState({});
    const [cartItemIds, setCartItemIds] = useState({}); // Store cart item IDs
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchProducts();
        fetchCart();
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

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const data = await response.json();
            const cartQuantities = {};
            const itemIds = {};
            
            data.forEach(item => {
                cartQuantities[item.product_id] = item.quantity;
                itemIds[item.product_id] = item.id; // Store cart item ID for each product
            });
            
            setCart(cartQuantities);
            setCartItemIds(itemIds);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
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
            
            // Update cart state with the new quantity
            setCart(prevCart => ({
                ...prevCart,
                [productId]: 1
            }));
            
            // Store the cart item ID
            setCartItemIds(prevIds => ({
                ...prevIds,
                [productId]: data.id
            }));

            // Refresh cart data
            fetchCart();
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleUpdateQuantity = async (productId, increment) => {
        try {
            const currentQuantity = cart[productId] || 0;
            const newQuantity = increment ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
            const cartItemId = cartItemIds[productId];

            if (!cartItemId) {
                console.error('Cart item ID not found for product:', productId);
                return;
            }

            const response = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }

            if (newQuantity === 0) {
                // Remove item from cart
                setCart(prevCart => {
                    const newCart = { ...prevCart };
                    delete newCart[productId];
                    return newCart;
                });
                setCartItemIds(prevIds => {
                    const newIds = { ...prevIds };
                    delete newIds[productId];
                    return newIds;
                });
            } else {
                // Update quantity
                setCart(prevCart => ({
                    ...prevCart,
                    [productId]: newQuantity
                }));
            }

            // Refresh cart data
            fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    if (loading) return <div className="loading-state">Loading products...</div>;
    if (error) return <div className="error-state">{error}</div>;

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
                            {cart[product.id] ? (
                                <div className="quantity-controls">
                                    <button 
                                        onClick={() => handleUpdateQuantity(product.id, false)}
                                        className="quantity-button"
                                    >
                                        -
                                    </button>
                                    <span>{cart[product.id]}</span>
                                    <button 
                                        onClick={() => handleUpdateQuantity(product.id, true)}
                                        className="quantity-button"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="add-to-cart-button"
                                    onClick={() => handleAddToCart(product.id)}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;