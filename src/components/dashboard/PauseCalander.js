import React, { useState } from "react";
import "../../style/userdashboard/pauseCalander.css";

const PauseCalander = ({ endDate, planId }) => {
  const maxDays = 10;
  const startDate = new Date(); // Current date as the start date
  endDate = new Date(endDate);

  const [selectedDates, setSelectedDates] = useState([]);

  // Generate calendar days for the current range
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

  // Handle date click
  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split("T")[0]; // Store in YYYY-MM-DD format

    if (selectedDates.length === 0) {
      // Select the first date
      setSelectedDates([dateStr]);
    } else {
      const firstDate = new Date(selectedDates[0]);
      const lastDate = new Date(selectedDates[selectedDates.length - 1]);
      const clickedDate = new Date(dateStr);

      if (dateStr === selectedDates[0]) {
        // Deselect the first date
        setSelectedDates((prevDates) => prevDates.slice(1));
      } else if (dateStr === selectedDates[selectedDates.length - 1]) {
        // Deselect the last date
        setSelectedDates((prevDates) => prevDates.slice(0, -1));
      } else {
        let start, end;

        if (clickedDate < firstDate) {
          start = clickedDate;
          end = lastDate;
        } else if (clickedDate > lastDate) {
          start = firstDate;
          end = clickedDate;
        } else {
          start = firstDate;
          end = lastDate;
        }

        // Generate the new range of dates
        const range = [];
        let current = new Date(start);
        while (current <= end) {
          range.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }

        if (range.length > maxDays) {
          alert(`You can select up to ${maxDays} days only.`);
          return;
        }

        setSelectedDates(range);
      }
    }
  };

  // Check if a date is selected
  const isDateSelected = (date) =>
    selectedDates.includes(date.toISOString().split("T")[0]);

  return (
    <>
      <div className="pause-calendar">
        <div className="calendar-grid">
          {days.map((day) => {
            const isSelected = isDateSelected(day);

            return (
              <div
                key={day}
                className={`calendar-day ${isSelected ? "selected" : ""}`}
                onClick={() => handleDateClick(day)}
              >
                <span>{day.getDate()}</span>
                <small>
                  {day.toLocaleString("default", { month: "short" })},{" "}
                  {day.getFullYear()}
                </small>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PauseCalander;
