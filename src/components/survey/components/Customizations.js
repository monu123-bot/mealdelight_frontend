import React, { useState } from "react";
import "../style/Customizations.css";

const Customizations = ({ data, setData }) => {
  const handleCheckboxChange = (field, value) => {
    setData({
      ...data,
      [field]: data[field].includes(value)
        ? data[field].filter((item) => item !== value)
        : [...data[field], value],
    });
  };

  return (
    <div className="customizations-container">
      <h2 className="section-title">Customizations</h2>

      {/* What would make you choose our meal service? */}
      <label className="input-label">What would make you choose our meal service over others? (Select all that apply)</label>
      <div className="checkbox-group">
        {[
          "More affordable pricing",
          "Better hygiene standards",
          "More food variety",
          "Guaranteed timely delivery",
          "Organic or preservative-free food",
          "Large portion sizes",
        ].map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              value={option}
              checked={data.chooseMealService.includes(option)}
              onChange={() => handleCheckboxChange("chooseMealService", option)}
            />
            {option}
          </label>
        ))}
        {/* Other checkbox option with input */}
        <label>
          <input
            type="checkbox"
            checked={data.chooseMealService.includes("Other")}
            onChange={() => handleCheckboxChange("chooseMealService", "Other")}
          />
          Other:
          <input
            type="text"
            className="text-input small"
            value={data.otherChoice}
            onChange={(e) => setData({ ...data, otherChoice: e.target.value })}
            placeholder="Specify other reason"
            disabled={!data.chooseMealService.includes("Other")}
          />
        </label>
      </div>

      {/* Would you be interested in meal plans for? */}
      <label className="input-label">Would you be interested in meal plans for: (Select all that apply)</label>
      <div className="checkbox-group">
        {[
          "Yourself",
          "Family",
          "Elderly Parents",
          "Office Staff",
          "Gym/Fitness Diet",
        ].map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              value={option}
              checked={data.mealPlansFor.includes(option)}
              onChange={() => handleCheckboxChange("mealPlansFor", option)}
            />
            {option}
          </label>
        ))}
      </div>

      {/* Would you be interested in an app? */}
      <label className="input-label">Would you be interested in an app to track your meal deliveries, provide feedback, and manage subscriptions?</label>
      <div className="radio-group">
        {["Yes", "No"].map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="appInterest"
              value={option}
              checked={data.appInterest === option}
              onChange={(e) => setData({ ...data, appInterest: e.target.value })}
            />
            {option}
          </label>
        ))}
      </div>

      {/* Would you recommend a good meal service to friends/family? */}
      <label className="input-label">Would you recommend a good meal service to friends/family?</label>
      <div className="radio-group">
        {["Yes, if it’s good", "Maybe", "No"].map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="recommendMealService"
              value={option}
              checked={data.recommendMealService === option}
              onChange={(e) => setData({ ...data, recommendMealService: e.target.value })}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Customizations;
