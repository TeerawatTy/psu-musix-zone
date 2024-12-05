// app/components/EditForm.tsx

"use client"; // Ensure this file is treated as a Client Component

import React, { useState, useEffect } from "react";
import Calendar from "../components/Calendar"; // Import Calendar Component

interface EditFormProps {
  reservation: any;
  onSubmit: (updatedReservation: any) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ reservation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    roomNumber: reservation.roomNumber || "", // roomNumber will be displayed as read-only
    phoneNumber: reservation.phoneNumber || "",
    startTime: reservation.startTime || "",
    endTime: reservation.endTime || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Handles input change for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles date selection from Calendar
  const handleDateSelect = (date: Date) => {
    const localDate = new Date(date);
    const formattedStartTime = localDate.toISOString(); // Ensure proper ISO format for backend

    const calculatedEndTime = new Date(localDate);
    calculatedEndTime.setHours(localDate.getHours() + 2); // Calculate an end time 2 hours after the start time

    setFormData((prevData) => ({
      ...prevData,
      startTime: formattedStartTime,
      endTime: calculatedEndTime.toISOString(), // Use ISO format for consistency
    }));
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phoneNumber) {
      setError("Phone number is required.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error state before submission

    try {
      const response = await fetch(`/api/reservation/${reservation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Ensure this header is set
        },
        body: JSON.stringify(formData), // Ensure this is valid JSON data
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.message || 'An error occurred during update.'}`);
        return;
      }

      const updatedReservation = await response.json();
      onSubmit(updatedReservation); // Pass updated data to parent
      alert('Reservation updated successfully!');
    } catch (error) {
      console.error("Error updating reservation:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold text-center mb-4 text-black">Edit Reservation</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room Number (Read-only) */}
        <div className="form-group">
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
            Room Number
          </label>
          <div className="text-black w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100">
            {formData.roomNumber} {/* Display room number as text */}
          </div>
        </div>

        {/* Phone Number */}
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
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Select Date (Calendar) */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Select Date</label>
          <Calendar onDateSelect={handleDateSelect} />
          {formData.startTime && (
            <div className="mt-2 text-sm text-gray-600">
              Selected Start Time: {new Date(formData.startTime).toLocaleString()}
            </div>
          )}
        </div>

        {formData.endTime && (
          <div className="form-group">
            <div className="text-sm text-gray-600">
              Calculated End Time: {new Date(formData.endTime).toLocaleString()}
            </div>
          </div>
        )}

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
