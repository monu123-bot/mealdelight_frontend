import React from 'react';
import '../style/BasicInfo.css';
import Lottie from "lottie-react";
import helloAnimation from "../../../assets/hello.json";
const BasicInfo = ({ data, setData }) => {
  return (
    <div className="basic-info-container">
      <Lottie animationData={helloAnimation} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />
      <h2 className="section-title">1. Basic Information</h2>
      
      <label className="input-label">Full Name:</label>
      <input
        type="text"
        className="input-field"
        value={data.fullName}
        onChange={(e) => setData({ ...data, fullName: e.target.value })}
        placeholder="Enter your full name"
        required
      />
      
      <label className="input-label">Age:</label>
      <select
        className="input-field"
        value={data.age}
        onChange={(e) => setData({ ...data, age: e.target.value })}
      >
        <option value="">Select Age</option>
        {["18-24", "25-34", "35-44", "45-54", "55+"].map((age) => (
          <option key={age} value={age}>
            {age}
          </option>
        ))}
      </select>
      
      <label className="input-label">Gender:</label>
      <select
        className="input-field"
        value={data.gender}
        onChange={(e) => setData({ ...data, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        {["Male", "Female", "Other", "Prefer Not to Say"].map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </select>
      
      <label className="input-label">Contact Email (For Updates & Discounts):</label>
      <input
        type="email"
        className="input-field"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        placeholder="Enter your email"
      />
      
      <label className="input-label">Phone Number (For Special Offers):</label>
      <input
        type="tel"
        className="input-field"
        value={data.phone}
        onChange={(e) => setData({ ...data, phone: e.target.value })}
        placeholder="Enter your phone number"
      />
    </div>
  );
};

export default BasicInfo;
