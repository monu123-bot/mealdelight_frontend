import React, { useEffect, useState } from "react";
import { host } from "../../script/variables";
import "../../style/Home/map.css";

const StoreMap = () => {
  const [stores, setStores] = useState([]);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [selectedStore, setSelectedStore] = useState(null); // Store the selected store information
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup visibility state

  const indiaBounds = { minLat: 6, maxLat: 37, minLong: 68, maxLong: 97 };

  // Map latitude and longitude to SVG coordinates
  const mapCoordinatesToSVG = (latitude, longitude) => {
    const { width, height } = containerSize;
    const x = ((longitude - indiaBounds.minLong) / (indiaBounds.maxLong - indiaBounds.minLong)) * width;
    const y = height - ((latitude - indiaBounds.minLat) / (indiaBounds.maxLat - indiaBounds.minLat)) * height;
    return { x, y };
  };

  // Fetch store data from the API
  const fetchStores = async () => {
    try {
      const response = await fetch(`${host}/darkkitchen/get-list`);
      if (!response.ok) throw new Error("Failed to fetch stores");
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error.message);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Update container size on window resize
  const updateContainerSize = () => {
    const container = document.getElementById("map-container");
    if (container) {
      setContainerSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    }
  };

  useEffect(() => {
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  const handleStoreClick = (store) => {
    setSelectedStore(store); // Set selected store information
    setIsPopupVisible(true); // Show the popup
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Hide the popup
  };

  return (
    <div className="container">
      {/* Map Section */}
      <div id="map-container" className="map-container">
        <img src="/in.svg" alt="India Map" className="india-map" />

        {/* Highlight Store Locations */}
        {stores.map((store) => {
          const { x, y } = mapCoordinatesToSVG(
            store.location.coordinates[1],
            store.location.coordinates[0]
          );
          return (
            <div
              key={store.id}
              className="location-indicator"
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={() => handleStoreClick(store)}
              title={store.name}
            />
          );
        })}
      </div>

      {/* Popup for Store Details */}
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}>
              &times;
            </button>
            <h3>{selectedStore?.name}</h3>
            <p>
              <strong>Address:</strong> {selectedStore?.address}
            </p>
            <p>
              <strong>Latitude:</strong> {selectedStore?.location.coordinates[1]}
            </p>
            <p>
              <strong>Longitude:</strong> {selectedStore?.location.coordinates[0]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreMap;
