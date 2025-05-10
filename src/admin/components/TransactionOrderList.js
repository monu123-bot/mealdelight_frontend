import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/transactionOrderList.css'; // Import custom CSS
import { host } from '../../script/variables';
import Cookies from 'js-cookie';
const TransactionsList = () => {
  // State variables
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('orderId');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const limit = 10; // Items per page

  // Fetch transactions on component mount and when dependencies change
  useEffect(() => {
    fetchTransactions(page, searchTerm, searchBy);
  }, [page]);

  const getToken = () => {
        const  token = Cookies.get('adminToken');
        console.log(token)
        return token
        // Adjust according to how you store the token
      };
  // Function to fetch transactions from API
  const fetchTransactions = async (page, term, by) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken(); // Get token from userAPI
     
      const response = await axios.post(`${host}/admin/getTransactionOrders`,{
        page,
        limit,
        search: term,
        searchBy: by
      }, {
        headers: {
          Authorization: `Bearer JWT ${token}`,
          'Content-Type': 'application/json'
        },
        
      });
      
      if (response.data.success) {
        setTransactions(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalTransactions(response.data.pagination.total);
      } else {
        setError(response.data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchTransactions(1, searchTerm, searchBy);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Get status badge class based on order status
  const getStatusClass = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'badge success';
      case 'FAILED':
        return 'badge failed';
      default:
        return 'badge';
    }
  };

  // Get claim status badge class
  const getClaimStatusClass = (status) => {
    switch (status) {
      case 'Not claimed':
        return 'badge not-claimed';
      case 'Under review':
        return 'badge under-review';
      case 'Payment completed':
        return 'badge completed';
      case 'Payment rejected':
        return 'badge rejected';
      default:
        return 'badge';
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Show max 5 pagination buttons with current page in the middle when possible
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button 
          key={i} 
          className={`pagination-button ${page === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="transactions-container">
      <h1 className="page-title">Plan Transaction Orders</h1>
      
      {/* Search Form */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs">
            <select 
              value={searchBy} 
              onChange={(e) => setSearchBy(e.target.value)} 
              className="search-select"
            >
              <option value="orderId">Order ID</option>
              <option value="customerId">Customer ID</option>
            </select>
            
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder={searchBy === 'customerId' ? "Enter customer ID..." : "Enter order ID..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i> Search
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {/* Results Summary */}
      <div className="results-summary">
        Showing {transactions.length} of {totalTransactions} transactions
      </div>
      
      {/* Transactions Table */}
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Claim Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="order-id">{transaction.order_id}</td>
                  <td className="customer-info">
                    <div className="customer-name">{transaction.customerName}</div>
                    <div className="customer-email">{transaction.customerEmail}</div>
                    <div className="customer-phone">{transaction.customerPhone}</div>
                  </td>
                  <td className="amount">
                    {transaction.order_currency} {transaction.order_amount.toFixed(2)}
                  </td>
                  <td>
                    <span className={getStatusClass(transaction.order_status)}>
                      {transaction.order_status}
                    </span>
                  </td>
                  <td>
                    <span className={getClaimStatusClass(transaction.claim_status)}>
                      {transaction.claim_status}
                    </span>
                  </td>
                  <td className="date">{transaction.transactionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">
          <p>No transactions found</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button prev"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          
          {renderPaginationButtons()}
          
          <button 
            className="pagination-button next"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;