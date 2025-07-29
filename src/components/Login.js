import React, { useState } from 'react';
import '../style/loginForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { host } from '../script/variables';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './home/ResetPassword';

function Login() {
  const navigate = useNavigate();
  const [phone, setphone] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isResetPasswordOn, setIsResetPasswordOn] = useState(false);

  const login = async (data) => {
    try {
      const resp = await axios.post(`${host}/user/login`, data);
      console.log('headers are ', resp);
      
      if (resp.status === 200) {
        const token1 = resp.headers.authorization;
        localStorage.setItem('mealdelight', token1);

        toast.success('Login successful! Redirecting...', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });

        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast.error(resp.data?.msg || 'Login failed');
      }
    } catch (error) {
      console.log("Error show", error);
      toast.error(error.response?.data?.msg || "Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.warn('Please fill in all fields');
      return;
    }
    login({ phone, password });
  };

  return (

   
    <>
      <div className="form-container">
        <ToastContainer />
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Contact number"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-sm login-btn">
            Login
          </button>
        </form>
      </div>
    </>
  )}

  



  


export default Login;
