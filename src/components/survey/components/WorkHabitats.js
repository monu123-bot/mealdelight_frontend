import React from "react";
import "../style/WorkHabitats.css";

const WorkHabitats = ({ data, setData }) => {
  return (
    <div className="work-habitats-container">
      <h2 className="section-title">Work & Lifestyle</h2>

      {/* Occupation */}
      <label className="input-label">What is your occupation?</label>
      <div className="checkbox-group">
        {["Student", "Working Professional", "Business Owner", "Homemaker", "Retired"].map((occupation) => (
          <label key={occupation}>
            <input
              type="radio"
              name="occupation"
              value={occupation}
              checked={data.occupation === occupation}
              onChange={(e) => setData({ ...data, occupation: e.target.value })}
            />
            {occupation}
          </label>
        ))}
      </div>

      {/* Daily Activity */}
      <label className="input-label">Where do you spend most of your day?</label>
      <div className="checkbox-group">
        {["At Home", "At Office", "Traveling", "Outdoors"].map((place) => (
          <label key={place}>
            <input
              type="radio"
              name="dailyActivity"
              value={place}
              checked={data.dailyActivity === place}
              onChange={(e) => setData({ ...data, dailyActivity: e.target.value })}
            />
            {place}
          </label>
        ))}
      </div>

      {/* Food Ordering Frequency */}
      <label className="input-label">How often do you order food online?</label>
      <div className="radio-group">
        {["Daily", "Few times a week", "Few times a month", "Rarely", "Never"].map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="foodOrdering"
              value={option}
              checked={data.foodOrdering === option}
              onChange={(e) => setData({ ...data, foodOrdering: e.target.value })}
            />
            {option}
          </label>
        ))}
      </div>

      {/* Meal Delivery Timing */}
      <label className="input-label">What time do you prefer your meals to be delivered?</label>
      <div className="meal-time-group">
        {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
          <div key={meal} className="meal-time">
            <label>{meal}:</label>
            <input
              type="time"
              value={data.mealTimes[meal] || ""}
              onChange={(e) => setData({ ...data, mealTimes: { ...data.mealTimes, [meal]: e.target.value } })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkHabitats;