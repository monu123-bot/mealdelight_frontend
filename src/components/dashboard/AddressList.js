import React, { useState, useEffect } from 'react';
import { host } from '../../script/variables';
import '../../style/userdashboard/addressList.css';

const AddressList = ({ selectedAddress, setSelectedAddress }) => {
  const [addresses, setAddresses] = useState([]); // Store fetched addresses
  const [hasMore, setHasMore] = useState(true); // Check if there are more addresses
  const [page, setPage] = useState(1); // Current page for pagination
  const [loading, setLoading] = useState(false); // Prevent multiple fetches
  const [defaultSet, setDefaultSet] = useState(false); // Ensure default is set only once

  const fetchAddress = async () => {
    if (loading) return; // Prevent concurrent fetches
    setLoading(true);

    try {
      const token = localStorage.getItem('mealdelight');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${host}/user/get_address?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch addresses');

      const data = await response.json();
      const newAddresses = data.address.filter(
        (newAddr) => !addresses.some((existingAddr) => existingAddr._id === newAddr._id)
      );

      const sortedAddresses = [...addresses, ...newAddresses].sort(
        (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
      );

      setAddresses(sortedAddresses);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching addresses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress(); // Initial fetch on component mount
  }, []);

  useEffect(() => {
    // Set default address only once
    if (!defaultSet && addresses.length > 0) {
      const defaultAddr = addresses.find((addr) => addr.isDefault);
      if (defaultAddr) {
        console.log('default address is ',defaultAddr)
        setSelectedAddress(defaultAddr);
        setDefaultSet(true);
      }
    }
  }, [addresses, defaultSet, setSelectedAddress]);

  const handleScroll = () => {
    const bottom =
      document.documentElement.scrollHeight ===
      document.documentElement.scrollTop + window.innerHeight;

    if (bottom && hasMore && !loading) {
      fetchAddress();
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
              <br />
              <p>{address.isDefault && 'Default address'}</p>
              <br />
              <p><strong>Name:</strong> {address.recievers_name}</p>
              <p><strong>Phone:</strong> {address.recievers_phone}</p>
              <p><strong>Street:</strong> {address.street}</p>
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>State:</strong> {address.state}</p>
              <p><strong>Postal Code:</strong> {address.postalCode}</p>
              <p><strong>Country:</strong> {address.country}</p>
              <p><strong>Address:</strong> {address.address}</p>
              <button
                className="select-btn"
                onClick={() => setSelectedAddress(address)}
              >
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
