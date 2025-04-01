import React, { useEffect, useState, useCallback } from 'react';
import '../../style/userdashboard/history.css';
import { host } from '../../script/variables';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);  // Track current page
  const [hasMore, setHasMore] = useState(false);  // Track if there are more items to load
  const [initialLoad, setInitialLoad] = useState(false); // Avoid duplicate initial fetch

  // Fetch subscription history with pagination
  const fetchHistory = useCallback(async (pageNumber) => {
    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${host}/user/history?page=${pageNumber}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription history');
      }

      const data = await response.json();
      setHistory(prevHistory => [...prevHistory, ...data.result]);  // Append new data
      setHasMore(data.hasMore);  // Update hasMore status
      setLoading(false);
      setInitialLoad(true); // Set the initial load flag to true
    } catch (error) {
      console.error('Error fetching subscription history:', error.message);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    if (hasMore) {
      setPage(prevPage => prevPage + 1);  // Increment page number when user reaches the bottom
    }
  }, [loading, hasMore]);

  // Fetch data when page changes, but ensure no double fetch on first mount
  useEffect(() => {
    if (!initialLoad) {
      fetchHistory(page);
    }
  }, [page, initialLoad]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);  // Clean up event listener
  }, [handleScroll]);

  if (loading && page === 1) {
    return <p>Loading history...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      {history.length === 0 ? (
        <p>No subscription history found.</p>
      ) : (
        <ul className="history-list">
          {history.map((transaction) => (
            <li key={transaction._id} className="history-item">
              <h3>{transaction.planName}</h3>
              <p>Purchased Date: {new Date(transaction.purchaseDate).toLocaleDateString()}</p>
              <p>Expiry Date: {new Date(transaction.expiryDate).toLocaleDateString()}</p>
              <p>Delivery address : {transaction.address.city}</p>
            </li>
          ))}
        </ul>
      )}
      {loading && page > 1 && <p>Loading more history...</p>}
    </div>
  );
};

export default History;
