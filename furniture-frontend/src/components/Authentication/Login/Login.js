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

  // Define the base URL and endpoint here
  const BASE_URL = 'http://localhost:5000';
  const LOGIN_ENDPOINT = '/api/login';

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
      const response = await axios.post(`${BASE_URL}${LOGIN_ENDPOINT}`, formData);
  
      if (response.status === 200) {
        const { token, role } = response.data;
        console.log('User Role:', role);
        localStorage.setItem('authToken', token);
  
        toast.success("Login successful!", { position: "top-center", autoClose: 3000 });
  
        setTimeout(() => {
          console.log(`Redirecting to ${role}`);
          if (role.toLowerCase() === 'admin') {
            navigate('/admin');
          } else if (role.toLowerCase() === 'seller') {
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
          <p className="or-text">login with e-mail</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              id='email'
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            <input
              id='password'
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
            <a href="/" className="forgot-password">Forgot password?</a>
            <button id ="login" type="submit" className="login-button" disabled={isSubmitting}>
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
