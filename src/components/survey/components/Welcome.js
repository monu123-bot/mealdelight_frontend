import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import mealAnimation from "../../../assets/meal.json"; // Lottie animation file
import deliveryAnimation from "../../../assets/delivery.json";
import "../style/Welcome.css";

const Welcome = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowText(true);
    }, 500);
  }, []);

  return (
    <div className="welcome-container">
      {/* Animated Meal Icon */}
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1.5, opacity: 1 }} 
        transition={{ duration: 1, ease: "easeOut" }}
        className="meal-animation"
      >
        <Lottie animationData={mealAnimation} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />
      </motion.div>

      {/* Title */}
      <motion.h1 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
        className="welcome-title"
      >
        Survey for Meal Delight - Revolutionizing Healthy & Affordable Meals!
      </motion.h1>

      {/* Subtitle */}
      <motion.h4 
        initial={{ x: -20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ delay: 0.5, duration: 0.8 }}
        className="welcome-subtext"
      >
        🎁 Win Discounts! <br />
        📢 Fill this survey & get an exclusive discount on your first order when we launch!
      </motion.h4>

      {/* Hygiene Animation */}
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 1, delay: 0.7 }}
        className="hygiene-animation"
      >
        {/* <Lottie animationData={deliveryAnimation} loop autoplay style={{ width: 120, height: 120 }} /> */}
      </motion.div>
    </div>
  );
};

export default Welcome;
