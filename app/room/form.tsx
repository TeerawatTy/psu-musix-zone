// app/room/form.tsx

"use client"; // Ensure this file is treated as a Client Component

import { useState } from "react";
import Calendar from "../components/Calendar"; // Import Calendar Component

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    roomNumber: "",
    phoneNumber: "",
    startTime: "", // Track start time
    endTime: "",   // Track end time
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handles input change for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Reservation Data before submission:", formData);

    // Ensure no fields are empty
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        alert(`Please fill in the ${key}`);
        return;
      }
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData including startTime and endTime
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      console.log(data);

      setSuccess(true);
      setFormData({
        roomNumber: "",
        phoneNumber: "",
        startTime: "",
        endTime: "",
      }); // Reset form after successful submission

      alert("Reservation successful!");
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handles date selection from Calendar
  const handleDateSelect = (date: Date) => {
    // Adjust the date to the local time (no timezone offset adjustment)
    const localDate = new Date(date);

    // Ensure we are storing and displaying the correct local start time
    const formattedStartTime = localDate.toLocaleString(); // Use local time format for display

    // Calculate end time (e.g., adding 2 hours for the reservation)
    const calculatedEndTime = new Date(localDate);
    calculatedEndTime.setHours(localDate.getHours() + 2); // Adding 2 hours

    setFormData((prevData) => ({
      ...prevData,
      startTime: formattedStartTime, // Use the formatted start time
      endTime: calculatedEndTime.toLocaleString(), // Use calculated end time
    }));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Make a Reservation</h2>

      {/* Display success or error messages */}
      {success && <div className="text-green-500 text-center mb-4">Reservation was successful!</div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
            Room Number
          </label>
          <input
            type="number"
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter room number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter phone number"
          />
        </div>

        {/* Calendar Integration */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Select Date</label>
          <Calendar onDateSelect={handleDateSelect} />
          {formData.startTime && (
            <div className="mt-2 text-sm text-gray-600">
              Selected Start Time: {formData.startTime}
            </div>
          )}
        </div>

        {/* End Time (optional, calculated automatically) */}
        <div className="form-group">
          {formData.endTime && (
            <div className="mt-2 text-sm text-gray-600">
              Calculated End Time: {formData.endTime}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-green-600'}`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
