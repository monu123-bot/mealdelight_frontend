import React, { useState } from 'react';
import '../style/AddMenu.css';
import axios from 'axios';
import { host } from '../../script/variables';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const meals = ['breakfast', 'lunch', 'dinner'];

export default function AddMenu() {
  const [loading, setLoading] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  
  const [menu, setMenu] = useState(
    days.reduce((acc, day) => {
      acc[day] = { breakfast: [''], lunch: [''], dinner: [''] };
      return acc;
    }, {})
  );

  const handleChange = (day, meal, index, value) => {
    const updatedMenu = { ...menu };
    updatedMenu[day][meal][index] = value;
    setMenu(updatedMenu);
  };

  const addDishField = (day, meal) => {
    setMenu(prev => {
      const updated = { ...prev };
      updated[day][meal].push('');
      return updated;
    });
  };

  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!menuName.trim()) {
      setNameError('Menu name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate description
    if (!menuDescription.trim()) {
      setDescriptionError('Menu description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Create the request data with name and description
      const requestData = {
        ...menu,
        name: menuName,
        description: menuDescription
      };
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${host}/admin/addmenu`, 
        requestData,
        {
          headers: {
            Authorization: `Bearer JWT ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        alert('Menu added successfully!');
        // Reset form
        setMenuName('');
        setMenuDescription('');
        setMenu(days.reduce((acc, day) => {
          acc[day] = { breakfast: [''], lunch: [''], dinner: [''] };
          return acc;
        }, {}));
      } else {
        alert(response.data.error || 'Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error while adding menu:', error);
      alert(error.response?.data?.error || 'Failed to add menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeDishField = (day, meal, index) => {
    if (menu[day][meal].length > 1) {
      setMenu(prev => {
        const updated = { ...prev };
        updated[day][meal] = updated[day][meal].filter((_, i) => i !== index);
        return updated;
      });
    }
  };

  return (
    <div className="add-menu">
      <h2>Add Weekly Menu</h2>
      
      <div className="menu-metadata">
        <div className="form-group">
          <label htmlFor="menuName">Menu Name *</label>
          <input
            id="menuName"
            className="addmenu-input menu-name-input"
            type="text"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            placeholder="Enter menu name (e.g. Vegetarian Classic)"
          />
          {nameError && <div className="error-message">{nameError}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="menuDescription">Menu Description *</label>
          <textarea
            id="menuDescription"
            className="menu-description-input"
            value={menuDescription}
            onChange={(e) => setMenuDescription(e.target.value)}
            placeholder="Describe the menu (e.g. A balanced vegetarian menu with variety of dishes)"
            rows={3}
          />
          {descriptionError && <div className="error-message">{descriptionError}</div>}
        </div>
      </div>
      
      <div className="days-container">
        {days.map(day => (
          <div key={day} className="day-section">
            <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            {meals.map(meal => (
              <div key={meal} className="meal-section">
                <strong className="meal-title">{meal.charAt(0).toUpperCase() + meal.slice(1)}</strong>
                <div className="dishes-container">
                  {menu[day][meal].map((dish, index) => (
                    <div key={index} className="dish-input-container">
                      <input
                        className="addmenu-input"
                        value={dish}
                        onChange={e => handleChange(day, meal, index, e.target.value)}
                        placeholder={`Enter ${meal} dish`}
                      />
                      <button 
                        type="button"
                        className="remove-dish-btn"
                        onClick={() => removeDishField(day, meal, index)}
                        disabled={menu[day][meal].length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="add-dish-btn"
                  onClick={() => addDishField(day, meal)}
                >
                  + Add Dish
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="submit-container">
        <button 
          onClick={handleSubmit} 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Saving Menu...' : 'Save Menu'}
        </button>
      </div>
    </div>
  );
}