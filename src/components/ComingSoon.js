import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/ComingSoon.css";
import { host } from "../script/variables";

const ComingSoon = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Launch date - set to 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = launchDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload

    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
    const response = await fetch(`${host}/survey/joinwaitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("You have successfully subscribed!");
        setEmail(""); // Clear input field
      } else {
        setMessage(data.message || "Something went wrong. Try again!");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setMessage("Error connecting to the server. Try again!");
    }
  };

  return (
    <div className="coming-soon-container">
      <div className="content-wrapper">
        <div className="header animate-fade-in">
          <h1>Coming Soon</h1>
          <p className="subheading">We're preparing something delicious for you!</p>
        </div>

        {/* Countdown Timer */}
        <div className="countdown-container">
          <div className="countdown-item animate-slide-up">
            <div className="countdown-value">{countdown.days}</div>
            <div className="countdown-label">Days</div>
          </div>
          <div className="countdown-item animate-slide-up delay-100">
            <div className="countdown-value">{countdown.hours}</div>
            <div className="countdown-label">Hours</div>
          </div>
          <div className="countdown-item animate-slide-up delay-200">
            <div className="countdown-value">{countdown.minutes}</div>
            <div className="countdown-label">Minutes</div>
          </div>
          <div className="countdown-item animate-slide-up delay-300">
            <div className="countdown-value">{countdown.seconds}</div>
            <div className="countdown-label">Seconds</div>
          </div>
        </div>

        {/* Survey Info and Link */}
        <div className="info-section animate-fade-in delay-400">
          <h2>Help Us Understand Your Needs</h2>
          <p>
            We're creating a revolutionary meal service tailored to your preferences.
            Help us by taking our survey and shape the future of food delivery!
          </p>
          
          <Link to ="/survey/marketsize" className="cta-button">
            Take Our Survey
          </Link>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section animate-fade-in delay-500">
          <h3>Get Notified When We Launch</h3>
          <form className="subscribe-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Notify Me</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>

        {/* Social Media Links */}
        <div className="social-links animate-fade-in delay-600">
          <a href="#" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
