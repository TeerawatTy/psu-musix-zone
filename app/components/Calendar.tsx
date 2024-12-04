// app/components/Calendar.tsx

"use client";

import { useState } from "react";

interface CalendarProps {
  onDateSelect: (date: Date, time: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];

  const generateCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const calendarDays: (Date | null)[] = [];

    // Empty slots for days before the first of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Days in the current month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(currentYear, currentMonth, day));
    }

    return calendarDays;
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setIsPopupOpen(true); // Open time selection popup
  };

  const handleTimeSubmit = () => {
    if (selectedDate && selectedTime) {
      // Combine the selected date and time into a single Date object
      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":").map(Number);

      // Set the time to the selected hours and minutes
      selectedDateTime.setHours(hours, minutes, 0, 0);

      // Pass the combined date and time to the parent component
      onDateSelect(selectedDateTime, selectedTime);
      setIsPopupOpen(false); // Close the popup after saving
    } else {
      alert("Please select both date and time.");
    }
  };

  const calendarDays = generateCalendar();

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-700">
        <button onClick={handlePrevMonth} className="text-white">Previous</button>
        <h2 className="text-white font-bold">{`${monthNames[currentMonth]} ${currentYear}`}</h2>
        <button onClick={handleNextMonth} className="text-white">Next</button>
      </div>

      <div className="grid grid-cols-7 gap-2 p-4 text-black">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-semibold">{day}</div>
        ))}

        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`text-center py-2 border cursor-pointer ${
              day &&
              day.toDateString() === (selectedDate?.toDateString() ?? "") &&
              "bg-orange-500 text-white"
            }`}
            onClick={() => day && handleDateClick(day)}
          >
            {day ? day.getDate() : ""}
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Select Time for {selectedDate?.toDateString()}
            </h3>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsPopupOpen(false)} // Close without saving
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleTimeSubmit} // Save and confirm the selected time and date
                className="px-4 py-2 bg-orange-500 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
