// app/admin/EditForm.tsx

"use client"; // Ensure this file is treated as a Client Component

import { useState, useEffect } from "react";
import Calendar from "../components/Calendar"; // Import Calendar Component

const EditForm = ({ reservation, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    roomNumber: reservation.roomNumber || "",
    phoneNumber: reservation.phoneNumber || "",
    startTime: reservation.startTime || "",
    endTime: reservation.endTime || "",
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
  
    // Ensure all fields are filled
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
      const response = await fetch(`/api/reservation/${reservation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const text = await response.text(); // Get raw response text
  
      if (!response.ok) {
        // Try to parse JSON if possible, otherwise use the raw text
        let errorMessage = text;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || 'An error occurred';
        } catch (e) {
          // If it's not valid JSON, use the raw response text
          errorMessage = "An unexpected error occurred.";
        }
  
        setError(`Error: ${errorMessage}`);
        return;
      }
  
      const data = JSON.parse(text); // Parse the valid JSON response
  
      console.log("Updated Reservation:", data);
  
      setSuccess(true);
      onSubmit(formData); // Trigger onSubmit from parent (AdminPage)
      alert("Reservation updated successfully!");
    } catch (error) {
      console.error("Error updating reservation:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  // Handles date selection from Calendar
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) {
      return;
    }
  
    setLoading(true);
    setError("");
    setSuccess(false);
  
    try {
      const response = await fetch(`/api/reservation/${reservation.id}`, {
        method: "DELETE",
      });
  
      const text = await response.text(); // Log raw response text
  
      if (!response.ok) {
        let errorMessage = text;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || 'Error occurred while deleting';
        } catch (e) {
          errorMessage = "An unexpected error occurred.";
        }
  
        setError(`Error: ${errorMessage}`);
        return;
      }
  
      alert("Reservation deleted successfully!");
      onCancel(); // Call cancel or update the state in parent component to reflect the deletion
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Reservation</h2>

      {/* Display success or error messages */}
      {success && <div className="text-green-500 text-center mb-4">Reservation was updated!</div>}
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
          className={`w-full py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          {loading ? "Submitting..." : "Update Reservation"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditForm;
