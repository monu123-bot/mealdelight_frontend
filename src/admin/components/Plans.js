import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/plan.css';
import { host } from '../../script/variables';
import Cookies from 'js-cookie'

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    discount: 0,
    period: 30,
    thumbnail: '',
    isCoupon: false,
    isHome: false
  });

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  
  // Success/error notification states
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Fetch plans when component mounts or when pagination/search changes
    fetchPlans();
  }, [currentPage, searchTerm, limit]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('adminToken');
      
      const response = await axios.get(`${host}/admin/getPlans`, {
        params: {
          page: currentPage,
          limit: limit,
          search: searchTerm
        },
        headers: {
          'Authorization': `Bearer JWT ${token}`
        }
      });
      
      setPlans(response.data.plans);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch plans. Please try again later.');
      setLoading(false);
      console.error('Error fetching plans:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Edit plan functions
  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      discount: plan.discount,
      period: plan.period,
      thumbnail: plan.thumbnail !== '#' ? plan.thumbnail : '',
      isCoupon: plan.isCoupon === 'true', // Convert string to boolean
      isHome: plan.isHome
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      const token = Cookies.get('adminToken');
      
      // Convert values to appropriate types
      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        period: Number(formData.period),
        thumbnail: formData.thumbnail || '#',
        // Ensure boolean values are correctly passed
        isCoupon: formData.isCoupon ? 'true' : 'false', // Keep as string as per original schema
        isHome: Boolean(formData.isHome)
      };
      
      await axios.put(`${host}/admin/editPlan/${editingPlan._id}`, dataToSend, {
        headers: {
          'Authorization': `Bearer JWT ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Close modal and refresh plans
      setShowEditModal(false);
      fetchPlans();
      
      // Show success notification
      showNotification('Plan updated successfully!', 'success');
      
    } catch (err) {
      console.error('Error updating plan:', err);
      showNotification('Failed to update plan. Please try again.', 'error');
    }
  };

  // Delete plan functions
  const openDeleteModal = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteModal(true);
  };

  const handleDeletePlan = async () => {
    try {
      const token = Cookies.get('adminToken');
      
      await axios.delete(`${host}/admin/deletePlan/${planToDelete._id}`, {
        headers: {
          'Authorization': `Bearer JWT ${token}`
        }
      });
      
      // Close modal and refresh plans
      setShowDeleteModal(false);
      
      // Update the local state to remove the deleted plan
      setPlans(plans.filter(plan => plan._id !== planToDelete._id));
      
      // Show success notification
      showNotification('Plan deleted successfully!', 'success');
      
      // If we deleted the last item on this page, go back one page
      if (plans.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Otherwise just refresh the current page
        fetchPlans();
      }
      
    } catch (err) {
      console.error('Error deleting plan:', err);
      showNotification('Failed to delete plan. Please try again.', 'error');
      setShowDeleteModal(false);
    }
  };

  // Notification helper
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="admin-plans-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button 
            className="close-notification" 
            onClick={() => setNotification({ show: false, message: '', type: '' })}
          >
            ×
          </button>
        </div>
      )}
      
      <div className="admin-plans-header">
        <h2>Subscription Plans</h2>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search plans by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading plans...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : plans.length === 0 ? (
        <div className="no-plans">No plans found. Try a different search term.</div>
      ) : (
        <>
          <div className="admin-plans-grid">
            {plans.map((plan) => (
              <div key={plan._id} className="admin-plan-card">
                <div className="admin-plan-thumbnail">
                  <img 
                    src={plan.thumbnail !== '#' ? plan.thumbnail : '/default-plan-image.png'} 
                    alt={plan.name} 
                  />
                  {plan.isHome && <span className="featured-badge">Featured</span>}
                </div>
                <div className="admin-plan-details">
                  <h3>{plan.name}</h3>
                  <div className="admin-plan-price">
                    {plan.discount > 0 ? (
                      <>
                        <span className="original-price">{formatCurrency(plan.price)}</span>
                        <span className="discounted-price">
                          {formatCurrency(plan.price - (plan.price * plan.discount / 100))}
                        </span>
                        <span className="discount-badge">{plan.discount}% OFF</span>
                      </>
                    ) : (
                      <span>{formatCurrency(plan.price)}</span>
                    )}
                  </div>
                  <p className="admin-plan-period">{plan.period} days</p>
                  {plan.isCoupon === 'true' && <p className="coupon-available">Coupon Available</p>}
                </div>
                <div className="admin-plan-actions">
                  <button 
                    className="edit-plan"
                    onClick={() => openEditModal(plan)}
                  >
                    Edit
                  </button>
                  <button 
                    className="view-details"
                    onClick={() => openDeleteModal(plan)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`page-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
            
            <select 
              value={limit} 
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="page-size-select"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
            </select>
          </div>
        </>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Plan</h3>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitEdit} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Plan Name:</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price ($):</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="discount">Discount (%):</label>
                <input 
                  type="number" 
                  id="discount" 
                  name="discount" 
                  min="0" 
                  max="100" 
                  value={formData.discount} 
                  onChange={handleFormChange} 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="period">Period (days):</label>
                <input 
                  type="number" 
                  id="period" 
                  name="period" 
                  min="1" 
                  value={formData.period} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="thumbnail">Thumbnail URL:</label>
                <input 
                  type="text" 
                  id="thumbnail" 
                  name="thumbnail" 
                  value={formData.thumbnail} 
                  onChange={handleFormChange} 
                  placeholder="Leave empty for default image" 
                />
              </div>
              
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="isCoupon" 
                  name="isCoupon" 
                  checked={formData.isCoupon} 
                  onChange={handleFormChange} 
                />
                <label htmlFor="isCoupon">Coupon Available</label>
              </div>
              
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="isHome" 
                  name="isHome" 
                  checked={formData.isHome} 
                  onChange={handleFormChange} 
                />
                <label htmlFor="isHome">Featured Plan (Show on Homepage)</label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="save-button">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-modal" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete the plan <strong>{planToDelete?.name}</strong>?</p>
              <p className="warning">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="delete-button" onClick={handleDeletePlan}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;