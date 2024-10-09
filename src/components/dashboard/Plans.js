import React, { useEffect, useState } from 'react';
import '../../style/userdashboard/plans.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Plans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [couponStates, setCouponStates] = useState({}); // Object to store coupon states for each plan

  const verifyCoupon = async (name, planId) => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:3002/coupons/verify?name=${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setCouponStates(prevState => ({
          ...prevState,
          [planId]: { couponName: name, coupon: null, isCouponVerified: false }
        }));
      } else {
        const data = await response.json();
        setCouponStates(prevState => ({
          ...prevState,
          [planId]: { couponName: name, coupon: data, isCouponVerified: true }
        }));
      }
    } catch (error) {
      console.error('Error verifying coupon:', error.message);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:3002/plans/get_plans?page=${page}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();
      setPlans((prevPlans) => [...prevPlans, ...data.plans]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching plans:', error.message);
    }
  };

  const fetchMyPlans = async () => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:3002/plans/get_my_plans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch my plans");
      }

      const data = await response.json();
      setMyPlans(data.plans);
    } catch (error) {
      console.error('Error fetching my plans:', error.message);
    }
  };

  useEffect(() => {
    fetchMyPlans();
    fetchPlans();
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const toggleMenu = (planId) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const subscribe = async (planId) => {
    try {
      const token = localStorage.getItem('mealdelight');
      const couponData = couponStates[planId] || {};
      const payload = {
        planId: planId,
        couponName: couponData.couponName || null,
      };

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:3002/plans/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe to plan");
      } else {
        const data = await response.json();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error.message);
    }
  };

  const remainingDays = (purchasedDate, period) => {
    const purchasedMoment = moment(purchasedDate);
    const expiryMoment = purchasedMoment.add(period, 'days');
    const now = moment();
    const diff = expiryMoment.diff(now);

    if (diff > 0) {
      const diffDuration = moment.duration(diff);
      if (diffDuration.days() > 0) {
        return `${diffDuration.days()} day(s) remaining`;
      } else {
        return `Expiring in ${diffDuration.hours()} hour(s) and ${diffDuration.minutes()} minute(s)`;
      }
    } else {
      return 'Plan has expired';
    }
  };

  const calculateFinalPrice = (price, discount, planId) => {
    const couponData = couponStates[planId] || {};
    if (couponData.isCouponVerified && couponData.coupon) {
      const discountedPrice = price - (price * discount / 100);
      return discountedPrice - (discountedPrice * couponData.coupon.discount / 100);
    } else {
      return price - (price * discount / 100);
    }
  };
const subscribeAlert = async (planId)=>{
  const userConfirmed = window.confirm("Are you sure you want to subscribe to this plan?");
  if (userConfirmed) {
      await subscribe(planId);
  } else {
      return; // User canceled, do nothing
  }
}
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <div>
      <h2>Active Plans</h2>
      {myPlans.map((plan) => (
        <div key={plan._id} className="plan-card">
          <h3>{plan.planDetails.name}</h3>
          <p>{remainingDays(plan.purchasedDate, plan.planDetails.period)}</p>

          {remainingDays(plan.purchasedDate, plan.planDetails.period) === 'Plan has expired' && (
            <>
              <p>Price: ₹{plan.planDetails.price}</p>
              {plan.planDetails.discount > 0 && <p>Discount: {plan.planDetails.discount}%</p>}
              
              {plan.isCoupon === 'true' ? (
                <>
                  <input
                    type="text"
                    value={couponStates[plan._id]?.couponName || ''}
                    onChange={(e) => verifyCoupon(e.target.value, plan._id)}
                    placeholder="Coupon"
                  />
                  {couponStates[plan._id]?.isCouponVerified && couponStates[plan._id]?.coupon && (
                    <p>Coupon: {couponStates[plan._id].coupon.discount}% applied</p>
                  )}
                </>
              ) : (
                'No Coupons for trial'
              )}

              <br />
              <button onClick={() => toggleMenu(plan.plan_id)}>
                {expandedPlan === plan.plan_id ? 'Hide Menu' : 'View Menu'}
              </button>
              <button onClick={() => subscribeAlert(plan.plan_id)}>
                Subscribe (Pay: ₹{calculateFinalPrice(plan.planDetails.price, plan.planDetails.discount, plan._id).toFixed(2)})
              </button>
              {expandedPlan === plan.plan_id && (
                <div className="menu">
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingTop: '100%', // Maintain the aspect ratio
                    boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
                    marginTop: '1.6em',
                    marginBottom: '0.9em',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    willChange: 'transform',
                  }}
                >
                  <iframe
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      border: 'none',
                      padding: 0,
                      margin: 0,
                    }}
                    src={`${plan.planDetails.menu}?embed`} // Correctly using template literals in React
                    allowFullScreen // Use camelCase in React for attributes
                    allow="fullscreen"
                  ></iframe>
                </div>
              </div>
              )}
            </>
          )}
        </div>
      ))}

      <h2>Available Plans</h2>
      {plans.map((plan) => (
        <div key={plan._id} className="plan-card">
          <h3>{plan.name}</h3>
          <p>Price: ₹{plan.price}</p>
          {plan.discount > 0 && <p>Discount: {plan.discount}%</p>}

          {plan.isCoupon === 'true' ? (
            <>
              <input
                type="text"
                value={couponStates[plan._id]?.couponName || ''}
                onChange={(e) => verifyCoupon(e.target.value, plan._id)}
                placeholder="Coupon"
              />
              {couponStates[plan._id]?.isCouponVerified && couponStates[plan._id]?.coupon && (
                <p>Coupon: {couponStates[plan._id].coupon.discount}% applied</p>
              )}
            </>
          ) : (
            'No Coupons for trial'
          )}

          <br />
          <button onClick={() => toggleMenu(plan._id)}>
            {expandedPlan === plan._id ? 'Hide Menu' : 'View Menu'}
          </button>
          <button onClick={() => subscribeAlert(plan._id)}>
            Subscribe (Pay: ₹{calculateFinalPrice(plan.price, plan.discount, plan._id).toFixed(2)})
          </button>
          {expandedPlan === plan._id && (
           <div className="menu">
           <div
             style={{
               position: 'relative',
               width: '100%',
               height: 0,
               paddingTop: '100%', // Maintain the aspect ratio
               boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
               marginTop: '1.6em',
               marginBottom: '0.9em',
               overflow: 'hidden',
               borderRadius: '8px',
               willChange: 'transform',
             }}
           >
             <iframe
               loading="lazy"
               style={{
                 position: 'absolute',
                 width: '100%',
                 height: '100%',
                 top: 0,
                 left: 0,
                 border: 'none',
                 padding: 0,
                 margin: 0,
               }}
               src={`${plan.menu}?embed`} // Correctly using template literals in React
               allowFullScreen // Use camelCase in React for attributes
               allow="fullscreen"
             ></iframe>
           </div>
         </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Plans;
