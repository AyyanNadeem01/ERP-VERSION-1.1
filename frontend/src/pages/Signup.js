import React, { useState, useEffect } from "react";
import { signup } from "../services/authService";
import { Link } from "react-router-dom";
import "../styles/auth.css";

const Signup = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await signup(userId, password);
      setMessage(data.message);
      setUserId("");
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 3D card effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = document.querySelector('.auth-container');
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      const card = document.querySelector('.auth-container');
      if (card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="auth-wrapper">
      {/* Floating Background Elements */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      <div className="auth-container">
        <div className="logo-container">
          <div className="logo">FX</div>
          <h2>Create Account</h2>
          <p className="subtitle">Join thousands of users worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              className="auth-input"
              id="userId"
              placeholder=" "
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <label className="floating-label" htmlFor="userId">User ID</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              className="auth-input"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="floating-label" htmlFor="password">Password</label>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Create Account'}
          </button>
        </form>

        {message && (
          <div className={`auth-message ${message.includes('success') || message.includes('Welcome') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <p className="footer-text">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;