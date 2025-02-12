import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Home from './components/Home';
import Header from './components/Header';
import Products from './components/Products';
import ProductList from './components/ProductList';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const handleLoginSuccess = (userData) => {
    setUsername(userData.username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                isLoggedIn ? 
                <Navigate to="/home" replace /> : 
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              } 
            />
            
            <Route path="/signup" element={<SignupForm />} />
            
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home username={username} onLogout={handleLogout} />
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
            
            <Route path="/header" element={<Header />} />
            
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;