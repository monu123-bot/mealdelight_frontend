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
  const [coupon, setCoupon] = useState('');
  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [activePlanId, setActivePlanId] = useState(null); // Track currently inputting plan ID

  const verifyCoupon = async (name, planId) => {
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
        setCouponData(null);
        setIsCouponVerified(false);
      } else {
        const data = await response.json();
        setCouponData(data);
        setIsCouponVerified(true);
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

      const response = await fetch(`${host}/plans/get_plans?page=${page}&limit=5`, {
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

      const response = await fetch(`${host}/plans/get_my_plans`, {
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
      const payload = {
        planId: planId,
        couponName: isCouponVerified ? coupon : null,
      };

      if (!token) {
        throw new Error("No authentication token found");
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

  const calculateFinalPrice = (price, discount) => {
    let discountedPrice = price - (price * discount / 100);
    if (isCouponVerified && couponData) {
      discountedPrice -= (discountedPrice * couponData.discount / 100);
    }
    return discountedPrice;
  };

  const subscribeAlert = async (planId) => {
    const userConfirmed = window.confirm("Are you sure you want to subscribe to this plan?");
    if (userConfirmed) {
      await subscribe(planId);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <div>
    <h2>Active Plans</h2>
    {(plans.length===0) && "Loading..."}
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
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value);
                    setActivePlanId(plan._id);
                    verifyCoupon(e.target.value, plan._id);
                  }}
                  placeholder="Coupon"
                />
                {isCouponVerified && couponData && (
                  <p>Coupon: {couponData.discount}% applied</p>
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
    {(plans.length===0) && "Loading..."}
    {plans.map((plan) => (

      <div key={plan._id} className="plan-card">
        <h3>{plan.name}</h3>
        <p>Price: ₹{plan.price}</p>
        {plan.discount > 0 && <p>Discount: {plan.discount}%</p>}
        {plan.isCoupon === 'true' ? (
          <>
            <input
              type="text"
              value={activePlanId === plan._id ? coupon : ''}
              onChange={(e) => {
                setCoupon(e.target.value);
                setActivePlanId(plan._id);
                verifyCoupon(e.target.value, plan._id);
              }}
              placeholder="Coupon"
            />
            {isCouponVerified && couponData && activePlanId === plan._id && (
              <p>Coupon: {couponData.discount}% applied</p>
            )}
          </>
        ) : (
          'No Coupons for trial'
        )}
        <button onClick={() => toggleMenu(plan._id)}>
          {expandedPlan === plan._id ? 'Hide Menu' : 'View Menu'}
        </button>
  
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 0,
            paddingTop: '100%',
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
            src={`${plan.menu}?embed`} // corrected template literal
            allowFullScreen
            allow="fullscreen"
          ></iframe>
        </div>
  
        <button onClick={() => subscribeAlert(plan._id)}>
          Subscribe (Pay: ₹{calculateFinalPrice(plan.price, plan.discount).toFixed(2)})
        </button>
      </div>
    ))}
  </div>
  
  );
};

export default Plans;
