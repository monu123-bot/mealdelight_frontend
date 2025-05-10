import React, { useState } from 'react';
import axios from 'axios';
import './style/userActivity.css';
import { host } from '../../script/variables';
import Cookies from 'js-cookie';

const UserActivityHistory = () => {
  const [inputUserId, setInputUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => Cookies.get('adminToken');

  const handleSearch = () => {
    if (!inputUserId.trim()) {
      setError('Please enter a valid User ID.');
      return;
    }
    setError(null);
    fetchUserActivity(inputUserId.trim());
  };

  const fetchUserActivity = async (uid) => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await axios.get(`${host}/admin/getCustomerActivity?id=${uid}`, {
        headers: {
          Authorization: `Bearer JWT ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch user activity');
        setUserData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching user activity');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderUserInfo = () => {
    if (!userData?.user) return null;
    const {
      name, email, phone, gender, dob,
      walletBalance, country, registrationDate, image, status
    } = userData.user;

    return (
      <div className="user-info-card">
        {image && <img src={image} alt="User" className="user-image" />}
        <div className="user-info">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>DOB:</strong> {dob}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Country:</strong> {country}</p>
          <p><strong>Wallet Balance:</strong> ₹{walletBalance}</p>
          <p><strong>Registered on:</strong> {new Date(registrationDate).toLocaleString()}</p>
        </div>
      </div>
    );
  };

  const renderAddresses = () => {
    if (!userData?.addresses?.length) return <p>No addresses found</p>;

    return (
      <div className="addresses-section">
        <h3>Addresses</h3>
        {userData.addresses.map((addr, index) => (
          <div key={addr._id} className="address-card">
            <p><strong>Receiver:</strong> {addr.recievers_name}</p>
            <p><strong>Address:</strong> {addr.address}</p>
            <p><strong>Is Default:</strong> {addr.isDefault ? 'Yes' : 'No'}</p>
            <p><strong>Created:</strong> {new Date(addr.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderActivityTimeline = () => {
    if (!userData?.activities?.length) return <p>No activity found</p>;

    return (
      <div className="activity-section">
        <h3>Activity Timeline</h3>
        {userData.activities.map((act, idx) => (
          <div key={idx} className="activity-entry">
            <p><strong>Date:</strong> {new Date(act.date).toLocaleString()}</p>
            <p><strong>Type:</strong> {act.type.replace('_', ' ').toUpperCase()}</p>
            <div className="activity-details">
              {Object.entries(act.details).map(([key, val]) => (
                <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {Array.isArray(val) ? val.join(', ') : String(val)}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="user-activity-history">
      <h2>User Activity History</h2>

      <div className="user-id-input-section">
        <input
          type="text"
          placeholder="Enter User ID"
          value={inputUserId}
          onChange={(e) => setInputUserId(e.target.value)}
          className="input-user-id"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {renderUserInfo()}
      {renderAddresses()}
      {renderActivityTimeline()}
    </div>
  );
};

export default UserActivityHistory;
