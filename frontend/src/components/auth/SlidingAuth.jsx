import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import './SlidingAuth.css';

const SlidingAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate]);

  const handleSignUpMode = () => {
    setIsSignUp(true);
    setError('');
    setSuccess('');
  };

  const handleSignInMode = () => {
    setIsSignUp(false);
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(loginData);
      
      if (response.success) {
        login(response.data);
        
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      } else {
        setError(response.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await authService.register(registerData);
      
      if (response.success) {
        setSuccess('Registration successful! Please sign in.');
        setRegisterData({ name: '', email: '', password: '' });
        setTimeout(() => {
          setIsSignUp(false);
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`auth-container ${isSignUp ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">          {/* Sign In Form */}
          <form onSubmit={handleLoginSubmit} className="sign-in-form">
            <h2 className="title">Sign In</h2>
            
            {error && !isSignUp && <div className="error-message">{error}</div>}
              <div className="input-field">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>
            
            <div className="input-field">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              disabled={loading && !isSignUp}
            >
              {loading && !isSignUp ? "Signing In..." : "Login"} 
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            
            <p className="social-text">Welcome back to Kitchen Core</p>
          </form>

          {/* Sign Up Form */}
          <form onSubmit={handleRegisterSubmit} className="sign-up-form">
            <h2 className="title">Create Account</h2>
            
            {error && isSignUp && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
              <div className="input-field">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />
            </div>
            
            <div className="input-field">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
            </div>
            
            <div className="input-field">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
                minLength="6"
                required
              />            </div>
              <button 
              type="submit" 
              className="btn" 
              disabled={loading && isSignUp}
            >
              {loading && isSignUp ? "Creating Account..." : "Sign Up"} 
              <i className="fa-solid fa-user-plus"></i>
            </button>
            
            <p className="social-text">Start your culinary journey today</p>
          </form>
        </div>
      </div>

      <div className="panels-container">        <div className="panel left-panel">
          <div className="content">
            <h3>New to Kitchen Core?</h3>
            <p>
              Join our community of food lovers and start sharing your recipes today!
            </p>
            <button className="btn transparent" onClick={handleSignUpMode}>
              Sign Up
            </button>
          </div>
          <img src={require("../../styles/img/baker.png")} className="image" alt="Baker" />
        </div>
        
        <div className="panel right-panel">
          <div className="content">
            <h3>Already a member?</h3>
            <p>
              Sign in to access your recipes and continue your culinary journey.
            </p>
            <button className="btn transparent" onClick={handleSignInMode}>
              Sign In
            </button>
          </div>
          <img src={require("../../styles/img/hot-pot.png")} className="image" alt="Hot Pot" />
        </div>
      </div>
    </div>
  );
};

export default SlidingAuth;
