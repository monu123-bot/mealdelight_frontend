import React, { useState,useEffect } from "react";
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
import axios from "axios";
import { useParams } from 'react-router-dom';


const ContinueMarketSize = () => {
  const { survey_Id } = useParams();
  console.log(survey_Id)
  

  const [step, setStep] = useState(0);
const [surveyId, setSurveyId] = useState(null); // State to store the survey ID 
const [isLocationValid, setIsLocationValid] = useState(false); // State to track if location is valid
const [discountCoupon, setDiscountCoupon] = useState(null); // State to store the discount coupon
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
    // subscribed: "",
    // mealServiceName: "",
    mealProblems: [],
    // issues: [],
    // otherIssue: "",
  });

  const [mealPreferences, setMealPreferences] = useState({
    foodType: [],
    hygiene: "",
    spendPerMeal: "",
    // mealPlanPreference: "",
    // idealMonthlyCost: "",
    // healthyMealPreference: "",
  });

  const [workHabitats, setWorkHabitats] = useState({
    // workType: "",
    // workingHours: "",
    // locationPreference: "",
    mealTimes: {
        Breakfast: "",  // Initialize default time for each meal
        Lunch: "",
        Dinner: ""
      }
  });

  const [budget, setBudget] = useState({
    
    // spendOnMeal: "",
    premiumServices: "",
  });

  const [customizations, setCustomizations] = useState({
    // preferences: [],
    // interestedPlans: [],
    // wantApp: "",
    // recommendationPreference: "",
    chooseMealService: [] ,
    mealPlansFor: [], 
  });

  const [recommendations, setRecommendations] = useState({
    suggestions: "",
  });

  const [thankyou, setThankyou] = useState(false)
 
  const data_indexes = [basicInfo,location,currentFoodDetails,mealPreferences,workHabitats,budget,customizations,recommendations]
  const step_names = ["BasicInfo","Location","CurrentFoodDetails","Meal Preferences","WorkHabitats","Budget","Customizations","Recommendations"]
  // All steps for navigation
  const steps = [
    <Welcome />,
    <BasicInfo data={basicInfo} setData={setBasicInfo} />,
    <Location data={location} setData={setLocation} setIsLocationValid={setIsLocationValid} />,
    <CurrentFoodDetails data={currentFoodDetails} setData={setCurrentFoodDetails} />,
    <MealPreferences data={mealPreferences} setData={setMealPreferences} />,
    <WorkHabitats data={workHabitats} setData={setWorkHabitats} />,
    <Budget data={budget} setData={setBudget} />,
    <Customizations data={customizations} setData={setCustomizations} />,
    <Recommendations data={recommendations} setData={setRecommendations} />,
    <Thankyou discountCoupon={discountCoupon} surveyId={surveyId} />,
  ];
  const validatedInput = (step) => {
    if (step < 0 || step >= data_indexes.length) {
      return true
    }
const info = data_indexes[step]
console.log(info)
    const keys = Object.keys(info);
    for (let i = 0; i < keys.length; i++) {
      if (info[keys[i]] === "" || info[keys[i]].length === 0) {
        return false;
      }
    }
    return true;
  }

  // Function to create survey
  const createSurvey = async (basicInfo) => {
    try {
      const response = await fetch(`${host}/survey/marketanalysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({step, basicInfo }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Survey ID:", data.surveyId); // Log the survey ID
        setSurveyId(data.surveyId); // Store the survey ID in state if needed
        console.log("Survey created successfully!");
        return true
      } else {
        console.error("Failed to create survey.");
        return false
      }
    } catch (error) {
      console.error("Error creating survey:", error);
      return false
    }
  }

  // Go to next step
  const nextStep =async () => {
    if (step === 1) {

      const nameRegex = /^[a-zA-Z\s]{3,50}$/; // Allows only alphabets & spaces, 3-50 characters
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // RFC 5322 email validation
      const phoneRegex = /^[0-9]{10,15}$/; // Allows only numbers, 10-15 digits
    
      // Trim values to remove unnecessary spaces
      basicInfo.fullName = basicInfo.fullName.trim();
      basicInfo.email = basicInfo.email.trim();
      basicInfo.phone = basicInfo.phone.trim();
    
      // Full Name Validation
      if (!nameRegex.test(basicInfo.fullName)) {
        console.error("Invalid Full Name.");
        alert("Please enter a valid full name (only letters and spaces, 3-50 characters).");
        return false;
      }
    
      // Email Validation
      if (!emailRegex.test(basicInfo.email)) {
        console.error("Invalid Email Address.");
        alert("Please enter a valid email address.");
        return false;
      }
    
      // Phone Number Validation
      if (!phoneRegex.test(basicInfo.phone)) {
        console.error("Invalid Phone Number.");
        alert("Please enter a valid phone number (only digits, 10-15 characters).");
        return false;
      }
    
      console.log("All validations passed! Proceeding to the next step.");
  
    }

    if(step==2){

      try {
        const response1 = await axios.get(`https://api.postalpincode.in/pincode/${location.hometownZip}`);
        const response2 = await axios.get(`https://api.postalpincode.in/pincode/${location.currentCityZip}`);
        if (response1.data[0].Status === "Success" && response2.data[0].Status === "Success") {
        
          console.log("ZIP code details fetched successfully!");
        } else {
          return false
        }
      } catch (error) {
        
        console.error("Error fetching ZIP details:", error);
        return false
      }
      
    }
    
    if (!validatedInput(step-1)) {

      console.error("Data for the current step is not defined.");
      alert("Please fill in the required fields before proceeding.");
      return;
    }

   
   if(step==1){
    let resp1 = await createSurvey(basicInfo)
    if (!resp1) {
      alert("Failed to create survey. Please try again.");
      return
    }
   }
   else if (step > 1 ) {
    const response = await fetch(`${host}/survey/marketanalysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({step, data: data_indexes[step-1], surveyId,step_name: step_names[step-1] }),
    }
  
  

  );
    

    if (response.ok) {
      if(step==8 ){
        setThankyou(true); // Show thank you message
        setStep(steps.length - 1); // Navigate to the thank you step
        const data = await response.json();
        setDiscountCoupon(data.discountCode)


      }
      console.log("Survey data updated successfully!");
    } else {
      console.error("Failed to update survey data.");
      return
    }
   }

      
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

  useEffect(() => {
    console.log("Survey ID:", survey_Id);
    if (survey_Id) {
      const fetchSurvey = async () => {
        try {
            const response = await axios.get(`${host}/survey/marketanalysis/${survey_Id}`);
            const data = response.data;
          setBasicInfo(data.basicInfo);
          setLocation(data.location);
          setCurrentFoodDetails(data.currentFoodDetails);
          setMealPreferences(data.mealPreferences);
          setWorkHabitats(data.workHabitats);
          setBudget(data.budget);
          setCustomizations(data.customizations);
          setRecommendations(data.recommendations);
          setStep(data.step);
          setSurveyId(survey_Id);
          console.log("Survey ID:", survey_Id);
        } catch (error) {
          console.error("Failed to fetch survey:", error);
        }
      };

      fetchSurvey();
    }
  }, [survey_Id]); // Include dependencies

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
        {step == 0 && (
          <button onClick={nextStep} className="next-button">Start Survey</button>
        )}
        {step > 0 && step < steps.length - 1 && (
          <button onClick={prevStep} className="prev-button">Previous</button>
        )}
        {(step < steps.length - 2 && step>0) && (
          <button onClick={nextStep} className="next-button">Next</button>
        )}
        {step === steps.length - 2 && (
          <button onClick={nextStep} className="submit-button">Submit</button>
        )}
      </div>
    </div>
  );
};

export default ContinueMarketSize;
