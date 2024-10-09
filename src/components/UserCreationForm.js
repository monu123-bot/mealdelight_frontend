import React, { useState } from 'react';
import '../style/UserCreationForm.css';
import axios from 'axios';

function UserCreationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'customer',
    password: '',
    street: '',
    city: '',
    state: '',
    address: '',
    postalCode: '',
    apartment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/user/create', formData);
      alert(response.data.msg);
    } catch (error) {
      alert('Error creating user: ' + error.response?.data?.msg || error.message);
    }
  };

  return (
    <div className="user-creation-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <h3>Delivery Address Details</h3>
        <div className="form-group">
          <label>Street:</label>
          <input type="text" name="street" value={formData.street} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Apartment/Flat/Floor :</label>
          <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>State:</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Postal Code:</label>
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Full Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        
        <button type="submit" className="btn">Create User</button>
      </form>
    </div>
  );
}

export default UserCreationForm;
