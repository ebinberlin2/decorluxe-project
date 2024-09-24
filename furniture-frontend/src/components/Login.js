import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      
      // If the login is successful, store the token in localStorage
      if (response.status === 200) {
        const { token } = response.data; // Assuming the response contains a JWT token
        localStorage.setItem('authToken', token); // Store the token in localStorage
        navigate('/'); // Redirect to the home page or wherever you'd like
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error.response ? error.response.data : error.message);
      alert("An error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="character"></div>
      </div>
      <div className="right-section">
        <div className="form-container">
          <h2>Decide faster <br /><span>so you can do more</span></h2>
          <button className="google-login-button">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google Logo" />
            Login with Google
          </button>
          <p className="or-text">Or login with e-mail</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <a href="/" className="forgot-password">Forgot password?</a>
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="signup-text">
            Don’t have an account? <a href="/">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
