import React, { useState } from 'react';
import axios from 'axios';
import '../../style/userdashboard/addNewAddress.css'; // Add relevant styles
import { host } from '../../script/variables';

const AddNewAddress = ({ formData, setFormData,step,setStep }) => {
  

  const [postOffices, setPostOffices] = useState([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState('');
  const [isSearchingPostalCode, setIsSearchingPostalCode] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostalCodeChange = async (code) => {
    handleInputChange('postalCode', code);
    if (code.length === 6) {
      setMessage('Searching Zip Code Details...');
      setIsSearchingPostalCode(true);

      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${code}`);
        if (response.data[0].Status === 'Success') {
          setMessage('');
          setPostOffices(response.data[0].PostOffice || []);
          setIsSearchingPostalCode(false);
        } else {
          setPostOffices([]);
          setMessage('No post office found for this postal code');
        }
      } catch (error) {
        setMessage('Server is busy, Please try after some time');
        console.error('Error fetching post offices:', error);
        setIsSearchingPostalCode(false);
      }
    } else {
      setPostOffices([]);
    }
  };

  const handlePostOfficeChange = (e) => {
    const selectedName = e.target.value;
    setSelectedPostOffice(selectedName);
    const selectedOffice = postOffices.find((office) => office.Name === selectedName);
    if (selectedOffice) {
      handleInputChange('city', selectedOffice.District);
      handleInputChange('state', selectedOffice.State);
    }
  };
  const saveAddress = async () => {
    try {
        // Validate required fields
        const { recievers_name, recievers_phone, street, city, state, postalCode, address } = formData;
console.log(recievers_name)
        if (!recievers_name || !recievers_phone || !street || !city || !state || !postalCode || !address) {
            alert("Please fill all required fields.");
            return;
        }

        // Retrieve the token
        const token = localStorage.getItem('mealdelight');
        if (!token) {
            throw new Error("No authentication token found");
        }

        // Make API call
        const response = await fetch(`${host}/user/addAddress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ recievers_name, recievers_phone, street, city, state, postalCode, address })
        });

        // Handle response
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || "Failed to save address");
        }

        const resp = await response.json();
        console.log('Address successfully added:', resp);
        
        // Clear form and show success
        
        setFormData({
            recievers_name: '',
            recievers_phone: '',
            apartment: '',
            street: '',
            city: '',
            state: '',
            country: 'IN',
            postalCode: '',
            address: ''
        });
       setStep('address')
    } catch (error) {
        console.error('Error in adding address:', error.message);
        alert(`Error: ${error.message}`);
    }
};


  

  return (
    <div className="address-form" >
      <h2 className="form-title">Add New Address</h2>
      <input
        className="inp"
        type="text"
        value={formData.recievers_name}
        onChange={(e) => handleInputChange('recievers_name', e.target.value)}
        placeholder="Receiver's Name"
        required
      />
      <input
        className="inp"
        type="text"
        value={formData.recievers_phone}
        onChange={(e) => handleInputChange('recievers_phone', e.target.value)}
        placeholder="Receiver's Phone"
        required
      />
      <input
        className="inp"
        type="text"
        value={formData.apartment}
        onChange={(e) => handleInputChange('apartment', e.target.value)}
        placeholder="Apartment / Flat"
        required
      />
      <input
        className="inp"
        type="text"
        value={formData.street}
        onChange={(e) => handleInputChange('street', e.target.value)}
        placeholder="Street"
        required
      />
      <input
        className="inp"
        type="text"
        value={formData.postalCode}
        onChange={(e) => handlePostalCodeChange(e.target.value)}
        placeholder="Zip Code"
        required
      />
      {isSearchingPostalCode && <p className="search-message">{message}</p>}
      {postOffices.length > 0 && (
        <select
          className="inp"
          value={selectedPostOffice}
          onChange={handlePostOfficeChange}
        >
          <option value="">Select Post Office</option>
          {postOffices.map((postOffice, index) => (
            <option key={index} value={postOffice.Name}>
              {postOffice.Name}
            </option>
          ))}
        </select>
      )}
      <input
        className="inp"
        type="text"
        value={formData.city}
        placeholder="City"
        readOnly
        required
      />
      <input
        className="inp"
        type="text"
        value={formData.state}
        placeholder="State"
        readOnly
        required
      />
      <input
        className="inp"
        type="text"
        // value={formData.country}
        // onChange={(e) => handleInputChange('country', e.target.value)}
        placeholder="India"
        required
      />
      <textarea
        className="inp"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        placeholder="Full Address"
        required
      />
      <button type="submit" onClick={()=>{saveAddress()}} className="submit-btn">
        Save Address
      </button>
    </div>
  );
};

export default AddNewAddress;
