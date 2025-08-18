import React, { useState, useContext, useEffect } from "react";
import { login } from "../services/authService.js";
import { AuthContext } from "../context/AuthContext.js";
import {useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await login(userId, password);
      contextLogin(data.token); // Save token to context & localStorage
      setMessage("Login successful!");
      setUserId("");
      setPassword("");

      // ✅ Redirect to /clients after successful login
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
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
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>
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
            className={`auth-button ${isLoading ? 'loading...' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Login'}
          </button>
<p className="footer-text">Don't have an account <a className="auth-link" href="/signup">Go to Signup Page</a></p>
        </form>

        {message && (
          <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
