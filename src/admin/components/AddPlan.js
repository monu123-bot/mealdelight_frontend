import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import axios from 'axios';
import './style/addPlan.css';
import { host } from '../../script/variables';

const AddPlan = () => {
  const [plan, setPlan] = useState({
    name: '',
    price: '',
    thumbnail: '',
    discount: 0,
    period: 30,
    isCoupon: 'false',
    menu: '',
    isHome: false
  });

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get token from localStorage or wherever you're storing it
  const getToken = () => {
    const  token = Cookies.get('adminToken');
    console.log(token)
    return token
    // Adjust according to how you store the token
  };

  // Fetch menus when component mounts
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const token = getToken();
      
      
      const response = await axios.get(`${host}/admin/getMenu`, {
        headers: {
          Authorization: `Bearer JWT ${token}`,
        },
      });
      
      if (response.status === 200) {
        console.log(response.data)
        setMenus(response.data);
      } else {
        setError('Failed to fetch menus');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error fetching menus');
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : value;
    
    setPlan({
      ...plan,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Form validation
    if (!plan.name || !plan.price || !plan.menu) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
    
      
      const response = await axios.post(`${host}/admin/addPlan`, plan, {
        headers: {
          Authorization: `Bearer JWT ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.status == 200) {
        setSuccess('Plan added successfully!');
        // Reset form
        setPlan({
          name: '',
          price: '',
          thumbnail: '',
          discount: 0,
          period: 30,
          isCoupon: 'false',
          menu: '',
          isHome: false
        });
      } else {
        setError(response.data.msg || 'Failed to add plan');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding plan');
      console.error('Error adding plan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-plan-container">
      <h2>Add New Plan</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="plan-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Plan Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={plan.name}
              onChange={handleChange}
              placeholder="Enter plan name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={plan.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="thumbnail">Thumbnail URL</label>
            <input
              type="text"
              id="thumbnail"
              name="thumbnail"
              value={plan.thumbnail}
              onChange={handleChange}
              placeholder="Image URL"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={plan.discount}
              onChange={handleChange}
              placeholder="Discount percentage"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="period">Period (days)</label>
            <input
              type="number"
              id="period"
              name="period"
              value={plan.period}
              onChange={handleChange}
              placeholder="Plan duration in days"
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="isCoupon">Coupon Code</label>
            <select
              id="isCoupon"
              name="isCoupon"
              value={plan.isCoupon}
              onChange={handleChange}
            >
              <option value="false">No Coupon</option>
              <option value="true">Has Coupon</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group menu-selection">
            <label htmlFor="menu">Select Menu *</label>
            {loading ? (
              <p>Loading menus...</p>
            ) : (
              <select
                id="menu"
                name="menu"
                value={plan.menu}
                onChange={handleChange}
                required
              >
                <option value="">Select a menu</option>
                {menus.length > 0 ? (
                  menus.map((menu) => (
                    <option key={menu._id} value={menu._id}>
                      {menu._id}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No menus available
                  </option>
                )}
              </select>
            )}
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isHome"
              name="isHome"
              checked={plan.isHome}
              onChange={handleChange}
            />
            <label htmlFor="isHome">Display on Home Page</label>
          </div>
        </div>
        
        {plan.menu && (
          <div className="selected-menu-preview">
            <h3>Selected Menu Details</h3>
            {menus.filter(menu => menu._id === plan.menu).map(selectedMenu => (
              <div key={selectedMenu._id} className="menu-details">
                <p><strong>Menu Name:</strong> {selectedMenu.name}</p>
                {selectedMenu.description && (
                  <p><strong>Description:</strong> {selectedMenu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Adding Plan...' : 'Add Plan'}
          </button>
          <button 
            type="button" 
            className="reset-btn"
            onClick={() => {
              setPlan({
                name: '',
                price: '',
                thumbnail: '',
                discount: 0,
                period: 30,
                isCoupon: 'false',
                menu: '',
                isHome: false
              });
              setError('');
              setSuccess('');
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlan;