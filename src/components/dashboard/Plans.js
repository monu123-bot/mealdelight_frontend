import React, { useEffect, useState } from 'react';
import '../../style/userdashboard/plans.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { host } from '../../script/variables';
import { useLocation } from 'react-router-dom';
import {load} from '@cashfreepayments/cashfree-js';

const Plans = ({user,setUser}) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [couponData, setCouponData] = useState({
    discount:0

  });
  const [activePlanId, setActivePlanId] = useState(null); // Track currently inputting plan ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [step, setStep] = useState("payment"); // Steps: 'payment' or 'address'
  const [selectedPayment, setSelectedPayment] = useState("");
 const [addresses,setAddress] = useState(['hno 645 saraswati bihar ','building 811 '])
 const [selectedAddres,setSelectedAddres] = useState(null)
 const [activePlanName,setActivePlanName] = useState(null)
 const [activePlanPrice,setActivePlanPrice] = useState(null)
 const [activePlanDiscount,setActivePlanDiscount] = useState(null)
 const [subscribeMessage,setSubscribeMessage] = useState(null)
 const [upiAmount,setUpiAmount] = useState(null)
  // upi payment start
 const location = useLocation();
 const [sessionId,setSessionId] = useState(null)
let cashfree;
var initializeSDK = async function () {                      
 cashfree = await load({
     mode: "production"
 });
};
initializeSDK();
 const [amount, setAmount] = useState(''); // State to hold the amount input
 const currentTime = new Date();
 const expiryTime = new Date(currentTime.getTime() + 25 * 60000); 
 const handleAmountChange = (e) => {
     setAmount(e.target.value); // Update the amount state on input change
 };

 const handleAddToWallet =async () => {
  const upiAmount = calculateFinalPrice(activePlanPrice, activePlanDiscount);
  

  console.log(upiAmount)
     console.log('this is 1')
     let curTimeStamp =Date.now()
     let order_id = `${user._id}-${curTimeStamp}`
     if (!upiAmount) {
         alert("Please enter a valid amount"); // Simple validation
         return;
     }
     let data = {
         order_amount: upiAmount,
 order_currency: "INR",
 order_id: `${order_id}`,
 customer_details: {
     customer_id: `${user._id}`,
     customer_phone: `${user.phone}`,
     customer_name: `${user.firstName} ${user.lastName}`,
     customer_email: `${user.email}`
 },
 order_meta: {
     return_url: `https://themealdelight.in/uos?order_id=${order_id}`,
     notify_url: "https://www.cashfree.com/devstudio/preview/pg/webhooks/75802411",
     payment_methods: "cc,dc,upi"
 },
 order_expiry_time: `${expiryTime.toISOString()}`
     }
     
     try {
         // Retrieve the token from localStorage
         const token = localStorage.getItem('mealdelight');
         if (!token) {
             throw new Error("No authentication token found");
         }
 
         // Set up the request headers with the token
         const response = await fetch(`${host}/payment/create_order`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
             },
             body:JSON.stringify(data)
         });
 
         // Handle response
         if (!response.ok) {
             throw new Error("Failed to fetch user details");
         }
 
         // Parse the JSON response
         const paymentOrderDetails = await response.json();
         console.log('User Details:', paymentOrderDetails);
         setSessionId(paymentOrderDetails.payment_session_id)
         await doPayment(paymentOrderDetails.payment_session_id)
         // await UpdateOrderStatus(order_id)
         // You could return or use the user data here
         // setUser(userData)
 
     } catch (error) {
         console.error('Error fetching user details:', error.message);
     }


     setUpiAmount(null);
 };
 const doPayment = async (sessionid, order_id) => {
     console.log('Initiating payment...');
     
     let checkoutOptions = {
         paymentSessionId: sessionid,
         redirectTarget: "_self"
         
     };

    cashfree.checkout(checkoutOptions);
    subscribe(activePlanId)
     
     
     
 };





 /// payment add end

 const handleReview = (review)=>{
  setStep("review")
 }
  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    setStep("address");
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
      const payload = {
        planId: planId,
        couponName: isCouponVerified ? coupon : null,
      };
  
      if (selectedPayment === 'UPI') {
        payload.couponName = null; // Reset couponName after adding to wallet
       
      }
  
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
        setSubscribeMessage(message);
        throw new Error(message);
      }
  
      // If subscription succeeds
      closeModal();
      const data = await response.json();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error subscribing to plan:', error.message);
      setSubscribeMessage(error.message || 'An unexpected error occurred.');
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
    if(selectedPayment==='UPI'){
      couponData.discount = 0
    }
    let discountedPrice = price - (price * discount / 100);
    if (isCouponVerified && couponData) {
      discountedPrice -= (discountedPrice * couponData.discount / 100);
    }
    // setUpiAmount(discountedPrice)
    return discountedPrice;
  };

  const subscribeAlert = async (planId) => {

    const userConfirmed = window.confirm("Are you sure you want to subscribe to this plan?");
    if (userConfirmed) {
      await subscribe(planId);
    }
  };
