import React, { useEffect, useState } from 'react'
import '../../style/userdashboard/wallet.css'
import {load} from '@cashfreepayments/cashfree-js';
// import { updateOrderStatus } from '../../../../../server/Controller/Payment';
import { useLocation } from 'react-router-dom';
import WalletHistory from './WalletHistory';
import { host } from '../../script/variables';
const Wallet = ({user,setUser}) => {
    const location = useLocation();
    const [sessionId,setSessionId] = useState(null)
let cashfree;
var initializeSDK = async function () {                      
    cashfree = await load({
        mode: "production"
    });
};
initializeSDK();
    const [amount, setAmount] = useState(''); // State to hold the amount input
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + 17 * 60000); 
    const handleAmountChange = (e) => {
        setAmount(e.target.value); // Update the amount state on input change
    };

    const handleAddToWallet =async () => {
        console.log('this is 1')
        let curTimeStamp =Date.now()
        let order_id = `${user._id}-${curTimeStamp}`
        if (!amount) {
            alert("Please enter a valid amount"); // Simple validation
            return;
        }
        let data = {
            order_amount: amount,
    order_currency: "INR",
    order_id: `${order_id}`,
    customer_details: {
        customer_id: `${user._id}`,
        customer_phone: `${user.phone}`,
        customer_name: `${user.firstName} ${user.lastName}`,
        customer_email: `${user.email}`
    },
    order_meta: {
        return_url: `https://themealdelight.in/uos?order_id=${order_id}`,
        notify_url: "https://www.cashfree.com/devstudio/preview/pg/webhooks/75802411",
        payment_methods: "cc,dc,upi"
    },
    order_expiry_time: `${expiryTime.toISOString()}`
        }
        
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('mealdelight');
            if (!token) {
                throw new Error("No authentication token found");
            }
    
            // Set up the request headers with the token
            const response = await fetch(`${host}/payment/create_order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body:JSON.stringify(data)
            });
    
            // Handle response
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
    
            // Parse the JSON response
            const paymentOrderDetails = await response.json();
            console.log('User Details:', paymentOrderDetails);
            setSessionId(paymentOrderDetails.payment_session_id)
            await doPayment(paymentOrderDetails.payment_session_id)
            // await UpdateOrderStatus(order_id)
            // You could return or use the user data here
            // setUser(userData)
    
        } catch (error) {
            console.error('Error fetching user details:', error.message);
        }
 

        setAmount('');
    };
    const doPayment = async (sessionid, order_id) => {
        console.log('Initiating payment...');
        
        let checkoutOptions = {
            paymentSessionId: sessionid,
            redirectTarget: "_self"
            
        };

       cashfree.checkout(checkoutOptions);
        
        
        
    };
  
    return (
        <>
        <div className='wallet-container'>
            <h3>Add to Wallet</h3>
            <input 
                type='number' 
                value={amount} 
                onChange={handleAmountChange} 
                placeholder='Enter amount' 
                className='amount-input'
            />
             <div class="row">
            {/* <p>Click below to open the checkout page in current tab</p> */}
            {/* <button type="submit" class="btn btn-primary" id="renderBtn" onClick={doPayment}>
                Pay Now
            </button> */}
        </div>
            <button onClick={handleAddToWallet} className='add-button'>Add</button>
            
        </div>
        <br/>
        <WalletHistory  />
        </>
    );
}

export default Wallet



