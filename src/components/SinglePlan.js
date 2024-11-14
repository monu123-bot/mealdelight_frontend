import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { host } from '../script/variables';
import '../style/SinglePlan.css';
import Footer from './Footer';
import Header from './Header';
import { verifyToken } from '../script/tokenVerification';
import Login from './Login';


const SinglePlan = () => {

  
  const [plan, setPlan] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const [user,setUser] = useState()
  const [isLoggedIn,setLogedin] = useState(false)
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [activePlanId, setActivePlanId] = useState(null); // Track currently inputting plan ID

  // Function to fetch plan details based on plan ID
  const calculateFinalPrice = (price, discount) => {
    let discountedPrice = price - (price * discount / 100);
    if (isCouponVerified && couponData) {
      discountedPrice -= (discountedPrice * couponData.discount / 100);
    }
    return discountedPrice;
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
  const toggleMenu = (planId) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };
  const subscribeAlert = async (planId) => {
    const userConfirmed = window.confirm("Are you sure you want to subscribe to this plan?");
    if (userConfirmed) {
      await subscribe(planId);
    }
  };
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
const redirectToDashboard =()=>{
  navigate('/dashboard');
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const planId = params.get('plan_id');
  
        const token_resp = await verifyToken();
        console.log(token_resp);
  
        if (token_resp.isVerified) {
          setLogedin(true);
          redirectToDashboard()
          setUser(token_resp.user);
        }
  
        if (planId) {
          await fetchPlanDetails(planId);
          await UpdateOrderStatus(planId);
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };
  
    fetchData();
  }, [location.search]);

  if (!plan) return <div>Loading...</div>;

  return (
    <>
    <Header/>
    <div className="single-plan-container">
      
      <div key={plan._id} className="plan-card">
       
  
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
        
        {(isLoggedIn) ? <>
        
          <button onClick={() => subscribeAlert(plan._id)}>
          Subscribe (Pay: ₹{calculateFinalPrice(plan.price, plan.discount).toFixed(2)})
        </button>
        </> : <>
        <br/>
        <div className='log-sin'>
        <h3>Login in to buy</h3>
              <Login/>
              
              OR
              <p style={{'color':'#044243'}}><Link to={'/regform'} ><p style={{'color':'white'}} >join now</p></Link></p>

              </div>  
        </> }
  
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default SinglePlan;
