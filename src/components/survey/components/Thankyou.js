import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../style/Thankyou.css";

const Thankyou = ({ discountCoupon, surveyId }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(true);
    }, 500);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(discountCoupon);
    alert("Coupon copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="thankyou-container"
    >
      <motion.h2 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.5 }}
        className="thankyou-message"
      >
        Thank you for your feedback!
      </motion.h2>

      <motion.p 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.5, duration: 0.5 }}
        className="thankyou-submessage"
      >
        We appreciate your time and input.
      </motion.p>

      {discountCoupon && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.7, duration: 0.5 }}
          className="coupon-container"
        >
          <p className="thankyou-submessage">
          Please check your email folder for the coupon code.
          </p>
          <p className="thankyou-submessage">
            Your Survey ID: <strong>{surveyId}</strong>
          </p>
          <button className="copy-btn" onClick={copyToClipboard}>
            Copy Coupon
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Thankyou;
