import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to include this CSS
import { useNavigate } from 'react-router-dom';
import './Login.css';

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
      
      if (response.status === 200) {
        const { token } = response.data; 
        localStorage.setItem('authToken', token);

        // Show success toast
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000 // Display for 3 seconds
        });

        // Delay navigation to allow the toast to be seen
        setTimeout(() => {
          navigate('/'); // Redirect to the home page
        }, 3000); // Same duration as the toast duration
      }
    } catch (error) {
      console.error("Error during login:", error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 404) {
        toast.error("User doesn't exist", {
          position: "top-center",
          autoClose: 3000
        });
      } else if (error.response && error.response.status === 401) {
        toast.error("Invalid credentials", {
          position: "top-center",
          autoClose: 3000
        });
      } else {
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
          autoClose: 3000
        });
      }
    }
  };

  return (
    <div className="login-container">
      <ToastContainer /> {/* Add ToastContainer here */}
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
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
