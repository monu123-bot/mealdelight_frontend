import React from 'react';
import '../style/ReciepieCard.css';

const RecipeCard = ({ recipe }) => {
  // Extract ingredients and steps
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
      <h3>{recipe.recipe}</h3>
      <p><strong>Category:</strong> {recipe.category?.category}</p>
      <p><strong>Prep Time:</strong> {recipe.prep_time_in_minutes} min</p>
      <p><strong>Cook Time:</strong> {recipe.cook_time_in_minutes} min</p>
      <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
      <p><strong>Calories:</strong> {recipe.calories}</p>

      <h4>Ingredients:</h4>
      <ul className="ingredient-list">
        {ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h4>Directions:</h4>
      <ol className="direction-list">
        {directions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeCard;
