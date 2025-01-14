import React from 'react';
import '../../style/spinner/spinner.css'; // Importing CSS for styling



const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-circle"></div>
      <div className="spinner-dots">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
