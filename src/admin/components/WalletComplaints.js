import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/WalletComplaints.css';
import Cookies from 'js-cookie';
import { host } from '../../script/variables';

const WalletComplaints = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [claimStatus, setClaimStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionType, setActionType] = useState('');
  const [comment, setComment] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, limit, claimStatus, startDate, endDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
        claimStatus: claimStatus || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      const token = Cookies.get('adminToken');
      const response = await axios.get(`${host}/admin/wallettransactions`, {
        params,
        headers: {
          Authorization: `Bearer JWT ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClaimStatusChange = (e) => {
    setClaimStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setClaimStatus('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
    setActionType('');
    setComment('');
    setAdminPassword('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const handleSubmitAction = async () => {
    if (!actionType || !comment || !adminPassword) {
      alert('Please fill all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const token = Cookies.get('adminToken');
      const response = await axios.post(`${host}/admin/updateClaimStatus`, {
        transactionId: selectedTransaction._id,
        action: actionType,
        comment,
        adminPassword,
      }, {
        headers: {
          Authorization: `Bearer JWT ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Transaction updated successfully');
        closeModal();
        fetchTransactions();
      } else {
        alert('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error submitting action:', error);
      alert('Error submitting action');
    }
    setSubmitting(false);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        &laquo; Prev
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? 'pagination-button active' : 'pagination-button'}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next &raquo;
      </button>
    );

    return <div className="pagination">{pages}</div>;
  };

  return (
    <div className="wallet-complaints-container">
      <h1>Wallet Complaints</h1>

      {/* Filter UI */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Claim Status:</label>
          <select value={claimStatus} onChange={handleClaimStatusChange}>
            <option value="">All</option>
            <option value="Not claimed">Not claimed</option>
            <option value="Under review">Under review</option>
            <option value="Payment completed">Payment completed</option>
            <option value="Payment rejected">Payment rejected</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Start Date:</label>
          <input 
            type="date" 
            name="startDate"
            value={startDate} 
            onChange={handleDateChange}
          />
        </div>
        
        <div className="filter-group">
          <label>End Date:</label>
          <input 
            type="date" 
            name="endDate"
            value={endDate} 
            onChange={handleDateChange}
          />
        </div>
        
        <button className="clear-filters" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
      
      <div className="limit-selector">
        <label>Show:</label>
        <select 
          value={limit} 
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>entries</span>
      </div>
      {/* Same as before */}

      {/* Table */}
      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Order Amount</th>
                  <th>Order Status</th>
                  <th>Claim Status</th>
                  <th>Expiry Time</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">No transactions found</td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.order_id}>
                      <td>{transaction.order_id}</td>
                      <td>{transaction.customer_id?.firstName || transaction.customer_id?._id}</td>
                      <td>{transaction.order_amount} {transaction.order_currency}</td>
                      <td className={`status ${transaction.order_status.toLowerCase()}`}>{transaction.order_status}</td>
                      <td className={`claim-status ${transaction.claim_status.replace(/\s+/g, '-').toLowerCase()}`}>{transaction.claim_status}</td>
                      <td>{formatDate(transaction.order_expiry_time)}</td>
                      <td>{formatDate(transaction.createdAt)}</td>
                      <td>
                        <button
                          className="view-button"
                          onClick={() => openModal(transaction)}
                        >
                          Take Action
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {renderPagination()}
        </>
      )}

      {/* Custom Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Take Action</h2>

            <div className="modal-group">
              <label>Action:</label>
              <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
                <option value="">Select</option>
                <option value="Approve">Approve</option>
                <option value="Reject">Reject</option>
              </select>
            </div>

            <div className="modal-group">
              <label>Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
            </div>

            <div className="modal-group">
              <label>Admin Password:</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="submit-button" onClick={handleSubmitAction} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button className="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletComplaints;
