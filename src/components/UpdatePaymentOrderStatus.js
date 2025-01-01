import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { host } from '../script/variables';

const UpdatePaymentOrderStatus = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const UpdateOrderStatus = async (orderId,planId,addressId)=>{

        const token = localStorage.getItem('mealdelight');
        if (!token) {
            throw new Error("No authentication token found");
        }
    
        // Set up the request headers with the token
        const response = await fetch(`${host}/payment/update_order_status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify({orderId:orderId})
        });
    
        // Handle response
        if (response.ok) {
            if(planId!=null){
              await subscribe(planId,addressId)
            }
            else{
              navigate('/dashboard');
            }
           
        }
        else{
            alert('There is an error')
        }
        
    }
    const subscribe = async (planId,addressId) => {
      console.log('subscribe called')
        if(planId===null){
            navigate('/dashboard')
            

        }
      try {
        const payload = {
          planId: planId,
          couponName: null,
          addressId:addressId
        };
    
        
    
        const token = localStorage.getItem('mealdelight');
        if (!token) {
          throw new Error('No authentication token found');
        }
    
        const response = await fetch(`${host}/plans/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
          const data = await response.json();
          const message = data.message || 'Failed to subscribe to plan';
          
          
        }
    
        // If subscription succeeds
       
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error subscribing to plan:', error.message);
        
      }
    };

    useEffect(() => {

      // Parse query parameters from the URL
      const params = new URLSearchParams(location.search);
      const orderId = params.get('order_id');
      const planId = params.get('plan_id');
      const addressId = params.get('address_id');
      // setPlanId(planId)
      console.log('order id is ',orderId,planId)
      UpdateOrderStatus(orderId,planId,addressId);
      
    }, []);
  return (
    <div>
      Loading...
    </div>
  )
}

export default UpdatePaymentOrderStatus
