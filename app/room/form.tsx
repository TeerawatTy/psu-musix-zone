// app/room/form.tsx

"use client"; // Ensure this file is treated as a Client Component

import { useState } from "react";
import axios from "axios";

const ReserveRoomForm = () => {
  const [reservationName, setReservationName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors before submitting
    setErrorMessage("");

    // Basic validation
    if (!reservationName || !roomNumber || !date || !startTime || !phoneNumber) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Ensure start time is between 08:00 and 18:00
    const startTimeHour = parseInt(startTime.split(":")[0], 10);
    if (startTimeHour < 8 || startTimeHour >= 18) {
      setErrorMessage("Start time must be between 08:00 and 18:00.");
      return;
    }

    // Calculate check-in and check-out times
    const checkIn = new Date(`${date}T${startTime}:00`);
    const checkOut = new Date(checkIn.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    setLoading(true); // Start loading state

    try {
      const response = await axios.post("/api/reservation", {
        reservationName,
        roomNumber,
        date,
        startTime,
        phoneNumber,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });
      alert(response.data.message); // Show success message

      // Optionally, clear form fields on success
      setReservationName("");
      setRoomNumber("");
      setDate("");
      setStartTime("");
      setPhoneNumber("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto bg-white shadow-md rounded-md text-black">
      <h2 className="text-2xl font-bold">Reserve a Room</h2>

      <div>
        <label className="block text-sm font-semibold">Reservation Name</label>
        <input
          type="text"
          value={reservationName}
          onChange={(e) => setReservationName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Room Number</label>
        <select
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Select Room</option>
          <option value="1">Room 1</option>
          <option value="2">Room 2</option>
          <option value="3">Room 3</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Phone Number</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          pattern="^\d{10}$"  // Accepts exactly 10 digits
          className="w-full px-4 py-2 border rounded-md"
        />

      </div>

      <button
        type="submit"
        className={`w-full bg-blue-500 text-white py-2 rounded-md ${loading ? 'bg-blue-300 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Reserve Room"}
      </button>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </form>
  );
};

export default ReserveRoomForm;
