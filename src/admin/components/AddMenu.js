import React, { useState } from 'react';
import '../style/AddMenu.css';
import axios from 'axios';
import { host } from '../../script/variables';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday','sunday'];
const meals = ['breakfast', 'lunch', 'dinner'];

export default function AddMenu() {
    const [loading, setLoading] = useState(false); // Optional: for loading spinner
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

  const handleSubmit = async () => {
    try {
      setLoading(true); // Optional: show loading spinner
      const response = await axios.post(`${host}/admin/addmenu`, menu);
      
      if (response.status === 200) {
        alert('Menu added successfully!');
      } else {
        alert('Unexpected response from server.');
        console.warn('Response:', response);
      }
    } catch (error) {
      console.error('Error while adding menu:', error);
      alert('Failed to add menu. Please try again.');
    } finally {
      setLoading(false); // Optional: hide loading spinner
    }
  };

  return (
    <div className="add-menu">
      <h2>Add Weekly Menu</h2>
      {days.map(day => (
        <div key={day} className="day-section">
          <h3>{day.toUpperCase()}</h3>
          {meals.map(meal => (
            <div key={meal}>
              <strong>{meal}</strong>
              {menu[day][meal].map((dish, index) => (
                <input
                  key={index}
                  value={dish}
                  onChange={e => handleChange(day, meal, index, e.target.value)}
                  placeholder={`Enter ${meal} dish`}
                />
              ))}
              <button onClick={() => addDishField(day, meal)}>+ Add Dish</button>
            </div>
          ))}
        </div>
      ))}
         {/* Optional: loading spinner */}
      <button onClick={handleSubmit}>
        
      {loading && <p>Saving Menu...</p>}
        {!loading && <p>Save Menu</p>} {/* Change button text based on loading state */}
        
        </button>
    </div>
  );
}
