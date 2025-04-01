import React from "react";
import "../style/Recomendations.css";

const Recommendations = ({ data, setData }) => {
  return (
    <div className="recommendations-container">
      <h2 className="section-title">Recommendations</h2>
      
      {/* Suggestions Text Input */}
      <label className="input-label">Any suggestions or features you want in a meal service?</label>
      <textarea
        className="suggestions-textarea"
        value={data.suggestions}
        onChange={(e) => setData({ ...data, suggestions: e.target.value })}
        placeholder="Write your suggestions or feature requests here..."
      />
    </div>
  );
};

export default Recommendations;