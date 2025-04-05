// validateEmail.js
import axios from "axios";

const API_KEY = process.env.YOUR_ZEROBOUNCE_API_KEY; // Replace with your actual API key

export const validateEmail = async (email) => {
    console.log("Validating email:", email);
  try {
    const response = await axios.get("https://api.zerobounce.net/v2/validate", {
      params: {
        api_key: API_KEY,
        email: email,
      },
    });

    console.log(response.data);
    if (response.data.status === "valid") {
        alert("Email is valid.");
      return true;
    } else {
      alert("Invalid email address. Please enter a valid email.");
      return false;
    }
  } catch (error) {
    console.error("ZeroBounce validation error:", error);
    alert("Error validating email.");
    return false;
  }
};
