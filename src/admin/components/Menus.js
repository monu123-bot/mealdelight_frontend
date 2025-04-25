import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/menu.css';
import { host } from '../../script/variables';
import Cookies from 'js-cookie';

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
 const [day, setDay] = useState(new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase());
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monday: { breakfast: [], lunch: [], dinner: [] },
    tuesday: { breakfast: [], lunch: [], dinner: [] },
    wednesday: { breakfast: [], lunch: [], dinner: [] },
    thursday: { breakfast: [], lunch: [], dinner: [] },
    friday: { breakfast: [], lunch: [], dinner: [] },
    saturday: { breakfast: [], lunch: [], dinner: [] },
  });

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  
  // Success/error notification states
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Fetch menus when component mounts or when pagination/search changes
    fetchMenus();
  }, [currentPage, searchTerm, limit]);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('adminToken');
      
      const response = await axios.get(`${host}/admin/getWeeklyMenus`, {
        params: {
          page: currentPage,
          limit: limit,
          search: searchTerm
        },
        headers: {
          'Authorization': `Bearer JWT ${token}`
        }
      });
      
      setMenus(response.data.menus);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch menus. Please try again later.');
      setLoading(false);
      console.error('Error fetching menus:', err);
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

  // Edit menu functions
  const openEditModal = (menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      description: menu.description,
      monday: menu.monday || { breakfast: [], lunch: [], dinner: [] },
      tuesday: menu.tuesday || { breakfast: [], lunch: [], dinner: [] },
      wednesday: menu.wednesday || { breakfast: [], lunch: [], dinner: [] },
      thursday: menu.thursday || { breakfast: [], lunch: [], dinner: [] },
      friday: menu.friday || { breakfast: [], lunch: [], dinner: [] },
      saturday: menu.saturday || { breakfast: [], lunch: [], dinner: [] },
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMealChange = (day, mealType, index, value) => {
    setFormData(prev => {
      const updatedDay = { ...prev[day] };
      updatedDay[mealType][index] = { name: value };
      
      return {
        ...prev,
        [day]: updatedDay
      };
    });
  };

  const addMeal = (day, mealType) => {
    setFormData(prev => {
      const updatedDay = { ...prev[day] };
      updatedDay[mealType] = [...updatedDay[mealType], { name: '' }];
      
      return {
        ...prev,
        [day]: updatedDay
      };
    });
  };

  const removeMeal = (day, mealType, index) => {
    setFormData(prev => {
      const updatedDay = { ...prev[day] };
      updatedDay[mealType] = updatedDay[mealType].filter((_, i) => i !== index);
      
      return {
        ...prev,
        [day]: updatedDay
      };
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      const token = Cookies.get('adminToken');
      
      await axios.put(`${host}/admin/editWeeklyMenu/${editingMenu._id}`, formData, {
        headers: {
          'Authorization': `Bearer JWT ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Close modal and refresh menus
      setShowEditModal(false);
      fetchMenus();
      
      // Show success notification
      showNotification('Menu updated successfully!', 'success');
      
    } catch (err) {
      console.error('Error updating menu:', err);
      showNotification('Failed to update menu. Please try again.', 'error');
    }
  };

  // Delete menu functions
  const openDeleteModal = (menu) => {
    setMenuToDelete(menu);
    setShowDeleteModal(true);
  };

  const handleDeleteMenu = async () => {
    try {
      const token = Cookies.get('adminToken');
      
      await axios.delete(`${host}/admin/deleteWeeklyMenu/${menuToDelete._id}`, {
        headers: {
          'Authorization': `Bearer JWT ${token}`
        }
      });
      
      // Close modal and refresh menus
      setShowDeleteModal(false);
      
      // Update the local state to remove the deleted menu
      setMenus(menus.filter(menu => menu._id !== menuToDelete._id));
      
      // Show success notification
      showNotification('Menu deleted successfully!', 'success');
      
      // If we deleted the last item on this page, go back one page
      if (menus.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Otherwise just refresh the current page
        fetchMenus();
      }
      
    } catch (err) {
      console.error('Error deleting menu:', err);
      showNotification('Failed to delete menu. Please try again.', 'error');
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

  // Helper to get meal count for a day
  const getMealCount = (day) => {
    if (!day) return 0;
    return (day.breakfast?.length || 0) + (day.lunch?.length || 0) + (day.dinner?.length || 0);
  };

  // Helper to get a preview of meals for a specific day
  const getMealPreview = (day, mealType, maxItems = 2) => {
    if (!day || !day[mealType] || day[mealType].length === 0) {
      return "No meals available";
    }
    
    const meals = day[mealType].slice(0, maxItems).map(meal => meal.name).join(", ");
    const remaining = day[mealType].length > maxItems ? `+${day[mealType].length - maxItems} more` : "";
    
    return remaining ? `${meals}, ${remaining}` : meals;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-menus-container">
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
      
      <div className="admin-menus-header">
        <h2>Weekly Menus</h2>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search menus by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading menus...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : menus.length === 0 ? (
        <div className="no-menus">No menus found. Try a different search term.</div>
      ) : (
        <>
          <div className="admin-menus-grid">
            {menus.map((menu) => (
              <div key={menu._id} className="admin-menu-card">
                <div className="admin-menu-header">
                  <h3>{menu.name}</h3>
                  <span className="menu-date">Created: {formatDate(menu.createdAt)}</span>
                </div>
                <div className="admin-menu-details">
                  <p className="menu-description">{menu.description}</p>
                  
                  <div className="menu-days-overview">
                    <div className="menu-day">
                      <h4>Monday</h4>
                      <p>{getMealCount(menu.monday)} meals</p>
                    </div>
                    <div className="menu-day">
                      <h4>Tuesday</h4>
                      <p>{getMealCount(menu.tuesday)} meals</p>
                    </div>
                    <div className="menu-day">
                      <h4>Wednesday</h4>
                      <p>{getMealCount(menu.wednesday)} meals</p>
                    </div>
                    <div className="menu-day">
                      <h4>Thursday</h4>
                      <p>{getMealCount(menu.thursday)} meals</p>
                    </div>
                    <div className="menu-day">
                      <h4>Friday</h4>
                      <p>{getMealCount(menu.friday)} meals</p>
                    </div>
                    <div className="menu-day">
                      <h4>Saturday</h4>
                      <p>{getMealCount(menu.saturday)} meals</p>
                    </div>
                  </div>
                  
                  <div className="menu-preview">
                    <h4>Today's Meals Preview</h4>
                    <div className="meal-types">
                      <div className="meal-type">
                        <span className="meal-label">Breakfast:</span>
                        <span className="meal-items">{getMealPreview(menu[day], 'breakfast')}</span>
                      </div>
                      <div className="meal-type">
                        <span className="meal-label">Lunch:</span>
                        <span className="meal-items">{getMealPreview(menu[day], 'lunch')}</span>
                      </div>
                      <div className="meal-type">
                        <span className="meal-label">Dinner:</span>
                        <span className="meal-items">{getMealPreview(menu[day], 'dinner')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-menu-actions">
                  <button 
                    className="edit-menu"
                    onClick={() => openEditModal(menu)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-menu"
                    onClick={() => openDeleteModal(menu)}
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

      {/* Edit Menu Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal menu-edit-modal">
            <div className="modal-header">
              <h3>Edit Weekly Menu</h3>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitEdit} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Menu Name:</label>
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
                <label htmlFor="description">Description:</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>
              
              <div className="menu-days-edit">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(day => (
                  <div key={day} className="day-edit">
                    <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                    
                    {['breakfast', 'lunch', 'dinner'].map(mealType => (
                      <div key={`${day}-${mealType}`} className="meal-type-edit">
                        <h5>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h5>
                        
                        {formData[day][mealType].map((meal, index) => (
                          <div key={`${day}-${mealType}-${index}`} className="meal-edit">
                            <input 
                              type="text" 
                              value={meal.name} 
                              onChange={(e) => handleMealChange(day, mealType, index, e.target.value)} 
                              placeholder="Meal name" 
                              required 
                            />
                            <button 
                              type="button" 
                              className="remove-meal" 
                              onClick={() => removeMeal(day, mealType, index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        
                        <button 
                          type="button" 
                          className="add-meal"
                          onClick={() => addMeal(day, mealType)}
                        >
                          Add Meal
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
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
              <p>Are you sure you want to delete the menu <strong>{menuToDelete?.name}</strong>?</p>
              <p className="warning">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="delete-button" onClick={handleDeleteMenu}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menus;