import React from "react";
import "../style/Location.css";

const Location = ({ data, setData }) => {
  return (
    <div className="location-container">
      <h2 className="section-title">Location Details</h2>

      {/* Hometown ZIP Input */}
      <label className="input-label">Hometown ZIP:</label>
      <input
        type="text"
        className="text-input"
        value={data.hometownZip}
        onChange={(e) => setData({ ...data, hometownZip: e.target.value })}
        placeholder="Enter your hometown ZIP"
      />

      {/* Current City ZIP Input */}
      <label className="input-label">Current City ZIP:</label>
      <input
        type="text"
        className="text-input"
        value={data.currentCityZip}
        onChange={(e) => setData({ ...data, currentCityZip: e.target.value })}
        placeholder="Enter your current city ZIP"
      />
    </div>
  );
};

export default Location;
