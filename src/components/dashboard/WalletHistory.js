import React, { useEffect, useState } from 'react';
import '../../style/userdashboard/walletHistory.css';

const WalletHistory = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPaymentHistory = async (pageNumber) => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(`http://localhost:3002/user/payment_history?page=${pageNumber}`, {
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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <div className="wallet-history-container">
      <h3>Wallet Payment History</h3>
      {history.map((item) => (
        <div key={item.order_id} className="history-item">
          <p><strong>Order ID:</strong> {item.order_id}</p>
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
