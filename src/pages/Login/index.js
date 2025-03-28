import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Assets/Img/Logo.png'
import Google from '../../Assets/Img/Google.png'
import Facebook from '../../Assets/Img/facebook.png'
import Apple from '../../Assets/Img/apple.png'
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('ranjithkumarproton@gmail.com');
  const [password, setPassword] = useState('ranjithkumarproton@gmail.com');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Add login-page class when component mounts
    document.body.classList.add('login-page');
    
    // Remove login-page class when component unmounts
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'ranjithkumarproton@gmail.com' && password === 'ranjithkumarproton@gmail.com') {
      // Set auth token in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/list');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={Logo} alt="HighBridge" className="logo" />
        <div className="hero-content">
          <h1 style={{marginTop: '4rem'}}>Building the Future...</h1>
          <p >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2>WELCOME BACK!</h2>
            <h1>Log In to your Account</h1>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="text"
                placeholder="Type here..."
                value={email}
                defaultValue="ranjithkumarproton@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password"
                placeholder="Type here..."
                defaultValue="ranjithkumarproton@gmail.com"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" checked={true}/>
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
                <img src={Google} alt="Google" />
                <span>Log In with Google</span>
              </button>
              
              <button type="button" className="social-button">
                <img src={Facebook} alt="Facebook" />
                <span>Log In with Facebook</span>
              </button>
              
              <button type="button" className="social-button">
                <img src={Apple} alt="Apple" style={{width: '16px'}} />
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