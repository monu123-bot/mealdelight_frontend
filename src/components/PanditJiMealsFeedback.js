import React, { useState } from 'react';
import '../style/PanditJiMealsFeedback.css'; // External CSS file (content provided below)
import { Link } from 'react-router-dom';

const meals = [
  {
    name: 'Aloo Bhujia',
    ingredients: ['Potato', 'Asafoetida Powder', 'Cumin Seeds', 'Green Chili', 'Tata Salt', 'Coriander', 'Turmeric Powder', 'Lemon Juice'],
  },
  {
    name: 'Rice Bowl',
    ingredients: ['Boiled Basmati Rice', 'Tata Salt', 'Whole Spices'],
  },
  {
    name: 'Mix Daal',
    ingredients: ['Pigeon Pea (Toor Dal)', 'Bengal Gram (Chana Dal)', 'Split Green Gram (Moong Dal)', 'Split Black Gram (Urad Dal)', 'Red Lentils (Masoor Dal)', 'Ginger', 'Onion', 'Coriander', 'Tomato', 'Red Chili', 'Tata Salt', 'Coriander Powder'],
  },
  {
    name: 'Chhole',
    ingredients: ['Chickpeas', 'Onion', 'Tomato', 'Green Chili', 'Coriander Powder', 'Dried Fenugreek Leaves', 'Tata Salt', 'Garam Masala', 'Turmeric Powder', 'Kitchen King Masala', 'Amul Cream'],
  },
  {
    name: 'Rajma',
    ingredients: ['Kidney Beans', 'Onion', 'Tomato', 'Green Chili', 'Coriander Powder', 'Dried Fenugreek Leaves', 'Tata Salt', 'Garam Masala', 'Turmeric Powder', 'Kitchen King Masala', 'Amul Cream'],
  },
  {
    name: 'Tawa Roti',
    ingredients: ['Wheat Flour (Ashirvaad)', 'Water', 'Salt (optional)'],
  },
  {
    name: 'Suji Halwa',
    ingredients: ['Semolina (Suji)', 'Cardamom', 'Raisins', 'Patanjali Ghee', 'Desiccated Coconut'],
  },
  {
    name: 'Suji Chilla',
    ingredients: ['Semolina (Suji)', 'Onion', 'Tomato', 'Spices', 'Salt', 'Coriander', 'Curd (Yogurt)'],
  },
  {
    name: 'Special Chutney',
    ingredients: ['Green Chili', 'Coriander', 'Onion', 'Salt', 'Curd (Yogurt)', 'Tomato'],
  },
  {
    name: 'Besan Chilla',
    ingredients: ['Gram Flour (Besan)', 'Onion', 'Tomato', 'Green Chili', 'Salt', 'Coriander'],
  },
  {
    name: 'Raita',
    ingredients: ['Gram Flour Boondi', 'Rock Salt', 'Cumin Seeds', 'Coriander', 'Tata Salt', 'Curd (Yogurt)'],
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
