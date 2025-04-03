
import React from "react";
import "../style/MealPreferences.css";
import Lottie from "lottie-react";
import PreferencesAnimation from "../../../assets/preferences.json";

const MealPreferences = ({ data, setData }) => {
  return (
    <div className="meal-preferences-container">
                    <Lottie animationData={PreferencesAnimation} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />

      <h2 className="section-title">Meal Preferences</h2>

      {/* Food Type */}
      <label className="input-label">What type of food do you prefer?</label>
      <div className="checkbox-group">
        {["North Indian", "South Indian", "Jain", "Vegan", "Continental"].map(
          (food) => (
            <label key={food}>
              <input
                type="checkbox"
                value={food}
                checked={data.foodType.includes(food)}
                onChange={() =>
                  setData({
                    ...data,
                    foodType: data.foodType.includes(food)
                      ? data.foodType.filter((item) => item !== food)
                      : [...data.foodType, food],
                  })
                }
              />
              {food}
            </label>
          )
        )}
      </div>

      {/* Hygiene Importance */}
      <label className="input-label">How important is hygiene in your meal selection?</label>
      <div className="radio-group">
        {["Extremely Important", "Important", "Neutral", "Not Important"].map(
          (option) => (
            <label key={option}>
              <input
                type="radio"
                name="hygiene"
                value={option}
                checked={data.hygiene === option}
                onChange={(e) => setData({ ...data, hygiene: e.target.value })}
              />
              {option}
            </label>
          )
        )}
      </div>

      {/* Meal Cost */}
      <label className="input-label">How much do you usually spend per meal?</label>
      <div className="radio-group">
        {["₹50-₹100", "₹100-₹150", "₹150-₹200", "₹200+"].map((cost) => (
          <label key={cost}>
            <input
              type="radio"
              name="spendPerMeal"
              value={cost}
              checked={data.spendPerMeal === cost}
              onChange={(e) => setData({ ...data, spendPerMeal: e.target.value })}
            />
            {cost}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MealPreferences;