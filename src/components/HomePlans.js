import React, { useState, useEffect } from 'react';
import { host } from '../script/variables';
import '../style/HomePlans.css'
import { Link } from 'react-router-dom';
import Spinner from './spinner/Spinner';
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
        {plans.length ==0 && <Spinner/> }
        {plans.map((plan) => (
           <Link 
           key={plan._id} 
           to={`/plandetails?plan_id=${plan._id}`} // Correct query parameter format
         >
          <div className="plan-card" style={{ position: 'relative' }}>
  <h3>{plan.name}</h3>
  <div className='plan-img-div'>
    <img style={{ width: '200px' }} src={`${plan.thumbnail}`} alt={plan.name} />
  </div>
  {/* Display discount as a star */}
  {plan.discount > 0 && (
    <div 
      className="plan-discount" 
      style={{
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '5px 10px', 
        borderRadius: '50%', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
      }}
    >
      <span>⭐ {plan.discount}%</span>
    </div>
  )}
  {/* Add any other plan details here */}
</div>
         </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePlans;
