import React, { useEffect } from 'react';
import Logo from '../../Assets/Img/Logo.png'
import './Login.css';

const Login = () => {
  useEffect(() => {
    // Add login-page class when component mounts
    document.body.classList.add('login-page');
    
    // Remove login-page class when component unmounts
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={Logo} alt="HighBridge" className="logo" />
        <div className="hero-content">
          <h1>Building the Future...</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2>WELCOME BACK!</h2>
            <h1>Log In to your Account</h1>
          </div>
          
          <form className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Type here..." />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Type here..." />
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" className="login-button">Log In</button>
            
            <div className="divider">
              <span>Or</span>
            </div>
            
            <div className="social-logins">
              <button type="button" className="social-button">
                <img src="/google-icon.png" alt="Google" />
                <span>Log In with Google</span>
              </button>
              
              <button type="button" className="social-button">
                <img src="/facebook-icon.png" alt="Facebook" />
                <span>Log In with Facebook</span>
              </button>
              
              <button type="button" className="social-button">
                <img src="/apple-icon.png" alt="Apple" />
                <span>Log In with Apple</span>
              </button>
            </div>
            
            <div className="signup-prompt">
              <span>New User? </span>
              <a href="/signup" className="signup-link">SIGN UP HERE</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 