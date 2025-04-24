import React, { useEffect, useState } from 'react';
import '../style/ShowMenu.css';
import axios from 'axios';
import { host } from '../script/variables';

export default function ShowMenu({ MenuId }) {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${host}/plans/menu?id=${MenuId}`);
        setMenu(res.data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        alert('Something went wrong while fetching the menu.');
      }
    };

    fetchMenu();
  }, [MenuId]);

  const weekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    
  ];
  

  if (!menu) return <div className="show-menu-loading">Loading menu...</div>;

  return (
    <div className="show-menu-container">
      <h2 className="menu-title">This Week's Menu</h2>
      <div className="menu-scroll-wrapper">
        {weekdays.map(day => {
          const meals = menu?.[day];
          if (!meals) return null;
  
          return (
            <div key={day} className="day-card">
              <h3>{day.toUpperCase()}</h3>
              <p>
                <strong>Breakfast:</strong>{' '}
                {meals.breakfast?.map(m => m.name).filter(Boolean).join(', ') || 'N/A'}
              </p>
              <p>
                <strong>Lunch:</strong>{' '}
                {meals.lunch?.map(m => m.name).filter(Boolean).join(', ') || 'N/A'}
              </p>
              <p>
                <strong>Dinner:</strong>{' '}
                {meals.dinner?.map(m => m.name).filter(Boolean).join(', ') || 'N/A'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
