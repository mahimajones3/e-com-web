import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Home = () => {
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data and products
    fetchHomeData();
    fetchProducts();
  }, [navigate]);

  const fetchHomeData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/home', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch home data');
      }

      const data = await response.json();
      setUsername(data.user.username);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('401')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigateToProducts = () => {
    navigate('/products');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="home-page">
      <header className="header-bar">
        <div className="header-content">
          <h2>Welcome, {username || 'Guest'}!</h2>
          <button onClick={handleLogout} className="logout-button">
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
              <button onClick={handleNavigateToProducts} className="primary-button">
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
          <button onClick={handleNavigateToProducts} className="secondary-button">
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;