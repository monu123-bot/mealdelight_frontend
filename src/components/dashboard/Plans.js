import React, { useEffect, useState } from 'react';
import '../../style/userdashboard/plans.css';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { host } from '../../script/variables';
import { useLocation } from 'react-router-dom';
import {load} from '@cashfreepayments/cashfree-js';
import AddNewAddress from './AddNewAddress';
import AddressList from './AddressList';
import PauseCalander from './PauseCalander';
import DeliveryComp from '../DeliveryComp';

const Plans = ({user,setUser}) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [isPlanActive,setIsActive] = useState(false)
  const [couponData, setCouponData] = useState({
    discount:0

  });
  const [activePlanId, setActivePlanId] = useState(null); // Track currently inputting plan ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const openPauseModal = () => setIsPauseModalOpen(true);
  const closePauseModal = () => setIsPauseModalOpen(false);
  const [PausePlanTransactionId,setPausePlanTransactionId]=  useState(null)

  const [selectedDays,setSelectedDays] = useState(null)
  const [expiringDate,setExpiringDate] = useState(null)
  const [step, setStep] = useState("payment"); // Steps: 'payment' or 'address'
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
   const [pausedDates, setPausedDates] = useState([]); // Array to manage paused dates from backend



   // Function to save the selected paused dates to the backend
  const saveDatesToBackend = async () => {
    const selectedDates = pausedDates;
    console.log(selectedDates)
    const token = localStorage.getItem('mealdelight');
    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${host}/plans/pausePlan`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          PausePlanTransactionId,
          selectedDates,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Dates saved successfully!");
        console.log(result);
      } else {
        alert("Failed to save dates!");
        console.error(result);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while saving the dates.");
    }
  };

  const handleConfirm = () => {
    if (isPolicyChecked) {
      console.log("Paused");
      saveDatesToBackend()
    } else {
      alert("Please agree to the pause policies before confirming.");
    }
  };

 const toggleDropdown = (orderId) => {
  setActiveDropdown(activeDropdown === orderId ? null : orderId);
};
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



 
  const remainingDays = (expiringAt) => {
    const expiryMoment = new Date(expiringAt); // Parse the ISO date string
    const now = new Date();

    const diff = expiryMoment - now; // Calculate the difference in milliseconds

    if (diff > 0) {
        // Convert milliseconds to days, hours, and minutes
        const diffInSeconds = diff / 1000; // Convert to seconds
        const diffInMinutes = Math.floor(diffInSeconds / 60); // Convert to minutes
        const days = Math.floor(diffInMinutes / 1440); // 1440 minutes in a day
        const hours = Math.floor((diffInMinutes % 1440) / 60); // Remaining hours
        const minutes = Math.floor(diffInMinutes % 60); // Remaining minutes

        if (days > 0) {
            return `${days} day(s) remaining`;
        } else if (hours > 0) {
            return `Expiring in ${hours} hour(s) and ${minutes} minute(s)`;
        } else {
            return `Expiring in ${minutes} minute(s)`;
        }
    } else {
        return 'Plan has expired';
    }
};

const checkActive = (planId,addressId)=>{
  console.log('checking for ',planId,addressId)

   myPlans.forEach((plan)=>{
   
    if(plan.plan_id==planId && plan.address_id == addressId){
      setIsActive(true)
      alert('This plan is already active, validity will be added in available plan')
     
    }
    else{
      setIsActive(false)
    }
   })
   
   return
}

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



const openPauseModel =(planId,expiringDate,planPeriod)=>{
  console.log(planPeriod)
  if (planPeriod<30){
    alert('Pause is not allowed on trial plans')
    return
  }
  setExpiringDate(expiringDate)
  setPausePlanTransactionId(planId)
  
  openPauseModal()
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
      <div key={plan._id} className="plan-card-dash">
        <div className='plan-card-dash-header'>
          
          <h3 className='plan-card-dash-heading'>{plan.planDetails.name}</h3>
          
          <DeliveryComp userId={user._id} planId={plan._id}/>

          <span  onClick={() => toggleDropdown(plan._id)} className='plan-card-dash-dash-dashoption dots-menu'>•••

          {  activeDropdown === plan._id && (
      <div className="dropdown-pausePlan">
        
        <p onClick={()=>{
          
          openPauseModel(plan._id,plan.expiringAt,plan.planDetails.period)
        }} >Pause </p>
      
        <p>Pause 1</p>
        {/* Uncomment and add other options as needed */}
        {/* <p onClick={() => console.log("Another option")}>Another option</p> */}
      </div>
    )}
          </span>
          </div>
        
        <p style={{color:'black'}}>{remainingDays(plan.expiringAt)}</p>
        {remainingDays(plan.expiringAt) === 'Plan has expired' && (
          <>
            <p style={{color:'black'}}>Price: ₹{plan.planDetails.price}</p>
            {plan.planDetails.discount > 0 && <p style={{color:'black'}}>Discount: {plan.planDetails.discount}%</p>}
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
                  <p style={{color:'black'}}>Coupon: {couponData.discount}% applied</p>
                )}
              </>
            ) : (
              'No Coupons for trial'
            )}

            <div>
            
            </div>
          </>
        )}
      </div>
    ))}
 
    <h2>Available Plans</h2>
    {(plans.length===0) && "Loading..."}
    {plans.map((plan) => (

      <div key={plan._id} className="plan-card-dash">
        <h3>{plan.name}</h3>
        <p style={{color:'black'}}>Price: ₹{plan.price}</p>
        {plan.discount > 0 && <p style={{color:'black'}}>Discount: {plan.discount}%</p>}
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
              <p style={{color:'black'}}>Coupon: {couponData.discount}% applied</p>
            )}
            {isCouponVerified && couponData && activePlanId === plan._id && (
              <p style={{color:'black'}}>Final Price: ₹{calculateFinalPrice(plan.price, plan.discount)}</p>
            )}
          </>
        ) : (
          'No Coupons for trial'
        )}
       
  
        
  
      
<Link to={`/plandetails?plan_id=${plan._id}`} className="menu-link"> Explore plan</Link>

      </div>
    ))}
    {/* buy now model starting  */}
   

      {/* plan  Pause model starting  */}
      {isPauseModalOpen && (
        <div className="modal-overlay" onClick={closePauseModal}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <div className="modal-header">
            <h5 className="modal-title">
              Select period 
              
            </h5>
            

            <button className="close-btn" onClick={closePauseModal}>
              &times;
            </button>
          </div>
          <small>It should be continious and less than 11 days</small>

          <div className="modal-body">
           

           <PauseCalander endDate={expiringDate}  planTransactionId={PausePlanTransactionId} pausedDates={pausedDates} setPausedDates={setPausedDates} saveDatesToBackend={saveDatesToBackend} />
            
          </div>
  
          <div className="modal-footer enhanced-modal-footer">
      <div className="pause-options">
        <input
          id="pause-radio"
          type="radio"
          checked={isPolicyChecked}
          onChange={() => setIsPolicyChecked(!isPolicyChecked)}
        />
        <label htmlFor="pause-radio" className="pause-label">
          Pause Plan
        </label>
        <a href="#" className="pause-policies-link">
          View Pause Policies
        </a>
      </div>
      <div className="action-buttons">
        <button
          className={`btn btn-secondary confirm-button ${
            isPolicyChecked ? "" : "disabled"
          }`}
          onClick={handleConfirm}
          disabled={!isPolicyChecked}
        >
          Confirm
        </button>
      </div>
    </div>

        </div>
      </div>
      )}
  </div>
  
  );
};

export default Plans;
