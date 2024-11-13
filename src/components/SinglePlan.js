import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { host } from '../script/variables';
import '../style/SinglePlan.css';

const SinglePlan = () => {
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch plan details based on plan ID
  const fetchPlanDetails = async (planId) => {
    try {
      const response = await fetch(`${host}/plans/plandetails?id=${planId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch plan details');
      }
      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error('Error fetching plan details:', error.message);
    }
  };

  // Call UpdateOrderStatus if needed
  const UpdateOrderStatus = async (planId) => {
    // Placeholder function for updating order status
    console.log('Updating order status for plan ID:', planId);
    // Add your status update logic here
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planId = params.get('plan_id');
    if (planId) {
      fetchPlanDetails(planId);
      UpdateOrderStatus(planId);
    }
  }, [location.search]);

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="single-plan-container">
      
      <h2>{plan.name}</h2>
      <p>Price: ₹{plan.price}</p>
      {plan.discount > 0 && <p>Discount: {plan.discount}%</p>}
      <p>Description: {plan.description}</p>
      <p>Duration: {plan.period} days</p>
      <button className="subscribe-btn" onClick={() => navigate(`/subscribe?plan_id=${plan._id}`)}>
        Subscribe Now
      </button>
    </div>
  );
};

export default SinglePlan;
