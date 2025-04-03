import React, { useState } from "react";
import "../style/CurrentFoodDetails.css"; // Assuming you have a CSS file for styling
import Lottie from "lottie-react";
import currentFoodAnimation from "../../../assets/current_food_details.json";

const CurrentFoodDetails = ({ data, setData }) => {
  const handleCheckboxChange = (field, value) => {
    setData({
      ...data,
      [field]: data[field].includes(value)
        ? data[field].filter((item) => item !== value)
        : [...data[field], value],
    });
  };

  return (
    <div className="food-details-container">
      <Lottie animationData={currentFoodAnimation} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />

      <h2 className="section-title">Current Food Details</h2>

      {/* Meal Management */}
      <div className="input-container">
        <label className="input-label">How do you usually manage your meals?</label>
        <div className="checkbox-group">
          {["Cook at home", "Order from restaurants", "Have a tiffin/meal service", "Eat outside frequently", "Rely on instant/ready-to-eat food"].map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={data.mealManagement.includes(option)}
                onChange={() => handleCheckboxChange("mealManagement", option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Meals Outside */}
      <div className="input-container">
        <label className="input-label">How many meals do you consume outside your home daily?</label>
        <select
          className=""
          value={data.mealsOutside}
          onChange={(e) => setData({ ...data, mealsOutside: e.target.value })}
        >
          <option value="">Select</option>
          <option value="0">0 Meal</option>
          <option value="1">1 Meal</option>
          <option value="2">2 Meals</option>
          <option value="3">3 Meals</option>
          <option value="-1">Occasionally</option>
        </select>
      </div>

      {/* Meal Service Subscription */}
      <div className="input-container">
        <label className="input-label">Are you currently subscribed to a meal/tiffin service?</label>
        <select
          className=""
          value={data.mealServiceSubscribed}
          onChange={(e) => setData({ ...data, mealServiceSubscribed: e.target.value })}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Meal Service Name */}
      {data.mealServiceSubscribed === "Yes" && (
        <div className="input-container">
          <label className="input-label">If yes, what is the name of the meal service?</label>
          <input
            type="text"
            className="text-input"
            value={data.mealServiceName}
            onChange={(e) => setData({ ...data, mealServiceName: e.target.value })}
            placeholder="Enter meal service name"
          />
        </div>
      )}

      {/* Problems with Current Meal Service */}
      <div className="input-container">
        <label className="input-label">What problems are you facing with your current meal service? (Select all that apply)</label>
        <div className="checkbox-group">
          {["Expensive", "Not hygienic", "Poor taste", "Unhealthy food", "Late delivery", "Less variety", "Low quantity", "Unreliable service"].map((problem) => (
            <label key={problem}>
              <input
                type="checkbox"
                value={problem}
                checked={data.mealProblems.includes(problem)}
                onChange={() => handleCheckboxChange("mealProblems", problem)}
              />
              {problem}
            </label>
          ))}
          {/* Other Problems Input */}
          <label>
            <input
              type="checkbox"
              checked={data.mealProblems.includes("Other")}
              onChange={() => handleCheckboxChange("mealProblems", "Other")}
            />
            Other:
            <input
              type="text"
              className="text-input small"
              value={data.otherMealProblem}
              onChange={(e) => setData({ ...data, otherMealProblem: e.target.value })}
              placeholder="Specify other problem"
              disabled={!data.mealProblems.includes("Other")}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default CurrentFoodDetails;