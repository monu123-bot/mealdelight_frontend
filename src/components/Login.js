import React, { useState } from 'react';
import '../style/loginForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { host } from '../script/variables';
function Login() {
    const navigate = useNavigate();
  const [phone, setphone] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  
  const login =async (data)=>{
    try {
      const resp = await axios.post(`${host}/user/login`, data);
      console.log('headers are ',resp)
      if (resp.status === 200) {
        
        
          const time = new Date().getTime()
          const token1 = resp.headers.authorization
      localStorage.setItem('mealdelight', token1);
      navigate('/dashboard');
      } 
  } catch (error) {
      console.log("Error show", error)
  }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('phone:', phone);
    console.log('Password:', password);
    console.log('Checked:', isChecked);
login({phone,password})
  };

  return (
    <div className="form-container">
      <br/>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
         
          <input
            type="text"
            className="form-control"
            id="exampleInputphone1"
            aria-describedby="phoneHelp"
            placeholder="Contact number"
            value={phone}
            onChange={(e) => setphone(e.target.value)}
          />
          
        </div>
        
        <div className="form-group">
        
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
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
  );
}

export default Login;
