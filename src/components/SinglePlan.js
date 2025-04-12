import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { host } from '../script/variables';
import '../style/SinglePlan.css';
import Footer from './Footer';
import Header from './Header';
import { verifyToken } from '../script/tokenVerification';
import Login from './Login';

const SinglePlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [coupon, setCoupon] = useState('');
  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [couponData, setCouponData] = useState(null);

  const calculateFinalPrice = (price, discount) => {
    let discountedPrice = price - (price * discount / 100);
    if (isCouponVerified && couponData) {
      discountedPrice -= (discountedPrice * couponData.discount / 100);
    }
    return Math.round(discountedPrice);
  };

  const subscribe = async (planId) => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) throw new Error("No authentication token found");

      const payload = {
        planId: planId,
        couponName: isCouponVerified ? coupon : null,
      };

      const response = await fetch(`${host}/plans/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to subscribe to plan");
      await response.json();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error subscribing to plan:', error.message);
    }
  };

  const verifyCoupon = async (name) => {
    if (!name.trim()) {
      setCouponData(null);
      setIsCouponVerified(false);
      return;
    }

    try {
     
      const response = await fetch(`${host}/coupons/verify?name=${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          
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
      setCouponData(null);
      setIsCouponVerified(false);
    }
  };

  const subscribeAlert = async (planId) => {
    const userConfirmed = window.confirm("Are you sure you want to subscribe to this plan?");
    if (userConfirmed) {
      await subscribe(planId);
    }
  };

  const fetchPlanDetails = async (planId) => {
    if (!planId) {
      setError("No plan ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${host}/plans/plandetails?id=${planId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch plan details');
      const data = await response.json();
      setPlan(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plan details:', error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token_resp = await verifyToken();
        if (token_resp.isVerified) {
          setLoggedIn(true);
          setUser(token_resp.user);
        }

        const params = new URLSearchParams(location.search);
        const planId = params.get('plan_id');
        if (planId) {
          await fetchPlanDetails(planId);
        } else {
          setError("No plan ID provided");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
        setError("Failed to load page data");
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  if (loading) return <><Header /><div className="single-plan-container"><div className="loading">Loading...</div></div><Footer /></>;
  if (error) return <><Header /><div className="single-plan-container"><div className="error">{error}</div></div><Footer /></>;
  if (!plan) return <><Header /><div className="single-plan-container"><div className="error">Plan not found</div></div><Footer /></>;

  return (
    <>
      <Header />
      <div className="single-plan-container">
        <div className="plan-card1">
          <img className="plan-thumbnail" src={plan.thumbnail} alt={plan.name} />
          <div className="plan-details">
            <h1>{plan.name}</h1>
            <p className="plan-description">{plan.description}</p>
            <p style={{color:'black'}}><strong>Duration:</strong> {plan.period} days</p>
            <p style={{color:'black'}}><strong>Original Price:</strong> ₹{plan.price}</p>
            <p style={{color:'black'}}><strong>Plan Discount:</strong> {plan.discount}%</p>
            <p style={{color:'black'}} className="final-price">Final Price: ₹{calculateFinalPrice(plan.price, plan.discount)}</p>

            <a href={plan.menu} target="_blank" rel="noopener noreferrer" className="menu-link">View Menu</a>

            {plan.isCoupon === 'true' && (
              <>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="coupon-input"
                />
                <button className="verify-btn" onClick={() => verifyCoupon(coupon)}>Verify Coupon</button>
              </>
            )}

            {isCouponVerified && couponData && (
              <div className="coupon-success">Coupon Verified! Extra Discount: {couponData.discount}%</div>
            )}
{isLoggedIn  && (

<button className="subscribe-btn" onClick={() => subscribeAlert(plan._id)}>
              Subscribe
              </button>
)}
{!isLoggedIn && (
  <button className="subscribe-btn" >
              Login to Subscribe
              </button>
)
  }

          </div>
        </div>
      </div>
      {!isLoggedIn && <Login />}
      <Footer />
    </>
  );
};

export default SinglePlan;
