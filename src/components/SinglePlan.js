import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { host } from '../script/variables';
import '../style/SinglePlan.css';
import Footer from './Footer';
import Header from './Header';
import {load} from '@cashfreepayments/cashfree-js';
import { verifyToken } from '../script/tokenVerification';
import Login from './Login';
import AddressList from './dashboard/AddressList';
import AddNewAddress from './dashboard/AddNewAddress';
const SinglePlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [step, setStep] = useState("payment"); // Steps: 'payment' or 'address'

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [coupon, setCoupon] = useState('');
  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [couponData, setCouponData] = useState(null);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const openPauseModal = () => setIsPauseModalOpen(true);
  const closePauseModal = () => setIsPauseModalOpen(false);
  const [PausePlanTransactionId,setPausePlanTransactionId]=  useState(null)

  const [selectedDays,setSelectedDays] = useState(null)
  const [expiringDate,setExpiringDate] = useState(null)
    const [activePlanId, setActivePlanId] = useState(null); // Track currently inputting plan ID
  const [sessionId,setSessionId] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState("");
 const [addresses,setAddress] = useState(['hno 645 saraswati bihar ','building 811 '])
 const [selectedAddres,setSelectedAddres] = useState(null)
 const [activePlanName,setActivePlanName] = useState(null)
 const [activePlanPrice,setActivePlanPrice] = useState(null)
 const [activePlanDiscount,setActivePlanDiscount] = useState(null)
 const [subscribeMessage,setSubscribeMessage] = useState(null)
 const [upiAmount,setUpiAmount] = useState(null)
 const [selectedAddress,setSelectedAddress] = useState(null)
   const [activeDropdown, setActiveDropdown] = useState(null);
   const [isPolicyChecked, setIsPolicyChecked] = useState(false);
   const [pausedDates, setPausedDates] = useState([]);
 const [plans, setPlans] = useState([]);

  const [hasMore, setHasMore] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [formData, setFormData] = useState({
   recievers_name: '',
   recievers_phone: '',
   apartment: '',
   street: '',
   city: '',
   state: '',
   country: 'IN',
   postalCode: '',
   address: '',
 });

  const [isPlanActive,setIsActive] = useState(false)
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
  const upiAmount = calculateFinalPrice(plan.price, plan.discount);
   
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
     return_url: `https://themealdelight.in/uos?order_id=${order_id}&plan_id=${activePlanId}&address_id=${selectedAddress._id}`,
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
  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch(`${host}/user/get_address?page=${page}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
  
      const data = await response.json();
  
      // Assuming `data.address` contains the list of addresses
      setAddress((prevAddress) => [...prevAddress, ...data.address]);
      setHasMore(data.hasMore); // Set if more addresses are available
      setPage((prevPage) => prevPage + 1); // Increment the page for pagination
    } catch (error) {
      console.error('Error fetching addresses:', error.message);
    }
  };
  const addNewAddress =()=>{
    setStep('add_address')
  }
  const handleReview = (review)=>{
    setStep("review")
   }
  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    fetchAddress()
    
    setStep("address");
  };





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
        addressId: selectedAddress._id,
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
      setActivePlanId(data._id); // Set the active plan ID
      setPlan(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plan details:', error.message);
      setError(error.message);
      setLoading(false);
    }
  };
  const doPayment = async (sessionid, order_id) => {
    console.log('Initiating payment...');
  
    let checkoutOptions = {
      paymentSessionId: sessionid,
      redirectTarget: "_self",
    };
  
    // Initiate payment
    cashfree.checkout(checkoutOptions);
   
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

<button className="subscribe-btn" onClick={() => {
    
    
    
    
    setStep("payment")
    setPage(1)
    openModal()
     // Track the selected plan for subscribing
  }}>
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
            <p>{(isPlanActive) && 'This Plan Is Already Active, Validity will be increased on the current plan' }</p>
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
                <li 
                      className="address-item"
                      onClick={() => {addNewAddress()}} >
                    Add New Address
                  </li>
                
                <ul className="address-list">
                  <AddressList selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
                 
                </ul>
                
              </div>
            )}
            {step === "add_address" && (
              <>
              <AddNewAddress formData={formData} setFormData={setFormData} step={step} setStep={setStep} />
            </>
            )}
            {
            step === "review" && (
              <div className="subscription-review">
              {subscribeMessage}
              <p>Selected Address: </p>
              {/* Display address fields correctly */}
              <p style={{color:'black'}}>{selectedAddress ? `${selectedAddress.recievers_name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.postalCode}` : "No address selected"}</p>
            
              <p style={{color:'black'}}>Selected Plan: </p>
              <p style={{color:'black'}}>{plan.name}</p>
              <p style={{color:'black'}}>Price: ₹{plan.price}</p>
              <p style={{color:'black'}}>Discount: {plan.discount}%</p>
            
              {/* Conditional rendering for coupon discount */}
              {isCouponVerified && plan.discount > 0 && <p style={{color:'black'}}>Coupon Discount: {couponData.discount}%</p>}
              
              {/* Inform user about payment types */}
              {selectedPayment === 'UPI' && <small style={{color:'black'}}>Coupon discount is applicable only on Wallet payments.</small>}
            
              <p style={{color:'black'}}>Net Payable Amount: ₹{calculateFinalPrice(plan.price, plan.discount)}</p>
            
              {/* Conditional button rendering based on selected payment method */}
              {selectedPayment === 'UPI' ? (
                <button className="btn-secondary" onClick={handleAddToWallet}>
                  Subscribe
                </button>
              ) : (
                <button className="btn-secondary" onClick={() => subscribe(plan._id,selectedAddress._id)}>
                  Subscribe
                </button>
              )}
            </div>
            
            )
            }
            
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
      <Footer />
    </>
  );
};

export default SinglePlan;
