import React, { useState } from "react";
import "../style/Budget.css"; // Assuming you have a CSS file for styling

const Budget = ({ data, setData }) => {
  return (
    <div className="budget-container">
      <h2 className="section-title">Budget Preferences</h2>

      <label className="input-label">What is your monthly income range? (Confidential & Optional)</label>
      <div className="radio-group">
        {["Below ₹20,000", "₹20,000 - ₹40,000", "₹40,000 - ₹70,000", "₹70,000+"].map((range) => (
          <label key={range}>
            <input
              type="radio"
              name="incomeRange"
              value={range}
              checked={data.incomeRange === range}
              onChange={(e) => setData({ ...data, incomeRange: e.target.value })}
            />
            {range}
          </label>
        ))}
      </div>

      <label className="input-label">How much are you willing to spend per month on a meal service?</label>
      <div className="radio-group">
        {["₹2000-₹3000", "₹3000-₹4000", "₹4000-₹5000", "₹5000+"].map((budget) => (
          <label key={budget}>
            <input
              type="radio"
              name="mealBudget"
              value={budget}
              checked={data.mealBudget === budget}
              onChange={(e) => setData({ ...data, mealBudget: e.target.value })}
            />
            {budget}
          </label>
        ))}
      </div>

      <label className="input-label">Would you pay extra for premium services like customized diet plans, organic food, or chef-curated meals?</label>
      <div className="radio-group">
        {["Yes, definitely", "Maybe, if affordable", "No, I prefer basic meals"].map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="premiumServices"
              value={option}
              checked={data.premiumServices === option}
              onChange={(e) => setData({ ...data, premiumServices: e.target.value })}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Budget;
