import React from 'react';
import { ShoppingBag, TrendingUp, Shield, Truck } from 'lucide-react';
import './index.css';

const Home = ({ username, onNavigateToProducts, onLogout }) => {
  const features = [
    {
      icon: <ShoppingBag className="feature-icon" />,
      title: "Wide Selection",
      description: "Browse through thousands of curated products"
    },
    {
      icon: <TrendingUp className="feature-icon" />,
      title: "Best Deals",
      description: "Unbeatable prices and regular discounts"
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Secure Shopping",
      description: "100% secure payments and data protection"
    },
    {
      icon: <Truck className="feature-icon" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping services"
    }
  ];

  return (
    <div className="home-page">
      <header className="header-bar">
        <div className="header-content">
          <h2>Welcome, {username || 'Guest'}!</h2>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="main-container">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">
                Discover the Best Deals on Your Favorite Products!
              </h1>
              <p className="hero-description">
                Your one-stop destination for high-quality products at unbeatable prices.
                From trendy fashion and electronics to home essentials and more, we bring you 
                a curated selection of items to suit your lifestyle.
              </p>
              <button onClick={onNavigateToProducts} className="primary-button">
                Shop Now
              </button>
            </div>
            <div>
              <img 
                src="/api/placeholder/800/600"
                alt="E-commerce showcase" 
                className="hero-image"
              />
            </div>
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="cta-container">
          <h2 className="cta-title">Start Shopping Today!</h2>
          <p className="cta-description">
            Shop with confidence and enjoy fast delivery, secure payments, and exceptional customer service.
          </p>
          <button onClick={onNavigateToProducts} className="secondary-button">
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;