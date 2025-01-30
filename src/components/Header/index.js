import React from "react";
import { Link } from 'react-router-dom';
import './index.css';

const Header = () => {

    return (
      <header className="header">
      <div className="container">
        <div className="row align-items-center">
          {/* Logo Section */}
          <div className="col-md-3">
            
              <Link to="/home" aria-label="Go to homepage">
                <img 
                  src="https://www.pngplay.com/wp-content/uploads/5/Alphabet-E-Transparent-Images.png" 
                  alt="Company Logo" 
                  className="logo-img" 
                />
              </Link>
            
          </div>
    
          {/* Navigation Menu */}
          <div className="col-md-6">
            <nav className="menu" aria-label="Main navigation">
              <ul className="menu-list">
                <li className="menu-item">
                  <Link to="/" className="menu-link">Signup</Link>
                </li>
                <li className="menu-item">
                  <Link to="/loginform" className="menu-link">Login</Link>
                </li>
                <li className="menu-item">
                  <Link to="/home" className="menu-link">Home</Link>
                </li>
                <li className="menu-item">
                  <Link to="/products" className="menu-link">Products</Link>
                </li>
                <li className="menu-item">
                  <Link to="/productlist" className="menu-link">Product List</Link>
                </li>
              </ul>
            </nav>
          </div>
    
          <div className="col-md-3">
            <div className="cart">
              <Link to="/cart" aria-label="View cart">
                <img 
                  src="https://static.vecteezy.com/system/resources/previews/009/157/893/original/shopping-cart-set-of-shopping-cart-icon-on-white-background-shopping-cart-icon-shopping-cart-design-shopping-cart-icon-sign-shopping-cart-icon-isolated-shopping-cart-symbol-free-vector.jpg" 
                  alt="Shopping Cart" 
                  className="cart-icon" 
                />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </header>
    );
}

export default Header;