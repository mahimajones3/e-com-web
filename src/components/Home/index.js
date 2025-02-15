import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './index.css'; 

const Home = () => {
  const [userData, setUserData] = useState({ username: '' });
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShoppingBag className="feature-icon" />,
      title: "Wide Selection",
      description: "Browse through thousands of curated products",
    },
    {
      icon: <TrendingUp className="feature-icon" />,
      title: "Best Deals",
      description: "Unbeatable prices and regular discounts",
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Secure Shopping",
      description: "100% secure payments and data protection",
    },
    {
      icon: <Truck className="feature-icon" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping services",
    },
  ];

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        await Promise.all([fetchHomeData(), fetchProducts()]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const fetchHomeData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/home', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    setUserData(data.user);
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    setProducts(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigateToProducts = () => {
    navigate('/productlist');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home-container">        
      <main className="home-main">
        <div className="hero-section">
          <div className="hero-grid">
            <div className="hero-text">
              <h1 className="hero-title">Discover the Best Deals on Your Favorite Products!</h1>
              <p className="hero-description">
                Your one-stop destination for high-quality products at unbeatable prices. From trendy
                fashion and electronics to home essentials and more.
              </p>
              <button onClick={handleNavigateToProducts} className="shop-now-button">
                Shop Now
              </button>
            </div>

          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div>{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <h2 className="cta-title">Start Shopping Today!</h2>
          <p className="cta-description">
            Shop with confidence and enjoy fast delivery, secure payments, and exceptional customer
            service.
          </p>
          <button onClick={handleNavigateToProducts} className="explore-button">
            Explore Products
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;