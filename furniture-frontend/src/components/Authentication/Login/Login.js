import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) ? '' : 'Please enter a valid email address' }));
    } else if (name === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) ? '' : 'Password must be at least 6 characters long' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (errors.email || errors.password || !formData.email || !formData.password) {
      toast.error("Please fix the errors before submitting.", { position: "top-center", autoClose: 3000 });
      return;
    }
  
    setIsSubmitting(true); 
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
  
      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem('authToken', token);
  
        toast.success("Login successful!", { position: "top-center", autoClose: 3000 });
  
        setTimeout(() => {
          if (role === 'seller') {
            navigate('/seller'); 
          } else {
            navigate('/'); 
          }
        }, 3000);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        const errorMessage = error.response.status === 404 ? "User doesn't exist" :
                             error.response.status === 401 ? "Invalid credentials" :
                             "An error occurred. Please try again.";
        toast.error(errorMessage, { position: "top-center", autoClose: 3000 });
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
