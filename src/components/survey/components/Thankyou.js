import React, { useEffect, useState } from "react";
import "../style/Thankyou.css";

const Thankyou = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(true);
    }, 500); // Delay the message for 500ms to allow the animation to run first
  }, []);

  return (
    <div className={`thankyou-container ${showMessage ? "show" : ""}`}>
      <h2 className="thankyou-message">Thank you for your feedback!</h2>
      <p className="thankyou-submessage">We appreciate your time and input.</p>
    </div>
  );
};

export default Thankyou;
