import React, { useEffect, useState } from "react";
import "../style/Welcome.css";

const Welcome = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowText(true);
    }, 500); // Delay animation
  }, []);

  return (
    <div className="welcome-container">
      <h1 className={`welcome-title ${showText ? "fade-in" : ""}`}>
        Survey for Meal Delight - Revolutionizing Healthy & Affordable Meals!
      </h1>
      <h4 className={`welcome-subtext ${showText ? "slide-in" : ""}`}>
        🎁 Win Discounts! <br />
        📢 Fill this survey & get an exclusive discount on your first order when we launch!
      </h4>
    </div>
  );
};

export default Welcome;
