import React, { useState } from 'react';
import '../style/ReciepieCard.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  const [showDetails, setShowDetails] = useState(false);

  const ingredients = [];
  const directions = [];

  for (let i = 1; i <= 10; i++) {
    const ingredient = recipe[`ingredient_${i}`];
    const measurement = recipe[`measurement_${i}`];
    if (ingredient) {
      ingredients.push(`${measurement || ''} ${ingredient}`.trim());
    }

    const step = recipe[`directions_step_${i}`];
    if (step) {
      directions.push(step);
    }
  }

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.recipe} className="recipe-img" />

      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.recipe}</h3>
        <p className="recipe-category">{recipe.category?.category}</p>

        <div className="recipe-meta">
          <span>⏱ Prep: {recipe.prep_time_in_minutes} min</span>
          <span>🍳 Cook: {recipe.cook_time_in_minutes} min</span>
          <span>🔥 {recipe.difficulty}</span>
          <span>🥗 {recipe.calories} cal</span>
        </div>

        <button
          className="toggle-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}{' '}
          {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showDetails && (
          <div className="recipe-details">
            <h4>Ingredients</h4>
            <ul className="ingredient-list">
              {ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h4>Directions</h4>
            <ol className="direction-list">
              {directions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
