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
import ShowMenu from './ShowMenu';

const SinglePlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [step, setStep] = useState("payment"); // Steps: 'payment', 'packaging', 'address', 'review'

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [coupon, setCoupon] = useState('');
  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [couponData, setCouponData] = useState(null);

  // Packaging related states
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [selectedPackaging, setSelectedPackaging] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const openPauseModal = () => setIsPauseModalOpen(true);
  const closePauseModal = () => setIsPauseModalOpen(false);
  const [PausePlanTransactionId,setPausePlanTransactionId] = useState(null)

  const [selectedDays,setSelectedDays] = useState(null)
  const [expiringDate,setExpiringDate] = useState(null)
  const [activePlanId, setActivePlanId] = useState(null);
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

  const [amount, setAmount] = useState('');
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + 25 * 60000); 

  const handleAmountChange = (e) => {
      setAmount(e.target.value);
  };

  // Calculate number of meals included in the plan
  const getMealCount = (includes) => {
    if (!includes || !Array.isArray(includes)) return 0;
    return includes.filter(meal => meal === true).length;
  };

  // Calculate total packaging cost
  const calculatePackagingCost = () => {
    if (!selectedPackaging || !plan) return 0;
    
    const mealCount = getMealCount(plan.includes);
    const packagingPrice = selectedPackaging.price;
    const packagingDiscount = selectedPackaging.discount || 0;
    const discountedPackagingPrice = packagingPrice - (packagingPrice * packagingDiscount / 100);
    
    // Multiply by number of meals per day and plan duration
    return Math.round(discountedPackagingPrice * mealCount * plan.period);
  };

  // Updated calculateFinalPrice function to include packaging
  const calculateFinalPrice = (price, discount) => {
    let discountedPrice = price - (price * discount / 100);
    if (isCouponVerified && couponData) {
      discountedPrice -= (discountedPrice * couponData.discount / 100);
    }
    
    // Add packaging cost
    const packagingCost = calculatePackagingCost();
    
    return Math.round(discountedPrice + packagingCost);
  };

  const handleAddToWallet = async () => {
    const upiAmount = calculateFinalPrice(plan.price, plan.discount);
     
    console.log(upiAmount)
    console.log('this is 1')
    let curTimeStamp = Date.now()
    let order_id = `${user._id}-${curTimeStamp}`
    if (!upiAmount) {
        alert("Please enter a valid amount");
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
            return_url: `https://themealdelight.in/uos?order_id=${order_id}&plan_id=${activePlanId}&address_id=${selectedAddress._id}&packaging_id=${selectedPackaging._id}`,
            notify_url: "https://www.cashfree.com/devstudio/preview/pg/webhooks/75802411",
            payment_methods: "cc,dc,upi"
        },
        order_expiry_time: `${expiryTime.toISOString()}`
    }
     
    try {
        const token = localStorage.getItem('mealdelight');
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${host}/payment/create_order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }

        const paymentOrderDetails = await response.json();
        console.log('User Details:', paymentOrderDetails);
        setSessionId(paymentOrderDetails.payment_session_id)
        await doPayment(paymentOrderDetails.payment_session_id)

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
      setAddress((prevAddress) => [...prevAddress, ...data.address]);
      setHasMore(data.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching addresses:', error.message);
    }
  };

  const addNewAddress = () => {
    setStep('add_address')
  }

  const handleReview = (review) => {
    setStep("review")
  }

  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    fetchAddress();
    setStep("address");
  };

  const subscribe = async (planId) => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) throw new Error("No authentication token found");

      const payload = {
        planId: planId,
        couponName: isCouponVerified ? coupon : null,
        addressId: selectedAddress._id,
        packagingId: selectedPackaging._id,
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
      const planDetail = data.plan;
      const packingOption = data.packagingOptions;
      
      setActivePlanId(planDetail._id);
      setPlan(planDetail);
      setPackagingOptions(packingOption || []);
      setLoading(false);
      setSelectedPackaging(packingOption && packingOption.length > 0 ? packingOption[0] : null);
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
            <ShowMenu MenuId={plan.menu} />
            
            {/* Packaging Options Display */}
            {packagingOptions && packagingOptions.length > 0 && (
              <div className="packaging-display">
                <h3>Packaging Options:</h3>
                <div className="packaging-options-grid">
                  {packagingOptions.map((packaging) => (
                    <div
                      key={packaging._id}
                      className={`packaging-option-card ${selectedPackaging?._id === packaging._id ? 'selected' : ''}`}
                      onClick={() => setSelectedPackaging(packaging)}
                    >
                      <img src={packaging.image} alt={packaging.name} className="packaging-card-image" />
                      <div className="packaging-card-content">
                        <h4>{packaging.name}</h4>
                        <p className="packaging-description">{packaging.description}</p>
                        <div className="packaging-pricing">
                          <span className="packaging-price">₹{packaging.price}/meal</span>
                          {packaging.discount > 0 && (
                            <span className="packaging-discount">{packaging.discount}% OFF</span>
                          )}
                        </div>
                        <p className="packaging-total">
                          Total: ₹{
                            (() => {
                              const mealCount = getMealCount(plan.includes);
                              const packagingPrice = packaging.price;
                              const packagingDiscount = packaging.discount || 0;
                              const discountedPackagingPrice = packagingPrice - (packagingPrice * packagingDiscount / 100);
                              return Math.round(discountedPackagingPrice * mealCount * plan.period);
                            })()
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="plan-description">{plan.description}</p>
            <p style={{color:'black'}}><strong>Duration:</strong> {plan.period} days</p>
            <p style={{color:'black'}}><strong>Original Price:</strong> ₹{plan.price}</p>
            <p style={{color:'black'}}><strong>Plan Discount:</strong> {plan.discount}%</p>
            
            {/* Show included meals */}
            {plan.includes && (
              <p style={{color:'black'}}>
                <strong>Includes:</strong> {
                  plan.includes.map((meal, index) => {
                    const mealNames = ['Breakfast', 'Lunch', 'Dinner'];
                    return meal ? mealNames[index] : null;
                  }).filter(Boolean).join(', ')
                }
              </p>
            )}
            
            <p style={{color:'black'}} className="final-price">
              Plan Price: ₹{Math.round(plan.price - (plan.price * plan.discount / 100))}
              {selectedPackaging && (
                <>
                  <br />
                  Packaging Cost: ₹{calculatePackagingCost()}
                  <br />
                  <strong>Total: ₹{calculateFinalPrice(plan.price, plan.discount)}</strong>
                </>
              )}
            </p>

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

            {isLoggedIn && (
              <button className="subscribe-btn" onClick={() => {
                setStep("payment")
                setPage(1)
                openModal()
              }}>
                Subscribe
              </button>
            )}

            {!isLoggedIn && (
              <button className="subscribe-btn">
                Login to Subscribe
              </button>
            )}
          </div>
        </div>
      </div>
      {!isLoggedIn && <Login />}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h5 className="modal-title">
              {step === "payment" && "Choose Payment Option"}
              {step === "address" && "Select Delivery Address"}
              {step === "review" && "Order Preview"}
            </h5>
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>
          </div>
  
          <div className="modal-body">
            <p>{(isPlanActive) && 'This Plan Is Already Active, Validity will be increased on the current plan'}</p>
            
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
                {selectedPackaging && <p>Selected Packaging: {selectedPackaging.name}</p>}
                <br/>
                <li 
                  className="address-item"
                  onClick={() => {addNewAddress()}}
                >
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

            {step === "review" && (
              <div className="subscription-review">
                {subscribeMessage}
                <p>Selected Address: </p>
                <p style={{color:'black'}}>
                  {selectedAddress ? 
                    `${selectedAddress.recievers_name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.postalCode}` : 
                    "No address selected"
                  }
                </p>
              
                <p style={{color:'black'}}>Selected Plan: {plan.name}</p>
                <p style={{color:'black'}}>Plan Price: ₹{plan.price}</p>
                <p style={{color:'black'}}>Plan Discount: {plan.discount}%</p>
                
                {/* Packaging details */}
                {selectedPackaging && (
                  <>
                    <p style={{color:'black'}}>Selected Packaging: {selectedPackaging.name}</p>
                    <p style={{color:'black'}}>Packaging Cost: ₹{calculatePackagingCost()}</p>
                    <p style={{color:'black'}}>
                      (₹{selectedPackaging.price} per meal × {getMealCount(plan.includes)} meals × {plan.period} days
                      {selectedPackaging.discount > 0 && ` - ${selectedPackaging.discount}% discount`})
                    </p>
                  </>
                )}
              
                {isCouponVerified && plan.discount > 0 && (
                  <p style={{color:'black'}}>Coupon Discount: {couponData.discount}%</p>
                )}
                
                {selectedPayment === 'UPI' && (
                  <small style={{color:'black'}}>Coupon discount is applicable only on Wallet payments.</small>
                )}
              
                <p style={{color:'black', fontWeight: 'bold', fontSize: '18px'}}>
                  Total Amount: ₹{calculateFinalPrice(plan.price, plan.discount)}
                </p>
              
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
            )}
          </div>
  
          <div className="modal-footer">
            {step === "address" && (
              <>
                <button className="btn-secondary" onClick={() => setStep("payment")}>
                  Back to Payment Options
                </button>
                <button className="btn-secondary" onClick={() => handleReview("review")}>
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