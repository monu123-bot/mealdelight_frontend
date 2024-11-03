import React, { useEffect, useState } from 'react';
import '../../style/userdashboard/walletHistory.css';
import { host } from '../../script/variables';

const WalletHistory = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };
  const fetchPaymentHistory = async (pageNumber) => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(`${host}/user/payment_history?page=${pageNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const historyData = await response.json();
      if (historyData.length === 0) {
        setHasMore(false);
      } else {
        setHistory((prevHistory) => [...prevHistory, ...historyData]);
      }
    } catch (error) {
      console.log('There is an error from the frontend in fetching payment history:', error);
    }
  };

  useEffect(() => {
    fetchPaymentHistory(page);
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const claimPayment = async (orderId) => {
    try {
      // Optimistically update the claim status on frontend
      setHistory(prevHistory =>
        prevHistory.map(item =>
          item.order_id === orderId
            ? { ...item, isClaimed: true, claim_status: 'Processing' } // Show a 'Processing' status
            : item
        )
      );
  
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch(`${host}/payment/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order_id: orderId })
      });
  
      if (response.ok) {
        const updatedItem = await response.json(); // Get the confirmed updated item from backend
        updateHistoryAfterClaim(updatedItem); // Finalize the UI update
        alert("Your claim has been successfully processed.");
      } else {
        throw new Error("Could not process your claim. Please try again.");
      }
    } catch (error) {
      console.error("Error claiming payment:", error);
      alert("An error occurred while claiming the payment. Please try again later.");
  
      // Revert optimistic update on error
      setHistory(prevHistory =>
        prevHistory.map(item =>
          item.order_id === orderId
            ? { ...item, isClaimed: false, claim_status: '' } // Reset claim status on failure
            : item
        )
      );
    }
  };
  
  const updateHistoryAfterClaim = (updatedItem) => {
    setHistory(prevHistory =>
      prevHistory.map(item =>
        item.order_id === updatedItem.order_id
          ? { ...item, ...updatedItem } // Merge updated fields with existing item
          : item
      )
    );
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <div className="wallet-history-container">
      <h3>Wallet Payment History</h3>
      {history.map((item) => (
        <div key={item.order_id} className="history-item">
          <div className="history-header">
            <p><strong>Order ID:</strong> {item.order_id}</p>
          {  (item.isClaimed==false && item.order_status=='FAILED' ) ? (
  <div className="dots-menu" onClick={() => toggleDropdown(item.order_id)}>
    •••
    {activeDropdown === item.order_id && (
      <div className="dropdown">
        <p onClick={() => claimPayment(item.order_id)}>Claim</p>
        {/* Uncomment and add other options as needed */}
        {/* <p onClick={() => console.log("Another option")}>Another option</p> */}
      </div>
    )}
  </div>
) : (
  <span>{ item.order_status=='FAILED' && item.claim_status}</span>
)}
            
          </div>
          <p><strong>Amount:</strong> {item.order_amount} {item.order_currency}</p>
          <p><strong>Status:</strong> {item.order_status}</p>
          <p><strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
        </div>
      ))}
      {!hasMore && <p className="end-message">No more payment history available</p>}
    </div>
  );
};

export default WalletHistory;
