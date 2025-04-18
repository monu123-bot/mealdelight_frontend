import React from 'react';
import '../style/RecipeDetail.css';

const RecipeDetail = ({ recipe }) => {
  if (!recipe) return <div>Loading...</div>;

  // Collect non-null ingredients and steps
  const ingredients = [];
  const steps = [];

  for (let i = 1; i <= 10; i++) {
    const ing = recipe[`ingredient_${i}`];
    const meas = recipe[`measurement_${i}`];
    if (ing) {
      ingredients.push(`${meas || ''} ${ing}`.trim());
    }

    const step = recipe[`directions_step_${i}`];
    if (step) {
      steps.push(step);
    }
  }

  return (
    <div className="recipe-detail-container">
      <h2>{recipe.recipe}</h2>
      <img src={recipe.image} alt={recipe.recipe} className="recipe-img" />

      <div className="info-grid">
        <p><strong>Category:</strong> {recipe.category?.category}</p>
        <p><strong>Prep Time:</strong> {recipe.prep_time_in_minutes} min</p>
        <p><strong>Cook Time:</strong> {recipe.cook_time_in_minutes} min</p>
        <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
        <p><strong>Servings:</strong> {recipe.serving}</p>
        <p><strong>Calories:</strong> {recipe.calories} kcal</p>
      </div>

      <h3>Ingredients:</h3>
      <ul className="ingredients-list">
        {ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>

      <h3>Directions:</h3>
      <ol className="steps-list">
        {steps.map((step, idx) => <li key={idx}>{step}</li>)}
      </ol>
    </div>
  );
};

export default RecipeDetail;
