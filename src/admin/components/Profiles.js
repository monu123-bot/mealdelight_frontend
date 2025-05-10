import React, { useState, useEffect } from 'react';

import "./style/profiles.css";
import { host } from '../../script/variables';
import axios from 'axios';
import Cookies from 'js-cookie';
const Profiles = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // Default search by name
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const limit = 10; // items per page
  const [debounceTimeout, setDebounceTimeout] = useState(null);


  const getToken = () => {
      const  token = Cookies.get('adminToken');
      console.log(token)
      return token
      // Adjust according to how you store the token
    };
  // Fetch customers from API
  const fetchCustomers = async (page, term, by) => {
    setLoading(true);
    setError(null);
    
    try {
        const token = getToken(); // Get token from userAPI
      // Using axios to make the API call to the specified endpoint
      const response = await axios.post(`${host}/admin/getUsers`, 
        {
          page,
          limit,
          term,
          by 
        },
        {
          headers: {
            Authorization: `Bearer JWT ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Process the response data
      if (response.data.success) {
        setCustomers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCustomers(response.data.pagination.total);
      } else {
        setError(response.data.message || 'Failed to fetch customers');
      }
    } catch (err) {
      setError(err.response?.data?.userMessage || err.message || 'An error occurred while fetching customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCustomers(currentPage, searchTerm, searchBy);
  }, [currentPage]); // Only change page triggers this effect

  // Handle search with debounce
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Set new timeout to debounce API calls
    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      fetchCustomers(1, searchTerm, searchBy);
    }, 500); // 500ms debounce
    
    setDebounceTimeout(timeout);
    
    // Cleanup
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchTerm, searchBy]);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search filter change
  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  return (
    <div className="profiles-container">
      <h2>Customer Profiles</h2>
      
      <div className="search-container">
        <select 
          className="search-select" 
          value={searchBy} 
          onChange={handleSearchByChange}
        >
          <option value="name">Name</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBy}...`}
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading && <div className="loading-indicator">Loading customers...</div>}
      
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && customers.length === 0 && (
        <div className="no-results">No customers found matching your search criteria</div>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Join Date</th>
                {/* <th>Status</th>
                <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.fullName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>{customer.joinDate}</td>
                  {/* <td>
                    <span className={`status-badge ${customer.status}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-button view">View</button>
                    <button className="action-button edit">Edit</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-button nav-button" 
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            &laquo; Prev
          </button>
          
          {/* Show pagination numbers with ellipsis for large number of pages */}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              // Show all pages if 5 or fewer
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              // Near the start
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // Near the end
              pageNum = totalPages - 4 + i;
            } else {
              // In the middle
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                className={`page-button ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => paginate(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            className="page-button nav-button" 
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next &raquo;
          </button>
        </div>
      )}
      
      <div className="customers-count">
        Showing {customers.length} of {totalCustomers} customers
      </div>
    </div>
  );
};

export default Profiles;