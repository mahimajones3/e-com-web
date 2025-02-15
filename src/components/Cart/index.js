import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

import './index.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/cart', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false); 
    }
};
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      fetchCartItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to remove item');
      fetchCartItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          Your cart is empty
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="item-image"
                  />
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">Rs.{item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-button"
                    >
                      <Minus />
                    </button>
                    
                    <span className="quantity-display">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-button"
                    >
                      <Plus />
                    </button>
                  </div>
                  
                  <div className="item-total">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-button"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="total-amount">
                Total: Rs.{calculateTotal().toFixed(2)}
              </div>
              <button className="checkout-button">
                Checkout
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cart;