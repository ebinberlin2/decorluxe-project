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
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // To track submission
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Please enter a valid email address'
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: ''
        }));
      }
    } else if (name === 'password') {
      if (!validatePassword(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: 'Password must be at least 6 characters long'
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (errors.email || errors.password || !formData.email || !formData.password) {
      toast.error("Please fix the errors before submitting.", {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }
  
    setIsSubmitting(true); // Disable button and start submitting
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
  
      if (response.status === 200) {
        const { token, role } = response.data; // Accessing the role from response
        localStorage.setItem('authToken', token);
  
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000
        });
  
        // Delay navigation to allow the toast to be seen
        setTimeout(() => {
          if (role === 'seller') {
            navigate('/seller'); // Redirect to Seller Dashboard
          } else {
            navigate('/'); // Redirect to Home for regular users
          }
        }, 3000); // Same duration as the toast duration
      }
    } catch (error) {
      setIsSubmitting(false); // Re-enable button on error
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
      <ToastContainer />
      <div className="left-section">
        <div className="character"></div>
      </div>
      <div className="right-section">
        <div className="form-container">
          <h2>Welcome Back! <br /><span>so you can do more</span></h2>
          <button className="google-login-button" disabled={isSubmitting}>
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
            {errors.email && <p className="error-text">{errors.email}</p>}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
            <a href="/" className="forgot-password">Forgot password?</a>
            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
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
