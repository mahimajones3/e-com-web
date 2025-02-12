import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Home from "./components/Home";
import Header from "./components/Header";
import Products from "./components/Products";
import ProductList from "./components/ProductList";

function App() {
  return (
    <Router>
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/products" element={<Products />} />
            <Route path="/home" element={<Home />} />
            <Route path="/header" element={<Header />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;