const ChoosePaymentOption = async (planId)=>{

     


}
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

            <div>
            <button onClick={() => subscribeAlert(plan.plan_id)}>
              Renew 
            </button>
            </div>
            
           
            
           
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
  
        <button
  onClick={() => {
    openModal();
    setActivePlanId(plan._id); // Track the active plan for coupons
    setActivePlanName(plan.name)
    setActivePlanDiscount(plan.discount)
    setActivePlanPrice(plan.price)
     // Track the selected plan for subscribing
  }}
>
  Buy Now
</button>
      </div>
    ))}
    {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <div className="modal-header">
            <h5 className="modal-title">
              {step === "payment" && "Choose Payment Option" }
              {step === "address" && "Select Delivery Address"}
              {step === "review" && "Order Preview"}
            </h5>
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>
          </div>
  
          <div className="modal-body">
            {step === "payment" && (
              <div className="payment-options">
                <div
                  className="option"
                  onClick={() => handlePaymentSelection("MealDelight Wallet")}
                >
                  <img src="wallet.png" alt="Wallet" className="option-icon" />
                  <br />
                  <span className="option-text">MealDelight Wallet</span>
                </div>
                <div
                  className="option"
                  onClick={() => handlePaymentSelection("UPI")}
                >
                  <img src="mobile-banking.png" alt="Cashfree" className="option-icon" />
                  <br />
                  <span className="option-text">UPI</span>
                </div>
              </div>
            )}
  
            {step === "address" && (
              <div className="address-selection">
                <p>Selected Payment Method: {selectedPayment}</p>
                <br/>
                
                
                <ul className="address-list">
                  {addresses.map((address, index) => (
                    <li
                      key={index}
                      className="address-item"
                      onClick={() => {setSelectedAddres(address)


                      }}
                    >
                      {address}
                    </li>
                  ))}
                </ul>
                
              </div>
            )}
            {step === "review" && (
              <div className="subscription-review">
                {subscribeMessage}
                <p>Selected Address : </p>
                <p>{selectedAddres}</p>
                <p>Selected Plan : </p>
                <p>{activePlanName}</p>
                <p>Price: ₹{activePlanPrice}</p>
                <p>Discount : {activePlanDiscount}%</p>
        { isCouponVerified &&  activePlanDiscount > 0 && <p>Coupon Discount: {couponData.discount}%</p>}
        {(selectedPayment==='UPI') && <small>Coupon discount is applicable only on Wallet payments </small>}

        <p>Net Payable Amount : ₹{calculateFinalPrice(activePlanPrice,activePlanDiscount)}</p>

        {(selectedPayment==='UPI') ? 
      <>
      <button className="btn-secondary" onClick={() =>{handleAddToWallet()} }>
              Subscribe
            </button>
      </>   : <button className="btn-secondary" onClick={() =>subscribe(activePlanId) }>
              Subscribe
            </button>
      }
       
              </div>
            )}
          </div>
  
          <div className="modal-footer">
            {step === "address" && (
              <>
              <button className="btn-secondary" onClick={() => setStep("payment")}>
                Back to Payment Options
              </button>
              <button className="btn-secondary" onClick={() =>handleReview("review") }>
              Review
            </button>
            </>
            )}
           
          </div>
        </div>
      </div>
      )}
  </div>
  
  );
};

export default Plans;
