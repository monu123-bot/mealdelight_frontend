import React, { useState } from 'react';
import '../style/PanditJiMealsFeedback.css'; // External CSS file (content provided below)
import { Link } from 'react-router-dom';

const meals = [
  {
    name: 'Normal Thali',
    ingredients: ['Rice', '2-Tawa Roti', 'Daal', 'Aloo', 'Bhujia', 'Salad'],
  },
  {
    name: 'Special Thali',
    ingredients: ['Rice', '2-Tawa Roti', 'Daal', 'Aloo Bhujia', 'Chhole', 'Salad', '1 Sweet'],
  },
  {
    name: 'Rice Bowl',
    ingredients: ['500 gm Boiled Rice'],
  },
  {
    name: 'Mix Daal',
    ingredients: ['Toor Daal', 'Chana Daal', 'Moong Daal', 'Spices', 'Salt'],
  },
  {
    name: 'Chhole',
    ingredients: ['Chickpeas', 'Onion', 'Tomato', 'Spices', 'Oil'],
  },
  {
    name: 'Rajma',
    ingredients: ['Kidney Beans', 'Onion', 'Tomato', 'Spices', 'Oil'],
  },
  {
    name: 'Tawa Roti',
    ingredients: ['Wheat Flour', 'Water', 'Salt (optional)'],
  },
];

const PanditJiMealsFeedback = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIngredients = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="meal-container">
      <div className="logo">
        <img src="veg meal logo.jpg" alt="Meal Delight Logo" />
      </div>
  
      <h1>Select a Meal to View Ingredients</h1>
  
      <div id="menu">
        {meals.map((meal, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => toggleIngredients(index)}
          >
            <strong>{meal.name}</strong>
            {openIndex === index && (
              <div className="ingredients">
                <ul>
                  {meal.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
                <div className="qr-section">
                  <p style={{ marginTop: '1rem' }}></p>
                  <a
                    href={`https://wa.me/917093913024?text=Hi%2C%20I%20want%20to%20give%20feedback%20on%20my%20meal.%20${encodeURIComponent(
                      meal.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-button"
                  >
                    Give your feedback for this meal
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
  
      <div className="qr-section">
       <Link style={{color:'#632C00'}} to="/survey/marketsize" className="qr-link" >Participate in our survey</Link>
      </div>
    </div>
  );
  
};

export default PanditJiMealsFeedback;
