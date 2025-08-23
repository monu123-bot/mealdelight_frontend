import React, { useEffect, useState } from "react";
import { host } from "../../script/variables";
import "../../style/userdashboard/referral.css";

const Referral = ({ user, setUser }) => {
  const [referralCode, setReferralCode] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("mealdelight");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${host}/referral/get_referrals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch referrals");

      setReferrals(data.data || []);
      setReferralCode(data.my_referral_code || null);
      setMessage(data.message || "");
    } catch (error) {
      console.error("Error fetching referrals:", error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("mealdelight");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${host}/referral/generate_code`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to generate referral code");

      setReferralCode(data.referralCode);
      setMessage(data.message || "");
    } catch (error) {
      console.error("Error generating referral code:", error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "active":
        return "#FFC107"; // Yellow
      case "success":
      case "completed":
        return "#28A745"; // Green
      case "pending":
        return "#6C757D"; // Gray
      case "failed":
      case "rejected":
        return "#DC3545"; // Red
      default:
        return "#6C757D"; // Gray for unknown status
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone || phone.trim() === "") return "Not provided";
    return phone;
  };

  const formatName = (referee) => {
    if (!referee) return "Unknown User";
    
    const firstName = referee.firstName?.trim() || "";
    const lastName = referee.lastName?.trim() || "";
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else {
      return "Unknown User";
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <div className="referral-container">
      {message && <p className="message">{message}</p>}

      <div className="referral-code-section">
        <div className="section-header">
          <h2 className="section-title">🎁 Your Referral Code</h2>
          <p className="section-subtitle">Share this code with friends and earn rewards!</p>
        </div>
        
        {referralCode ? (
          <div className="wooden-code-container">
            <div className="wooden-plank">
              <div className="wood-grain"></div>
              <div className="wood-grain wood-grain-2"></div>
              <div className="wood-grain wood-grain-3"></div>
              <div className="code-content">
                <div className="engraved-text">
                  <span className="referral-code">{referralCode}</span>
                </div>
                <div className="wooden-details">
                  <div className="nail nail-1"></div>
                  <div className="nail nail-2"></div>
                  <div className="nail nail-3"></div>
                  <div className="nail nail-4"></div>
                </div>
              </div>
            </div>
            <button 
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(referralCode)}
              title="Copy referral code"
            >
              📋 Copy Code
            </button>
          </div>
        ) : (
          <div className="generate-code-container">
            <div className="generate-illustration">
              <div className="tree-icon">🌳</div>
              <div className="arrow-down">↓</div>
              <div className="wood-piece">🪵</div>
            </div>
            <button 
              className="generate-btn" 
              onClick={generateReferralCode}
              disabled={loading}
            >
              <span className="btn-icon">🔨</span>
              <span className="btn-text">
                {loading ? "Crafting Your Code..." : "Craft Referral Code"}
              </span>
            </button>
          </div>
        )}
      </div>

      <h3>People You Referred</h3>
      {loading ? (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      ) : referrals.length > 0 ? (
        <div className="referral-cards-container">
          {referrals.map((ref, index) => {
            const status = ref.status || "pending";
            const statusColor = getStatusColor(status);
            
            return (
              <div key={ref.id || index} className="referral-card">
                <div className="card-header">
                  <div className="status-section">
                    <div 
                      className="status-dot" 
                      style={{ backgroundColor: statusColor }}
                    ></div>
                    <span className={`status-text status-${status.toLowerCase()}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  <div className="joined-date">
                    {formatDate(ref.createdAt)}
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="user-info">
                    <h4 className="user-name">
                      {formatName(ref.referee)}
                    </h4>
                    <p className="phone-number">
                      📞 {formatPhoneNumber(ref.referee?.phone)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-referrals">
          <p>No referrals yet.</p>
          <p className="no-referrals-subtitle">
            Share your referral code with friends to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Referral;