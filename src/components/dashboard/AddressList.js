import React, { useState, useEffect } from 'react';
import { host } from '../../script/variables';
import '../../style/userdashboard/addressList.css';

const AddressList = ({ selectedAddress, setSelectedAddress }) => {
  const [addresses, setAddresses] = useState([]); // To store fetched addresses
  const [hasMore, setHasMore] = useState(true); // To check if there are more addresses to load
  const [page, setPage] = useState(1); // Current page for pagination
  const [loading, setLoading] = useState(false); // Loading state to prevent multiple fetches

  const fetchAddress = async () => {
    if (loading) return; // Prevent multiple fetches at the same time
    setLoading(true); // Set loading to true before fetching data

    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${host}/user/get_address`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();

      // Assuming `data.address` contains the list of addresses
      setAddresses((prevAddress) => [...prevAddress, ...data.address]);
      setHasMore(data.hasMore); // Check if more addresses are available
      setPage((prevPage) => prevPage + 1); // Increment the page for next fetch
    } catch (error) {
      console.error('Error fetching addresses:', error.message);
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };

  useEffect(() => {
    fetchAddress(); // Fetch addresses when the component mounts
  }, []);

  // Infinite scroll logic
  const handleScroll = () => {
    // Check if the user is near the bottom of the page
    const bottom = document.documentElement.scrollHeight === document.documentElement.scrollTop + window.innerHeight;

    if (bottom && hasMore && !loading) {
      fetchAddress(); // Fetch more addresses if more are available and not currently loading
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading]);

  return (
    <div className="address-list-container">
      <ul className="address-list">
  {addresses.length > 0 ? (
    addresses.map((address) => (
      <li key={address._id} className="address-item">
        <p><strong>Name:</strong> {address.recievers_name}</p>
        <p><strong>Phone:</strong> {address.recievers_phone}</p>
        <p><strong>Street:</strong> {address.street}</p>
        <p><strong>City:</strong> {address.city}</p>
        <p><strong>State:</strong> {address.state}</p>
        <p><strong>Postal Code:</strong> {address.postalCode}</p>
        <p><strong>Country:</strong> {address.country}</p>
        <p><strong>Address:</strong> {address.address}</p>
        {/* Optional button to select address */}
        <button className="select-btn" onClick={() => setSelectedAddress(address)}>
          Select Address
        </button>
      </li>
    ))
  ) : (
    <p>No addresses found.</p>
  )}
</ul>

      {loading && <p>Loading more...</p>}
      {!hasMore && <p>No more addresses to load.</p>}
    </div>
  );
};

export default AddressList;
