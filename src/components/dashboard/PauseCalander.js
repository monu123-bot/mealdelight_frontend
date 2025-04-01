import React, { useState, useEffect } from "react";
import "../../style/userdashboard/pauseCalander.css";
import { host } from "../../script/variables";

const PauseCalander = ({ endDate, planTransactionId, pausedDates,setPausedDates,saveDatesToBackend}) => {
  const maxDays = 10;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  endDate = new Date(endDate);

  const [dates, setDates] = useState([]); // Array to manage all dates between start and end

  // Fetch paused slots from the backend
  useEffect(() => {
    const fetchPausedSlots = async () => {
      try {
        const token = localStorage.getItem('mealdelight');
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${host}/plans/getPausedSlots/${planTransactionId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          // Set paused dates from backend
          setPausedDates(result.pausedSlots || []);
        } else {
          alert("Failed to fetch paused slots!");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("An error occurred while fetching paused slots.");
      }
    };

    fetchPausedSlots();
  }, [planTransactionId]);

  // Generate days between start and end dates
  const generateDays = (start, end) => {
    const days = [];
    let current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const days = generateDays(startDate, endDate);

  // Handle the selection and deselection of dates
  const handleDateClick = (date) => {
    console.log(pausedDates)
    const dateStr = date.toISOString().split("T")[0];

    // Check if the date is already in the pausedDates array
    const isPaused = pausedDates.includes(dateStr);

    if (isPaused) {
      // If the date is already paused, remove it from the pausedDates array
      setPausedDates((prevPausedDates) => prevPausedDates.filter(d => d !== dateStr));
    } else {
      // If the date is not paused, check if the total number of paused days exceeds maxDays
      if (pausedDates.length >= maxDays) {
        alert(`You can select up to ${maxDays} days in total.`);
        return;
      }
      // Add the new date to the pausedDates array
      setPausedDates((prevPausedDates) => [...prevPausedDates, dateStr]);
    }
  };

  // Check if the date is in the paused dates
  const isDatePaused = (date) => pausedDates.includes(date.toISOString().split("T")[0]);

  

  return (
    <div className="calendar-grid">
      {days.map((day) => {
        const isPaused = isDatePaused(day);

        return (
          <div
            key={day}
            className={`calendar-day ${isPaused ? "paused" : ""}`}
            onClick={() => handleDateClick(day)}
            style={{ backgroundColor: isPaused ? "lightgreen" : "" }} // Light green for paused dates
          >
            <span>{day.getDate()}</span>
            <small>
              {day.toLocaleString("default", { month: "short" })}, {day.getFullYear()}
            </small>
          </div>
        );
      })}
      <button onClick={saveDatesToBackend}>
        Save Dates
      </button>
    </div>
  );
};

export default PauseCalander;
