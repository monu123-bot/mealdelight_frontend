import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UpdatePaymentOrderStatus = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const UpdateOrderStatus = async (orderId)=>{

        const token = localStorage.getItem('mealdelight');
        if (!token) {
            throw new Error("No authentication token found");
        }
    
        // Set up the request headers with the token
        const response = await fetch('http://localhost:3002/payment/update_order_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify({orderId:orderId})
        });
    
        // Handle response
        if (response.ok) {

            navigate('/dashboard');
        }
        else{
            alert('There is an error')
        }
        
                
    }

    useEffect(() => {
        // Parse query parameters from the URL
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id');
      console.log('order id is ',orderId)
        UpdateOrderStatus(orderId);
       
    }, []);
  return (
    <div>
      Loading...
    </div>
  )
}

export default UpdatePaymentOrderStatus
