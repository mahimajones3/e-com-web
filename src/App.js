import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Home from './components/Home';
import Header from './components/Header';
import Products from './components/Products';
import ProductList from './components/ProductList';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on component mount
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const { username } = JSON.parse(userData);
        setUsername(username);
        setIsLoggedIn(true);
      }
    }
    setIsLoading(false);
  }, []);

  // Protected Route component with loading state
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    
    return (
      <>
        <Header username={username} onLogout={handleLogout} />
        {children}
      </>
    );
  };

  const handleLoginSuccess = (userData) => {
    setUsername(userData.username);
    setIsLoggedIn(true);
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify({
      username: userData.username,
      id: userData.id
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={
                isLoggedIn ? 
                <Navigate to="/home" replace /> : 
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              } 
            />
            
            <Route 
              path="/" 
              element={
                isLoggedIn ? 
                <Navigate to="/home" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                isLoggedIn ? 
                <Navigate to="/home" replace /> : 
                <SignupForm />
              } 
            />
            
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home username={username} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/productlist" 
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="*" 
              element={
                <div className="not-found">
                  <h2>404 - Page Not Found</h2>
                  <Link to="/home">Return to Home</Link>
                </div>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;