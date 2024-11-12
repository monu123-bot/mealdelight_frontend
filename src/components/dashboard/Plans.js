import React, { useEffect, useState } from 'react';
import '../../style/userdashboard/plans.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { host } from '../../script/variables';

const Plans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [couponName, setCouponName] = useState('');
  const [planId, setPlanId] = useState(null);
  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const verifyCoupon = async (name, currentPlanId) => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch(`${host}/coupons/verify?name=${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setPlanId(currentPlanId);
        setCouponName(name);
        setIsCouponVerified(false);
      } else {
        const data = await response.json();
        setPlanId(currentPlanId);
        setCouponName(name);
        setCouponDiscount(data.discount);
        setIsCouponVerified(true);
      }
    } catch (error) {
      console.error('Error verifying coupon:', error.message);
    }
  };

  const handleCouponInputChange = (name, currentPlanId) => {
    setCouponName(name);
    setPlanId(currentPlanId);
    if (name.length > 5) {
      verifyCoupon(name, currentPlanId);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${host}/plans/get_plans?page=${page}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch plans");

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
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${host}/plans/get_my_plans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch my plans");

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

  const toggleMenu = (currentPlanId) => {
    setExpandedPlan(expandedPlan === currentPlanId ? null : currentPlanId);
  };

  const subscribe = async (currentPlanId) => {
    try {
      const token = localStorage.getItem('mealdelight');
      const payload = {
        planId: currentPlanId,
        couponName: couponName || null,
      };

      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${host}/plans/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to subscribe to plan");

      const data = await response.json();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error subscribing to plan:', error.message);
    }
  };

  const subscribeAlert = async (currentPlanId) => {
    const userConfirmed = window.confirm("Are you sure you want to subscribe to this plan?");
    if (userConfirmed) await subscribe(currentPlanId);
  };

  const calculateFinalPrice = (price, discount) => {
    const discountedPrice = price - (price * discount / 100);
    return isCouponVerified ? discountedPrice - (discountedPrice * couponDiscount / 100) : discountedPrice;
  };

  const remainingDays = (purchasedDate, period) => {
    const purchasedMoment = moment(purchasedDate);
    const expiryMoment = purchasedMoment.add(period, 'days');
    const now = moment();
    const diff = expiryMoment.diff(now);

    if (diff > 0) {
      const diffDuration = moment.duration(diff);
      return diffDuration.days() > 0 ? `${diffDuration.days()} day(s) remaining` : `Expiring in ${diffDuration.hours()} hour(s) and ${diffDuration.minutes()} minute(s)`;
    } else {
      return 'Plan has expired';
    }
  };

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
                    value={planId === plan._id ? couponName : ''}
                    onChange={(e) => handleCouponInputChange(e.target.value, plan._id)}
                    placeholder="Coupon"
                  />
                  {planId === plan._id && isCouponVerified && couponDiscount > 0 && (
                    <p>Coupon: {couponDiscount}% applied</p>
                  )}
                </>
              ) : (
                'No Coupons for trial'
              )}

       

              <button onClick={() => subscribeAlert(plan.plan_id)}>
                Subscribe (Pay: ₹{calculateFinalPrice(plan.planDetails.price, plan.planDetails.discount).toFixed(2)})
              </button>
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
                value={planId === plan._id ? couponName : ''}
                onChange={(e) => handleCouponInputChange(e.target.value, plan._id)}
                placeholder="Coupon"
              />
              {planId === plan._id && isCouponVerified && couponDiscount > 0 && (
                <p>Coupon: {couponDiscount}% applied</p>
              )}
            </>
          ) : (
            'No Coupons for trial'
          )}

          <button onClick={() => toggleMenu(plan._id)}>
            {expandedPlan === plan._id ? 'Hide Menu' : 'View Menu'}
          </button>
          <button onClick={() => subscribeAlert(plan._id)}>
            Subscribe (Pay: ₹{calculateFinalPrice(plan.price, plan.discount).toFixed(2)})
          </button>
        </div>
      ))}
    </div>
  );
};

export default Plans;
