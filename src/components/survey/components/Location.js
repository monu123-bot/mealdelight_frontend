import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Location.css";
import Lottie from "lottie-react";
import locationAnimation from "../../../assets/location.json";

const Location = ({ data, setData,setIsLocationValid }) => {
  const [hometownDetails, setHometownDetails] = useState(null);
  const [currentCityDetails, setCurrentCityDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleZipChange = async (zip, type) => {
    setData((prev) => ({ ...prev, [type]: zip }));
    if (zip.length === 6) {
      setMessage("Searching ZIP Code Details...");
      setIsSearching(true);
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${zip}`);
        if (response.data[0].Status === "Success") {
          setMessage("");
          
          const details = response.data[0].PostOffice || [];
          if (type === "hometownZip") {
            setHometownDetails(details);
          } else {
            setCurrentCityDetails(details);
          }
          
        } else {
          if (type === "hometownZip") setHometownDetails(null);
          else setCurrentCityDetails(null);
          setMessage("No post office found for this ZIP code");
        }
      } catch (error) {
        setMessage("Server is busy, Please try again later");
        console.error("Error fetching ZIP details:", error);
      }
      setIsSearching(false);
    } else {
      if (type === "hometownZip") setHometownDetails(null);
      else setCurrentCityDetails(null);
    }
  };
// useEffect(() => {
//   if (hometownDetails && currentCityDetails) {
//     setIsLocationValid(true);
//   } else {
//     setIsLocationValid(false);
//   }}, [data]);
  
  return (
    <div className="location-container">
              <Lottie animationData={locationAnimation} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />
      
      <h2 className="section-title">Location Details</h2>
      <small>Your location will help us understand your regional taste.</small>
      
      <label className="input-label">Hometown ZIP:</label>
      <input
        type="text"
        className="text-input"
        value={data.hometownZip}
        onChange={(e) => handleZipChange(e.target.value, "hometownZip")}
        placeholder="Enter your hometown ZIP"
      />
      {hometownDetails && (
        <div className="zip-details">
          <p><strong>Area:</strong> {hometownDetails[0]?.Name}</p>
          <p><strong>District:</strong> {hometownDetails[0]?.District}</p>
          <p><strong>State:</strong> {hometownDetails[0]?.State}</p>
        </div>
      )}
      
      <label className="input-label">Current City ZIP:</label>
      <input
        type="text"
        className="text-input"
        value={data.currentCityZip}
        onChange={(e) => handleZipChange(e.target.value, "currentCityZip")}
        placeholder="Enter your current city ZIP"
      />
      {currentCityDetails && (
        <div className="zip-details">
          <p><strong>Area:</strong> {currentCityDetails[0]?.Name}</p>
          <p><strong>District:</strong> {currentCityDetails[0]?.District}</p>
          <p><strong>State:</strong> {currentCityDetails[0]?.State}</p>
        </div>
      )}

      {isSearching && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Location;
