import React, { useEffect, useState } from 'react'
import History from './dashboard/History'
import Dues from './dashboard/Dues'
import Wallet from './dashboard/Wallet'
import Plans from './dashboard/Plans'
import '../style/userdashboard.css'
import { host } from '../script/variables'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyToken } from '../script/tokenVerification'
const UserDashboard = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const [user,setUser] = useState(null)
    const [main_val,setMainval] = useState(2)
    const fetchUser = async()=>{
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('mealdelight');
            if (!token) {
                throw new Error("No authentication token found");
            }
    
            // Set up the request headers with the token
            const response = await fetch(`${host}/user/user_details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // Handle response
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
    
            // Parse the JSON response
            const userData = await response.json();
            console.log('User Details:', userData);
            
            // You could return or use the user data here
            setUser(userData)
    
        } catch (error) {
            console.error('Error fetching user details:', error.message);
        }
    }
    useEffect(()=>{
        const checkLogin = async () => {
            try {
             
              const token_resp = await verifyToken();
              console.log(token_resp);
        
              if (!token_resp.isVerified) {
                
                navigate('/')
                
              }
              else{
                fetchUser()
              }
        
             
            } catch (error) {
              console.error("Error in useEffect:", error);
            }
          };
          checkLogin()
    },[])
  return (
    <div className='dash-cont'>
    {(user) && <>
       
    <div className='wallet'>
    <p>Hyy {user.firstName} </p> 
        <p>Available Balance (INR):{Number(user.walletbalance).toFixed(2)} </p>
    </div>
    <div className='action'>
        <div className='action-options'>
            <div className='action-option' onClick={() => setMainval(0)}>History</div>
            
            <div className='action-option' onClick={() => setMainval(1)}>Wallet</div>
            <div className='action-option' onClick={() => setMainval(2)}>Plans</div>
        </div>
    </div>
    <div className='main'>
        {main_val === 0 && <History />}
        
        {main_val === 1 && <Wallet user={user} setUser={setUser} />}
        {main_val === 2 && <Plans user={user} setUser={setUser}  />}
    </div>
    
    </>}
    
</div>
  )
}

export default UserDashboard
