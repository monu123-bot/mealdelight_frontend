import React, { useState } from "react";
import BasicInfo from "./components/BasicInfo";
import Welcome from "./components/Welcome";
import CurrentFoodDetails from "./components/CurrentFoodDetails";
import WorkHabitats from "./components/WorkHabitats";
import Budget from "./components/Budget";
import Customizations from "./components/Customizations";
import Recommendations from "./components/Recommendations";
import Thankyou from "./components/Thankyou";
import MealPreferences from "./components/MealPreferences";
import Location from "./components/Location";
import "./style/MarketSize.css";
import { host } from "../../script/variables";
const MarketSize = () => {
  const [step, setStep] = useState(0);

  // Define state variables for each component
  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
  });

  const [location, setLocation] = useState({
    hometownZip: "",
    currentCityZip: "",
    
  });

  const [currentFoodDetails, setCurrentFoodDetails] = useState({
    mealManagement: [],
    mealsOutside: "",
    subscribed: "",
    mealServiceName: "",
    mealProblems: [],
    issues: [],
    otherIssue: "",
  });

  const [mealPreferences, setMealPreferences] = useState({
    foodType: [],
    hygiene: "",
    spendPerMeal: "",
    mealPlanPreference: "",
    idealMonthlyCost: "",
    healthyMealPreference: "",
  });

  const [workHabitats, setWorkHabitats] = useState({
    workType: "",
    workingHours: "",
    locationPreference: "",
    mealTimes: {
        Breakfast: "",  // Initialize default time for each meal
        Lunch: "",
        Dinner: ""
      }
  });

  const [budget, setBudget] = useState({
    incomeRange: "",
    spendOnMeal: "",
    premiumServices: "",
  });

  const [customizations, setCustomizations] = useState({
    preferences: [],
    interestedPlans: [],
    wantApp: "",
    recommendationPreference: "",
    chooseMealService: [] ,
    mealPlansFor: [], 
  });

  const [recommendations, setRecommendations] = useState({
    suggestions: "",
  });

  const [thankyou, setThankyou] = useState(false)
  // All steps for navigation
  const steps = [
    <Welcome />,
    <BasicInfo data={basicInfo} setData={setBasicInfo} />,
    <Location data={location} setData={setLocation} />,
    <CurrentFoodDetails data={currentFoodDetails} setData={setCurrentFoodDetails} />,
    <MealPreferences data={mealPreferences} setData={setMealPreferences} />,
    <WorkHabitats data={workHabitats} setData={setWorkHabitats} />,
    <Budget data={budget} setData={setBudget} />,
    <Customizations data={customizations} setData={setCustomizations} />,
    <Recommendations data={recommendations} setData={setRecommendations} />,
    <Thankyou />,
  ];

  // Go to next step
  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  // Go to previous step
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // Handle final submission to backend
  const handleSubmit = async () => {
    console.log("Submitting survey data...");
    const formData = {
      basicInfo,
      location,
      currentFoodDetails,
      mealPreferences,
      workHabitats,
      budget,
      customizations,
      recommendations,
    };

    try {
      const response = await fetch(`${host}/survey/marketanalysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setThankyou(true); // Show thank you message
        setStep(steps.length - 1); // Navigate to the thank you step
        console.log("Survey submitted successfully!");
      } else {
        console.error("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  return (
    <div className="market-size-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / (steps.length - 1)) * 100}%` }}></div>
      </div>

      {/* Render the Current Step */}
      {steps[step]}

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        {step > 0 && step < steps.length - 1 && (
          <button onClick={prevStep} className="prev-button">Previous</button>
        )}
        {step < steps.length - 2 && (
          <button onClick={nextStep} className="next-button">Next</button>
        )}
        {step === steps.length - 2 && (
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        )}
      </div>
    </div>
  );
};

export default MarketSize;
