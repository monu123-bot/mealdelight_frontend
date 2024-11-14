import React, { useState, useEffect } from 'react';
import { host } from '../script/variables';
import '../style/HomePlans.css'
import { Link } from 'react-router-dom';
const HomePlans = () => {
  const [plans, setPlans] = useState([]);
  
 

  const fetchPlans = async () => {
    try {
     

      const page = 1;
      const response = await fetch(`${host}/plans/get_all_plans?page=${page}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();
      setPlans(data.plans);
    
    } catch (error) {
      console.error('Error fetching plans:', error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []); // Fetch plans on component mount

  return (

    <div className="home-plans-container">
      <h2 className='q1-h'>Meal Plans</h2>
      <div className="plans-slider">
        {plans.map((plan) => (
           <Link 
           key={plan._id} 
           to={`/plandetails?plan_id=${plan._id}`} // Correct query parameter format
         >
           <div className="plan-card">
             <h3>{plan.name}</h3>
             <p>Price: ₹{plan.price}</p>
             {plan.discount > 0 && <p>Discount: {plan.discount}%</p>}
             {/* Add any other plan details here */}
           </div>
         </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePlans;
